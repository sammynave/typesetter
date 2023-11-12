import { assoc, compose, cond } from 'ramda';
import { infinity } from '../constants.js';
import { isBox, isGlue } from '../line-nodes.js';
import type { LineNode, Seed } from '../types.js';
import {
	addOptimumBreaksToActiveNodes,
	findOptimumBreaks
} from './add-optimum-breaks-to-active-nodes.js';

const notFirstAndPrevIsBox = (index: any, nodes: any) =>
	index > 0 && nodes[index - 1].kind === 'box';
const penaltyAndNotForcedBreak = (node: any) =>
	node.kind === 'penalty' && node.penalty !== infinity;

const choose = cond([
	[
		({ node }) => isBox(node),
		({ acc, node }) => assoc('totalWidth', acc.totalWidth + node.width)(acc)
	],

	[
		({ node }) => isGlue(node),
		({
			acc,
			acc: { activeNodes, totalShrink, totalStretch, totalWidth, lineLengths, options },
			node,
			index,
			nodes
		}) => {
			const acc1 = notFirstAndPrevIsBox(index, nodes)
				? addOptimumBreaksToActiveNodes({
						acc,
						active: activeNodes.head,
						activeNodes,
						index,
						lineLengths,
						node,
						nodes,
						options,
						totalShrink,
						totalStretch,
						totalWidth
				  })
				: acc;

			return compose(
				assoc('totalShrink', totalShrink + node.shrink),
				assoc('totalStretch', totalStretch + node.stretch),
				assoc('totalWidth', totalWidth + node.width)
			)(acc1);
		}
	],

	[
		({ node }) => penaltyAndNotForcedBreak(node),
		({ acc, node, nodes, index }) => {
			const { activeNodes, totalShrink, totalStretch, totalWidth, lineLengths, options } = acc;
			const { activeNodes: newActiveNodes } = findOptimumBreaks({
				acc,
				active: activeNodes.head,
				activeNodes,
				index,
				lineLengths,
				node,
				nodes,
				options,
				totalShrink,
				totalStretch,
				totalWidth
			});

			return assoc('activeNodes', newActiveNodes)(acc);
		}
	]
]);

/*
 * description on
 * page 40 in pdf
 * page 1158 in publication
 *
 */
export const chooseBreakpointSequence = (
	acc: Seed,
	node: LineNode,
	index: number,
	nodes: ReadonlyArray<LineNode>
): Seed => {
	const newAcc = choose({ node, acc, index, nodes });
	return newAcc ? newAcc : acc;
};
