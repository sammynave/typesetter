import { center, justify, left } from './formatters/index.js';
import type { Formatters, Measurer } from './types.js';

/**
 * @param measureText A measurement function that returns the `width` and
 * `height` of `string`
 * @returns A object of formatter/alignment functions
 *
 */
export const formatter = (
	measureText: Measurer,
	spaceChar: string = '|',
	withHyphenation: boolean = false
): Promise<Formatters> => {
	return withHyphenation
		? (() => {
				// throw Error('hyphenation not yet enabled');

				const imports = Promise.all([import('hyphenation.en-us'), import('hypher')]);

				return imports.then(([{ default: english }, { default: Hypher }]) => {
					const hyphenator = new Hypher(english);

					return Promise.resolve({
						center: center(measureText, spaceChar, hyphenator),
						justify: justify(measureText, spaceChar, hyphenator),
						left: left(measureText, spaceChar, hyphenator)
					});
				});
		  })()
		: (() => {
				return Promise.resolve({
					center: center(measureText, spaceChar),
					justify: justify(measureText, spaceChar),
					left: left(measureText, spaceChar)
				});
		  })();
};
