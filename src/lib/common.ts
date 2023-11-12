import { addIndex, reduce, reduceWhile } from 'ramda';

export const indexedReduceWhile = addIndex(reduceWhile);

export const indexedReduce = addIndex(reduce);
