import { describe, expect, it } from 'vitest';
import { linkedListFrom } from '$lib/linked-list/index.js';
import { remove } from '$lib/linked-list/remove.js';

describe('linkedListFrom', () => {
	it('remove an item at beginning', () => {
		const A = 'hi';
		const B = 'bye';
		const list = linkedListFrom([A, B]);
		const head = list.head!;
		const result = remove(list, head);

		expect(result.head!.data).toStrictEqual(B);
		expect(result.length).toStrictEqual(1);
		expect(result.tail!.data).toStrictEqual(B);
	});

	it('remove item from end of list', () => {
		const A = 'hi';
		const B = 'B';

		const list = linkedListFrom([A, B]);
		const head = list.head!;
		const tail = list.tail!;

		const result = remove(list, tail);
		expect(result.head).toStrictEqual(head);
		expect(result.length).toStrictEqual(1);
		expect(result.tail).toStrictEqual(head);
	});
});
