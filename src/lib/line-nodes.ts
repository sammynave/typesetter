import { and, gte, lt, prop, propEq } from 'ramda';
import { infinity } from './constants.js';
import type { Box, Glue, LineNode, Penalty } from './types.js';

/**
 * ### Description
 * Glue refers to blank space that can vary its
 * width in specified ways; it is an elastic
 * mortar used between boxes in a typeset line
 *
 * page 3 in [Knuth/Plass pdf](https://github.com/sammynave/typesetter/master/reference/knuth-plass-breaking.pdf)
 *
 * ### Example
 * ```js
 * glue(3, 6, 10); // => { kind: 'glue', shrink: 3, stretch: 6, width: 10 }
 * ```
 *
 * @param width   The width as measured in context. SVG in our case.
 * @param stretch The width as measured in context. SVG in our case.
 * @param shrink  The width as measured in context. SVG in our case.
 * @returns       A Line node of type Box.
 */
export const glue = (width: number, stretch: number, shrink: number): Glue => {
	return {
		kind: 'glue',
		shrink,
		stretch,
		width
	};
};

/**
 * ### Description
 * A box refers to something that is to be typeset.
 *
 * ### Reference
 * page 3 in [Knuth/Plass pdf](https://github.com/sammynave/typesetter/master/reference/knuth-plass-breaking.pdf)
 *
 * ### Example
 * ```js
 * box(10, 'hi'); // => { kind: 'box', value: 'hi', width: 10 }
 * ```
 *
 * @param value   The word/syllable/whatever to be typeset.
 * @param width   The width as measured in context. SVG in our case.
 * @returns       A Line node of type Box.
 */
export const box = (width: number, value: string): Box => {
	return {
		kind: 'box',
		value,
		width
	};
};

/**
 * ### Description
 * Penalty specifications refer to potential
 * places to end one line of a paragraph and
 * begin another, with a certain ‘aesthetic
 * cost’ indicating how desirable or undesirable
 * such a breakpoint would be.
 *
 * ### Reference
 * page 4 in [Knuth/Plass pdf](https://github.com/sammynave/typesetter/master/reference/knuth-plass-breaking.pdf)
 *
 * ### Example
 * ```js
 * penalty(10, -10000, 1); // => { kind: 'penalty', flagged: 1, width: 10, penalty: -10000 }
 * ```
 * @param width     If a line break occurs at this place in the paragraph, additional typeset
 * material of this width will be added to the line just before the break occurs. For example,
 * a potential place at which a word might be hyphenated would be indicated by letting `penalty`
 * be the penalty for hyphenating there and letting `width` be the width of the hyphen
 * @param penalty   Helps us decide whether or not to end a line at this point. A high penalty
 * indicates a relatively poor place to break, while a negative value indicates a good breaking-off
 * place. The penalty may also be +Infinity or -Infinity, where ‘Infitnity’ denotes a large number
 * that is infinite for practical purposes, although it really is finite; Any penalty >= 10000 is
 * treated as +Infinity, and any penalty <= -10000 is treated as -Infinity. When +Infinity, the break
 * is strictly prohibited; when -Infinity the break is mandatory.
 * @param flagged   Flagged = 1. Unflagged = 0. We try to avoid having two consecutive breaks at
 * flagged penalties (e.g. two hyphens in a row).
 * @returns         A Line node of type Penalty.
 */
export const penalty = (width: number, penalty: number, flagged: 0 | 1): Penalty => {
	return {
		flagged,
		kind: 'penalty',
		penalty,
		width
	};
};

export const isPenalty = propEq('penalty', 'kind');

export const isBox = propEq('box', 'kind');

export const isGlue = propEq('glue', 'kind');

export const isPositivePenalty = (node: Penalty) =>
	and(isPenalty(node), gte(prop('penalty', node), 0));

export const isNegativePenalty = (node: Penalty) =>
	and(isPenalty(node), lt(prop('penalty', node), 0));

export const isForcedBreak = (node: LineNode) =>
	and(isPenalty(node), propEq(-infinity, 'penalty')(node));
