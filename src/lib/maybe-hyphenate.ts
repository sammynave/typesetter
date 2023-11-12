import { box, penalty } from './line-nodes.js';
import type { LineNode, MaybeHyphenateSettings } from './types.js';

const HYPHEN_PENALTY = 100;
const shouldHyphenate = (hLength: number, wLength: number): boolean => hLength > 1 && wLength > 4;

export const maybeHyphenate = ({
	word,
	nodes,
	measureText,
	hyphenator,
	hyphenWidth
}: MaybeHyphenateSettings): ReadonlyArray<LineNode> => {
	const syllables = hyphenator ? hyphenator.hyphenate(word) : [word];
	const reducer = (
		acc: ReadonlyArray<LineNode>,
		part: string,
		idx: number,
		src: ReadonlyArray<string>
	) => {
		const acc1 = acc.concat([box(measureText(part), part)]);
		return idx !== src.length - 1 ? acc1.concat([penalty(hyphenWidth, HYPHEN_PENALTY, 1)]) : acc1;
	};

	return shouldHyphenate(syllables.length, word.length)
		? syllables.reduce(reducer, nodes)
		: nodes.concat([box(measureText(word), word)]);
};
