import { until } from 'ramda';
import { append } from './append.js';
export { isEmpty } from './is-empty.js';
export { remove } from './remove.js';
import type {
	LinkedList,
	LinkedListNode,
	LinkedListReducer,
	ReducableLinkedList
} from '../types.js';
export { append };

export const linkedListNodeFrom = (data: any): LinkedListNode => {
	return {
		data,
		next: null,
		prev: null
	};
};

export const foldable = (list: LinkedList): ReducableLinkedList => {
	const reduce = (fn: LinkedListReducer, initial: LinkedListNode): LinkedListNode => {
		const { acc: result } = until(
			({ node }) => node === null,
			({ acc, node }: any) => {
				return {
					acc: fn(acc, node),
					node: node.next
				};
			}
		)({ acc: initial, node: list.head });

		return result;
	};

	list.reduce = reduce;
	return list as ReducableLinkedList;
};

export const linkedListFrom = (arr: ReadonlyArray<any>): ReducableLinkedList => {
	const list = foldable({
		head: null,
		length: 0,
		tail: null
	});

	return arr.reduce((acc, x: any) => {
		return append(acc, linkedListNodeFrom(x));
	}, list);
};
