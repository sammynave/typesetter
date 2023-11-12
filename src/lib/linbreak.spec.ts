// tslint:disable:no-expression-statement
import { describe, expect, it } from 'vitest';
import { testNodes } from './test-helpers/fixtures/linebreak-test-nodes.js';
import { linebreak } from './linebreak.js';

describe('linebreak', () => {
	it('returns the correct break points', () => {
		const expected: ReadonlyArray<any> = [
			{ position: 0, ratio: 0 },
			{ position: 55, ratio: 0.4583333333333333 },
			{ position: 113, ratio: 0.626953125 },
			{ position: 170, ratio: 0.564453125 },
			{ position: 242, ratio: 0.2884114583333333 },
			{ position: 304, ratio: 0.28515625 },
			{ position: 376, ratio: 0.4088541666666667 },
			{ position: 450, ratio: 0.3880208333333333 },
			{ position: 513, ratio: 0.564453125 },
			{ position: 592, ratio: 0.31640625 },
			{ position: 657, ratio: 0.515625 },
			{ position: 727, ratio: 0.3294270833333333 },
			{ position: 787, ratio: 0.7135416666666666 }
		];

		expect(linebreak(testNodes, [100], 3)).toStrictEqual(expected);
	});
});
