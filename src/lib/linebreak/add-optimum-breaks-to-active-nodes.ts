import { assoc, isNil, until } from 'ramda';
import { insertBreak } from '../breaks.js';
import { computeSum } from './compute-sum.js';
import { findPotentialActiveNodes } from './find-potential-breaks.js';

const addActiveNodes = (acc: any, candidate: any, fitnessClass: any) => {
	return candidate.demerits < Infinity ? insertBreak(acc, candidate, fitnessClass) : acc;
};

/* http://www.eprg.org/G53DOC/pdfs/knuth-plass-breaking.pdf
 * page 38 in pdf.
 * page 1156 in publication.
 */
export const findOptimumBreaks = until(
	({ active }) => isNil(active),
	({
		active,
		index,
		totalShrink,
		totalStretch,
		totalWidth,
		lineLengths,
		nodes,
		activeNodes,
		node,
		options
	}: any) => {
		const candidates: ReadonlyArray<any> = [
			{ demerits: Infinity },
			{ demerits: Infinity },
			{ demerits: Infinity },
			{ demerits: Infinity }
		];

		const results = findPotentialActiveNodes({
			active,
			activeNodes,
			candidates,
			demerits: 0,
			index,
			lineLengths,
			node,
			nodes,
			options,
			ratio: 0,
			totalShrink,
			totalStretch,
			totalWidth
		});

		const {
			totalWidth: totalWidth1,
			totalStretch: totalStretch1,
			totalShrink: totalShrink1
		} = computeSum(results.index, {
			nodes: results.nodes,
			totalShrink: results.totalShrink,
			totalStretch: results.totalStretch,
			totalWidth: results.totalWidth
		});

		return results.candidates.reduce(addActiveNodes, {
			active: results.active,
			activeNodes: results.activeNodes,
			index: results.index,
			totalShrink: totalShrink1,
			totalStretch: totalStretch1,
			totalWidth: totalWidth1
		});
	}
);

export const addOptimumBreaksToActiveNodes = ({
	acc,
	active,
	node,
	index,
	nodes,
	activeNodes,
	totalShrink,
	totalStretch,
	totalWidth,
	lineLengths,
	options
}: any) => {
	const { activeNodes: newActiveNodes } = findOptimumBreaks({
		active,
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
};
