/* tslint:disable:no-object-mutation no-expression-statement*/
import { inc, isNil } from 'ramda';
import type { LinkedListNode, ReducableLinkedList } from '../types.js';

const insertTail = (list: ReducableLinkedList, node: LinkedListNode, newNode: LinkedListNode) => {
	node.next = newNode;
	list.tail = newNode;

	return list;
};

const insertAfter = (list: ReducableLinkedList, node: LinkedListNode, newNode: LinkedListNode) => {
	node.next!.prev = newNode;
	node.next = newNode;

	return list;
};

const insertNodeAfter = (
	list: ReducableLinkedList,
	node: LinkedListNode,
	newNode: LinkedListNode
) => {
	newNode.prev = node;
	newNode.next = node.next;

	return isNil(node.next) ? insertTail(list, node, newNode) : insertAfter(list, node, newNode);
};

const insertIntoEmpty = (list: ReducableLinkedList, node: LinkedListNode): ReducableLinkedList => {
	list.head = node;
	list.tail = node;

	return list;
};

export const append = (list: ReducableLinkedList, node: LinkedListNode): ReducableLinkedList => {
	list.length = inc(list.length);

	return isNil(list.head) ? insertIntoEmpty(list, node) : insertNodeAfter(list, list.tail!, node);
};
