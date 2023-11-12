import { infinity } from '../constants.js';
import { box, glue, penalty } from '../line-nodes.js';
import { maybeHyphenate } from '../maybe-hyphenate.js';
import type { AppendOrBreakSettings, Hyphenator, LineNode, Measurer } from '../types.js';

const FORCED_BREAK: ReadonlyArray<LineNode> = [glue(0, 12, 0), penalty(0, -infinity, 0)];

const WORD = (spaceWidth: number): ReadonlyArray<LineNode> => [
	glue(0, 12, 0),
	penalty(0, 0, 0),
	glue(spaceWidth, -24, 0),
	box(0, ''),
	penalty(0, infinity, 0),
	glue(0, 12, 0)
];

const appendOrForceBreakCenter = ({
	nodes,
	spaceWidth,
	isLast
}: AppendOrBreakSettings): ReadonlyArray<LineNode> => {
	return isLast ? nodes.concat(FORCED_BREAK) : nodes.concat(WORD(spaceWidth));
};

/**
 * @param hyphenator  A hyphenation engine with a `hyphenate` method that returns an array of syllables
 * @param measureText A measure function that returns `{ height, width }`
 * @returns           A a text centering function that takes a `string` and returns
 *                    an array of `LineNodes`
 */
export const center = (measureText: Measurer, spaceChar: string, hyphenator?: Hyphenator) => {
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
			return appendOrForceBreakCenter({
				isLast: idx === words.length - 1,
				nodes: newNodes,
				spaceWidth
			});
		};
		const startingNodes: ReadonlyArray<LineNode> = [box(0, ''), glue(0, 12, 0)];
		return text.split(/\s/).reduce(reducer, startingNodes);
	};
};
