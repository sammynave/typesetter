import { describe, expect, it } from 'vitest';
import { formatter } from './formatter.js';
import {
	// expectedCenter,
	expectedCenterNoHyph,
	// expectedJustify,
	expectedJustifyNoHyph,
	// expectedLeft,
	expectedLeftNoHyph
} from './test-helpers/expected/formatter/index.js';
import { text } from './test-helpers/test-text.js';

// FIXME: re-enable when hyphenation is working.
// possibly force hyphenation lib to be passed in
// test('formatter - center', async (t: any) => {
//   const m = (x: string) => x.length * 10;
//   const { center } = await formatter(m, '|', true);
//   const result = center(text);
//   t.deepEqual(result, expectedCenter);
// });
//
// test('formatter - justify', async (t: any) => {
//   const m = (x: string) => x.length * 10;
//   const { justify } = await formatter(m, '|', true);
//   const result = justify(text);
//   t.deepEqual(result, expectedJustify);
// });
//
// test('formatter - left', async (t: any) => {
//   const m = (x: string) => x.length * 10;
//   const { left } = await formatter(m, '|', true);
//   const result = left(text);
//   t.deepEqual(result, expectedLeft);
// });
describe('formatter', () => {
	it('formatter - center no hyphenation', async () => {
		const m = (x: string) => x.length * 10;
		const { center } = await formatter(m, '|', false);
		const result = center(text);
		expect(result).toStrictEqual(expectedCenterNoHyph);
	});

	it('formatter - justify no hyphenation', async () => {
		const m = (x: string) => x.length * 10;
		const { justify } = await formatter(m, '|', false);
		const result = justify(text);
		expect(result).toStrictEqual(expectedJustifyNoHyph);
	});

	it('formatter - left no hyphenation', async () => {
		const m = (x: string) => x.length * 10;
		const { left } = await formatter(m, '|', false);
		const result = left(text);
		expect(result).toStrictEqual(expectedLeftNoHyph);
	});
});
