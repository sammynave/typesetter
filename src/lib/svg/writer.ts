import type { Box, Break, Glue, LineNode } from '$lib/types.js';
import { infinity } from '$lib/constants.js';
import { createTspan } from './measurer.js';
import type { Line, WriteLineAccumulator, WriteLineNodeAccumulator } from './types.js';

export const Y_EM = 1.2;
export const TOP_PAD = 3;

const COMBINE_TSPANS = true;

const moveToNextLine = (y: number) => y + Y_EM;

const handleBox = (acc: WriteLineNodeAccumulator, node: Box) => {
	const t = createTspan(node.value, acc.x, acc.y);
	// tslint:disable no-expression-statement no-object-mutation
	acc.svgElement.appendChild(t);
	// @ts-ignore TODO: use ramda
	acc.x += node.width;
	// tslint:enable no-expression-statement no-object-mutation
	return acc;
};

const handleGlue = (acc: WriteLineNodeAccumulator, node: Glue) => {
	// tslint:disable no-expression-statement no-object-mutation
	// @ts-ignore TODO: use ramda
	acc.x += node.width + acc.line.ratio * (acc.line.ratio < 0 ? node.shrink : node.stretch);
	// tslint:enable no-expression-statement no-object-mutation
	return acc;
};

const handleHyphenate = (acc: WriteLineNodeAccumulator) => {
	// tslint:disable no-expression-statement
	acc.svgElement.appendChild(createTspan('-', acc.x, acc.y));
	// tslint:enable no-expression-statement
	return acc;
};

const shouldCombine = (_: Box, array: ReadonlyArray<LineNode>, index: number) => {
	const prev = array[index - 1];
	const prevPrev = array[index - 2];
	return prev && prev.kind === 'penalty' && prevPrev && prevPrev.kind === 'box';
};

const writeLineNode = (
	acc: WriteLineNodeAccumulator,
	node: LineNode,
	index: number,
	array: ReadonlyArray<LineNode>
) => {
	// tslint:disable no-if-statement
	if (node.kind === 'box') {
		return COMBINE_TSPANS
			? shouldCombine(node, array, index)
				? (() => {
						const prevTspan = acc.svgElement.lastChild;
						// tslint:disable no-object-mutation no-expression-statement
						// @ts-ignore
						prevTspan.textContent = prevTspan.textContent + node.value;
						// @ts-ignore
						acc.x += node.width;
						// tslint:enable no-object-mutation no-expression-statement
						return acc;
				  })()
				: handleBox(acc, node)
			: handleBox(acc, node);
	} else if (node.kind === 'glue') {
		return handleGlue(acc, node);
	} else if (node.kind === 'penalty' && node.penalty === 100 && index === array.length - 1) {
		return handleHyphenate(acc);
	} else {
		return acc;
	}
	// tslint:enable no-if-statement
};

const writeLine = (acc: WriteLineAccumulator, line: Line, lineIndex: number) => {
	const lineLength =
		lineIndex < acc.lineLengths.length
			? acc.lineLengths[lineIndex]
			: acc.lineLengths[acc.lineLengths.length - 1];
	const x = acc.center ? (acc.maxLength - lineLength) / 2 : 0;
	const { svgElement } = line.nodes.reduce(writeLineNode, {
		line,
		svgElement: acc.svgElement,
		x,
		y: acc.y
	});

	// tslint:disable no-expression-statement no-object-mutation
	// @ts-ignore TODO: use ramda
	acc.svgElement = svgElement;
	// @ts-ignore TODO: use ramda
	acc.y = moveToNextLine(acc.y);
	// tslint:enable no-expression-statement no-object-mutation

	return acc;
};

// TODO: rewrite with ramda
const findBeginningOfNextLine = (lineStart: number, nodes: ReadonlyArray<LineNode>) => {
	// tslint:disable
	let startOfNextLine;

	for (let j = lineStart; j < nodes.length; ++j) {
		// After a line break, we skip any nodes unless they are boxes or forced breaks.
		const node = nodes[j];
		if (node.kind === 'box' || (node.kind === 'penalty' && node.penalty === -infinity)) {
			startOfNextLine = j;
			break;
		}
	}
	// tslint:enable

	return startOfNextLine;
};

export const write = (
	svgElement: SVGTextElement,
	nodes: ReadonlyArray<LineNode>,
	breaks: ReadonlyArray<Break>,
	lineLengths: ReadonlyArray<number>,
	center: boolean,
	startAt: number
) => {
	// tslint:disable
	let lines = [] as ReadonlyArray<Line>;
	let lineStart = 0;

	// Iterate through the line breaks, and split the nodes at the
	// correct point.
	for (let i = 1; i < breaks.length; ++i) {
		let nodesOfNextLine = nodes.slice(
			findBeginningOfNextLine(lineStart, nodes),
			breaks[i].position + 1
		);

		lines = lines.concat([
			{
				ratio: breaks[i].ratio,
				nodes: nodesOfNextLine,
				position: breaks[i].position
			}
		]);

		lineStart = breaks[i].position;
	}

	// @ts-ignore
	let maxLength = Math.max.apply(null, lineLengths);
	// @ts-ignore
	return lines.reduce(writeLine, {
		y: startAt,
		lineLengths,
		maxLength,
		svgElement,
		center
	}).svgElement;
};
