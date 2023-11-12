import { infinity } from '../constants.js';
import { glue, penalty } from '../line-nodes.js';
import { maybeHyphenate } from '../maybe-hyphenate.js';
import type { AppendOrBreakSettings, Hyphenator, LineNode, Measurer } from '../types.js';

const FORCED_BREAK: ReadonlyArray<LineNode> = [glue(0, infinity, 0), penalty(0, -infinity, 1)];

const WORD = (spaceWidth: number): ReadonlyArray<LineNode> => [
	glue(0, 12, 0),
	penalty(0, 0, 0),
	glue(spaceWidth, -12, 0)
];

const appendOrForceBreakLeft = ({
	nodes,
	spaceWidth,
	isLast
}: AppendOrBreakSettings): ReadonlyArray<LineNode> => {
	return isLast ? nodes.concat(FORCED_BREAK) : nodes.concat(WORD(spaceWidth));
};

/**
 * @param hyphenator  A hyphenation engine with a `hyphenate` method that returns an array of syllables
 * @param measureText A measure function that returns `{ height, width }`
 * @returns           A a text left alignment function that takes a `string` and returns
 *                    an array of `LineNodes`
 */
export const left = (measureText: Measurer, spaceChar: string, hyphenator?: Hyphenator) => {
	const spaceWidth = measureText(spaceChar);
	const hyphenWidth = measureText('-');

	return (text: string): ReadonlyArray<LineNode> => {
		const reducer = (
			nodes: ReadonlyArray<LineNode>,
			word: string,
			idx: number,
			words: ReadonlyArray<string>
		): ReadonlyArray<LineNode> => {
			const newNodes = maybeHyphenate({
				hyphenWidth,
				hyphenator,
				measureText,
				nodes,
				word
			});

			return appendOrForceBreakLeft({
				isLast: idx === words.length - 1,
				nodes: newNodes,
				spaceWidth
			});
		};

		return text.split(/\s/).reduce(reducer, []);
	};
};
