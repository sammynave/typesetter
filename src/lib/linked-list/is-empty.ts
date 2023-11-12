import type { ReducableLinkedList } from '../types.js';
export const isEmpty = (list: ReducableLinkedList): boolean => {
	return list.length === 0;
};
