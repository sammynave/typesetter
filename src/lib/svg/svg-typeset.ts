import { formatter } from '$lib/formatter.js';
import { linebreak } from '$lib/linebreak.js';
import type { ValidAlignment } from '$lib/types.js';
import { measure } from './measurer.js';
import { write } from './writer.js';

export const SvgTypeset = async (
	text: string,
	element: SVGTextElement,
	parentNode: SVGGElement,
	alignment: ValidAlignment,
	lineLengths: ReadonlyArray<number>,
	tolerance: number,
	center: boolean,
	spaceChar: string,
	startAt: number = 0,
	withHyphenation: boolean = false
) => {
	/* TODO
	 * actual benchmarks. we clone and replace to try and limit reflows
	 * but it hasn't been measured seriously so this may not be as fast as we
	 * think
	 */
	const svgElement = element.cloneNode(true) as SVGTextElement;
	while (svgElement.lastChild) {
		svgElement.removeChild(svgElement.lastChild);
	}

	if (!svgElement) {
		return;
	}

	const format = await formatter(
		(x: any) => measure(element, parentNode, x).width,
		spaceChar,
		withHyphenation
	);

	const nodes = format[alignment](text);
	const breaks = linebreak(nodes, lineLengths, tolerance);

	return breaks.length !== 0
		? (() => {
				const newSvgElement = write(svgElement, nodes, breaks, lineLengths, center, startAt);

				startAt
					? parentNode.appendChild(newSvgElement)
					: parentNode.replaceChild(newSvgElement, element);

				return newSvgElement;
		  })()
		: (() => {
				/* TODO
				 * what do we actually want to do? the client show know the typeset
				 * failed but maybe we don't want to throw?
				 */
				throw new Error('Can not typeset with current tolerance.');
		  })();
};
