import { describe, expect, it } from 'vitest';
import { append } from '$lib/linked-list/append.js';
import { linkedListFrom, linkedListNodeFrom } from '$lib/linked-list/index.js';

describe('append', () => {
	it('append - empty list', () => {
		const node = linkedListNodeFrom('hi');
		const list = linkedListFrom([]);
		const result = append(list, node);

		expect(result.head).toStrictEqual(node);
		expect(result.length).toStrictEqual(1);
		expect(result.tail).toStrictEqual(node);
	});

	it('append - list with items', () => {
		const node = linkedListNodeFrom('hello');
		const A = 'hi';
		const B = 'bye';

		const list = linkedListFrom([A, B]);
		const result = append(list, node);

		expect(result.head!.data).toStrictEqual('hi');
		expect(result.length).toStrictEqual(3);
		expect(result.tail!.data).toStrictEqual('hello');
	});
});
