import { findBreaks } from './breaks.js';
import { indexedReduce } from './common.js';
import { chooseBreakpointSequence } from './linebreak/choose-breakpoint-sequence.js';
import { isEmpty, linkedListFrom } from './linked-list/index.js';

import type { Break, LineNode, Seed } from './types.js';

/* create an active node representing the beginning of the paragraph
 * page 40 in pdf
 * page 1158 in publication
 */
const beginningOfParagraph = {
	demerits: 0,
	fitnessClass: 0,
	line: 0,
	position: 0,
	previous: null,
	ratio: 0,
	totalShrink: 0,
	totalStretch: 0,
	totalWidth: 0
};

export const linebreak = (
	nodes: ReadonlyArray<LineNode>,
	lineLengths: ReadonlyArray<number>,
	tolerance: number = 2
): ReadonlyArray<Break> => {
	const seed = {
		activeNodes: linkedListFrom([beginningOfParagraph]),
		lineLengths,
		options: {
			demerits: {
				fitness: 3000,
				flagged: 100,
				line: 10
			},
			tolerance
		},
		totalShrink: 0,
		totalStretch: 0,
		totalWidth: 0
	};

	const { activeNodes: newActiveNodes } = indexedReduce(chooseBreakpointSequence, seed, nodes);
	const failed: ReadonlyArray<Break> = [];
	return isEmpty(newActiveNodes) ? failed : findBreaks(newActiveNodes);
};
