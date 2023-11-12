import { always, compose, cond, isNil, lt, lte, or, prop, T, until, update } from 'ramda';
import { isForcedBreak } from '../line-nodes.js';
import { remove } from '../linked-list/index.js';
import type { LineNode } from '../types.js';
import { calculateDemeritsFor } from './calculate-demerits-for.js';
import { computeRatio } from './compute-ratio.js';

/**
 * ### Description
 * checks the distance betwen the active node and the current node.
 * if it exceeds the stretch or shrink limit when the current node
 * is a forced break.
 */
const shouldDeactivate = (ratio: number, node: LineNode) => or(lt(ratio, -1), isForcedBreak(node));

/**
 * Node is a candidate as a break if the ratio is between -1 and the given tolerance.
 */
const isCandidateForBreak = (ratio: number, tolerance: number) => -1 <= ratio && ratio <= tolerance;

const getFitnessClass = cond([
	[lt(-0.5), always(0)],
	[lte(0.5), always(1)],
	[lte(1), always(2)],
	[T, always(3)]
]);

export const findPotentialActiveNodes = until(
	compose(isNil, prop('active') as any),
	({
		active,
		index,
		totalShrink,
		totalStretch,
		totalWidth,
		lineLengths,
		nodes,
		demerits,
		candidates,
		activeNodes,
		node,
		options
	}: any) => {
		const next = prop('next', active);
		const ratio = computeRatio({
			active,
			last: nodes[index],
			lineLengths,
			totalShrink,
			totalStretch,
			totalWidth
		});

		const newActiveNodes = shouldDeactivate(ratio, node)
			? remove(activeNodes, active)
			: activeNodes;

		const newCandidates = isCandidateForBreak(ratio, options.tolerance)
			? (() => {
					const fitnessClass = getFitnessClass(ratio);
					const newDemerits = calculateDemeritsFor(
						node,
						options,
						active,
						nodes,
						ratio,
						fitnessClass
					);

					// Only store the best candidate for each fitness class
					const newCandidate =
						newDemerits < candidates[fitnessClass].demerits
							? ({ active, demerits: newDemerits, ratio } as any)
							: candidates[fitnessClass];

					return update(fitnessClass, newCandidate, candidates);
			  })()
			: candidates;

		return {
			active: next,
			activeNodes: newActiveNodes,
			candidates: newCandidates,
			demerits,
			index,
			lineLengths,
			node,
			nodes,
			options,
			ratio,
			totalShrink,
			totalStretch,
			totalWidth
		};
	}
);
