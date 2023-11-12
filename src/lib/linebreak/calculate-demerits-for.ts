import { always, cond, T } from 'ramda';
import { isNegativePenalty, isPenalty, isPositivePenalty } from '../line-nodes.js';
import type { Penalty } from '../types.js';

/**
 * Adds a fitness penalty to the demerits if the fitness classes of two adjacent lines
 * differ too much.
 */
const maybeAddFitnessPenalty = (
	demerits: number,
	fitnessClass: number,
	active: any,
	options: any
) => {
	return Math.abs(fitnessClass - active.data.fitnessClass) > 1
		? demerits + options.demerits.fitness
		: demerits;
};

export const calculateDemeritsFor = (
	node: Penalty,
	options: any,
	active: any,
	nodes: ReadonlyArray<any>,
	ratio: number,
	fitnessClass: any
) => {
	const badness = 100 * Math.pow(Math.abs(ratio), 3);

	const demerits = cond([
		[
			isPositivePenalty,
			() => Math.pow(options.demerits.line + badness, 2) + Math.pow(node.penalty, 2)
		],
		[
			isNegativePenalty,
			() => Math.pow(options.demerits.line + badness, 2) - Math.pow(node.penalty, 2)
		],
		[T, always(Math.pow(options.demerits.line + badness, 2))]
	])(node);

	const demerits1 =
		isPenalty(node) && isPenalty(nodes[active.data.position])
			? demerits + options.demerits.flagged * node.flagged * nodes[active.data.position].flagged
			: demerits;

	const demerits2 = maybeAddFitnessPenalty(demerits1, fitnessClass, active, options);
	const demerits3 = demerits2 + active.data.demerits;

	return demerits3;
};
