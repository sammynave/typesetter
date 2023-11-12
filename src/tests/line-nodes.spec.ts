import { describe, expect, it } from 'vitest';
import { box } from '$lib/line-nodes.js';

describe('Box', () => {
	it('passes', () => {
		const expected = {
			kind: 'box',
			value: 'hi',
			width: 1
		};
		expect(box(1, 'hi')).toStrictEqual(expected);
	});
});
