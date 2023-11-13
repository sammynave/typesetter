import { formatter } from '$lib/formatter.js';
import { linebreak } from '$lib/linebreak.js';
import type { Hyphenator, ValidAlignment } from '$lib/types.js';
import { measure } from './measurer.js';
import { write } from './writer.js';

export const SvgTypesetter = ({
	text,
	targetNode,
	parentNode,
	lineLengths,
	alignment = 'justify',
	tolerance = 2,
	spaceChar = '|',
	startAt = 0,
	hyphenator
}: {
	text: string;
	targetNode: SVGTextElement;
	parentNode: SVGGElement;
	lineLengths: ReadonlyArray<number>;
	alignment?: ValidAlignment;
	tolerance?: number;
	spaceChar?: string;
	startAt?: number;
	hyphenator?: Hyphenator;
}) => {
	/* TODO
	 * actual benchmarks. we clone and replace to try and limit reflows
	 * but it hasn't been measured seriously so this may not be as fast as we
	 * think
	 */
	const svgElement = targetNode.cloneNode(true) as SVGTextElement;
	while (svgElement.lastChild) {
		svgElement.removeChild(svgElement.lastChild);
	}

	if (!svgElement) {
		return;
	}

	const format = formatter(
		(text: string) => measure(targetNode, parentNode, text).width,
		spaceChar,
		hyphenator
	);

	const nodes = format[alignment](text);
	const breaks = linebreak(nodes, lineLengths, tolerance);

	return breaks.length !== 0
		? (() => {
				const newSvgElement = write(
					svgElement,
					nodes,
					breaks,
					lineLengths,
					alignment === 'center',
					startAt
				);

				startAt
					? parentNode.appendChild(newSvgElement)
					: parentNode.replaceChild(newSvgElement, targetNode);

				return newSvgElement;
		  })()
		: (() => {
				/* TODO
				 * what do we actually want to do? the client should know that the typeset
				 * failed but maybe we don't want to throw?
				 */
				throw new Error('Can not typeset with current tolerance.');
		  })();
};
