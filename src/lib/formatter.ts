import { center, justify, left } from './formatters/index.js';
import type { Formatters, Hyphenator, Measurer } from './types.js';

/**
 * @param measureText A measurement function that returns the `width` and
 * `height` of `string`
 * @returns A object of formatter/alignment functions
 *
 */
export const formatter = (
	measureText: Measurer,
	spaceChar: string = '|',
	hyphenator?: Hyphenator
): Formatters => ({
	center: center(measureText, spaceChar, hyphenator),
	justify: justify(measureText, spaceChar, hyphenator),
	left: left(measureText, spaceChar, hyphenator)
});
