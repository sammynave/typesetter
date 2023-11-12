import { always, cond, gt, inc, lt, path, T } from 'ramda';
import { infinity } from '../constants.js';
import { isPenalty } from '../line-nodes.js';

export const computeRatio = ({
	last,
	active,
	totalShrink,
	totalStretch,
	totalWidth,
	lineLengths
}: any) => {
	const currentLine = path(['data', 'line'], active) as number;
	const nextLine = inc(currentLine);

	const lineLength =
		nextLine < lineLengths.length ? lineLengths[currentLine] : lineLengths[lineLengths.length - 1];

	const width = isPenalty(last)
		? totalWidth - active.data.totalWidth + last.width
		: totalWidth - active.data.totalWidth;

	const calcStretch = () => {
		const stretch = totalStretch - active.data.totalStretch;
		return stretch > 0 ? (lineLength - width) / stretch : infinity;
	};

	const calcShrink = () => {
		const shrink = totalShrink - active.data.totalShrink;
		return shrink > 0 ? (lineLength - width) / shrink : infinity;
	};

	return cond([
		[lt(width), calcStretch],
		[gt(width), calcShrink],
		[T, always(0)]
	])(lineLength);
};
