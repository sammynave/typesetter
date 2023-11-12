import { infinity } from '../constants.js';
import { glue, penalty } from '../line-nodes.js';
import { maybeHyphenate } from '../maybe-hyphenate.js';
import type { Hyphenator, JustifiedAppendOrBreakSettings, LineNode, Measurer } from '../types.js';

const SPACE = {
	shrink: 9,
	stretch: 6,
	width: 3
};

const FORCED_BREAK: ReadonlyArray<LineNode> = [glue(0, infinity, 0), penalty(0, -infinity, 1)];

const appendOrForceBreakJustify = ({
	nodes,
	spaceWidth,
	isLast,
	stretchRatio,
	shrinkRatio
}: JustifiedAppendOrBreakSettings): ReadonlyArray<LineNode> => {
	return isLast
		? nodes.concat(FORCED_BREAK)
		: nodes.concat([glue(spaceWidth, stretchRatio, shrinkRatio)]);
};

/**
 * @param hyphenator  A hyphenation engine with a `hyphenate` method that returns an array of syllables
 * @param measureText A measure function that returns `{ height, width }`
 * @returns           A a text justification function that takes a `string` and returns
 *                    an array of `LineNodes`
 */
export const justify = (measureText: Measurer, spaceChar: string, hyphenator?: Hyphenator) => {
	const spaceWidth = measureText(spaceChar);
	const hyphenWidth = measureText('-');

	return (text: string): ReadonlyArray<LineNode> => {
		const stretchRatio = (spaceWidth * SPACE.width) / SPACE.stretch;
		const shrinkRatio = (spaceWidth * SPACE.width) / SPACE.shrink;

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
			return appendOrForceBreakJustify({
				isLast: idx === words.length - 1,
				nodes: newNodes,
				shrinkRatio,
				spaceWidth,
				stretchRatio
			});
		};

		return text.split(/\s/).reduce(reducer, []);
	};
};
