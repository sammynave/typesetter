import { and, assoc, not, or, slice } from 'ramda';
import { indexedReduceWhile } from '../common.js';
import { isBox, isForcedBreak, isGlue } from '../line-nodes.js';
import type { LineNode } from '../types.js';

const updateTotals = (acc: any, node: any) => {
	const totalWidth = acc.result.totalWidth + node.width;
	const totalStretch = acc.result.totalStretch + node.stretch;
	const totalShrink = acc.result.totalShrink + node.shrink;
	const updateAcc = assoc('result', { totalShrink, totalStretch, totalWidth });
	return updateAcc(acc);
};

// Add width, stretch and shrink values from the current
// break point up to the next box or forced penalty.
export const computeSum = (
	breakPointIndex: number,
	{ totalShrink, totalStretch, totalWidth, nodes }: any
) => {
	const pred = (_: any, node: LineNode, i: number) =>
		not(or(isBox(node), and(isForcedBreak(nodes), i > breakPointIndex)));

	const reducer = (acc: any, node: any) => {
		return isGlue(node) ? updateTotals(acc, node) : acc;
	};

	const seed = {
		result: {
			totalShrink,
			totalStretch,
			totalWidth
		}
	};

	const { result } = indexedReduceWhile(
		pred,
		reducer,
		seed,
		slice(breakPointIndex, Infinity, nodes)
	);

	return result;
};
