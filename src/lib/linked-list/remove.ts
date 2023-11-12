/* tslint:disable:no-object-mutation readonly-keyword no-expression-statement */
import { dec, isNil } from 'ramda';
import type { LinkedListNode, ReducableLinkedList } from '../types.js';

const removeHead = ({ list, node }: { list: ReducableLinkedList; node: LinkedListNode }) => {
	list.head = node.next;
	return { list, node };
};

const removeTail = ({ list, node }: { list: ReducableLinkedList; node: LinkedListNode }) => {
	list.tail = node.prev;
	return { list, node };
};

const removeNodeAfter = ({ list, node }: { list: ReducableLinkedList; node: LinkedListNode }) => {
	node.prev!.next = node.next;
	return { list, node };
};

const removeNodeBefore = ({ list, node }: { list: ReducableLinkedList; node: LinkedListNode }) => {
	node.next!.prev = node.prev;
	return { list, node };
};

export const remove = (list: ReducableLinkedList, node: LinkedListNode): ReducableLinkedList => {
	const { list: list1, node: node1 } = isNil(node.prev)
		? removeHead({ list, node })
		: removeNodeAfter({ list, node });

	const { list: list2 } = isNil(node1.next)
		? removeTail({ list: list1, node: node1 })
		: removeNodeBefore({ list: list1, node: node1 });

	list2.length = dec(list2.length);

	return list2;
};
