import { assoc, isNil, until } from 'ramda';
import { append, linkedListNodeFrom } from './linked-list/index.js';
import type { BestBreakSettings, Break, LinkedListNode, ReducableLinkedList } from './types.js';

export const getBestBreaks = until(
	({ tmp }) => isNil(tmp),
	({ tmp, breaks }: BestBreakSettings) => {
		const b = breaks.concat([
			{
				position: tmp.data.position,
				ratio: tmp.data.ratio
			}
		]);

		return { tmp: tmp.data.previous, breaks: b };
	}
);

export const findBreaks = (activeNodes: ReducableLinkedList): ReadonlyArray<Break> => {
	/*
	 * Find the best active node (the one with the least total demerits.)
	 * TODO?: maybe tracking current best as an attr on activeNodes
	 * would be quicker. just need a strategy for removing nodes.
	 * maybe fallback to `map` if there's no `leastBad` on the list?
	 * might want to have a `leastBad` obj that tracks it during the
	 * `findPotentialActiveNodes` phase
	 */

	const tmp = activeNodes.reduce(
		(acc: LinkedListNode, node: LinkedListNode) => {
			return node.data.demerits < acc.data.demerits ? node : acc;
		},
		{ data: { demerits: Infinity }, next: null, prev: null }
	);

	// FIXME type this correctly
	// tslint:disable
	const { breaks } = getBestBreaks({ tmp, breaks: [] });
	// tslint:enable

	return breaks.reverse();
};

export const insertBreak = (acc: any, candidate: any, fitnessClass: any) => {
	const { activeNodes, index, totalWidth, totalStretch, totalShrink } = acc;
	const brk = {
		demerits: candidate.demerits,
		fitnessClass,
		line: candidate.active.data.line + 1,
		position: index,
		previous: candidate.active,
		ratio: candidate.ratio,
		totalShrink,
		totalStretch,
		totalWidth
	};

	return assoc('activeNodes', append(activeNodes, linkedListNodeFrom(brk)))(acc);
};
