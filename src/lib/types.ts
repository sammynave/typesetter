export type Align = (x: string) => ReadonlyArray<LineNode>;
export interface Formatters {
  readonly center: Align;
  readonly justify: Align;
  readonly left: Align;
}

export type Measurer = (x: string) => number;
export type LineNode = Box | Glue | Penalty;
export interface Break {
  readonly position: number;
  readonly ratio: number;
}

export interface Box {
  readonly kind: 'box';
  readonly width: number;
  readonly value: string;
}

export interface Glue {
  readonly kind: 'glue';
  readonly width: number;
  readonly stretch: number;
  readonly shrink: number;
}

export interface Penalty {
  readonly kind: 'penalty';
  readonly width: number;
  readonly penalty: number;
  readonly flagged: number;
}

export interface AppendOrBreakSettings {
  readonly nodes: ReadonlyArray<LineNode>;
  readonly spaceWidth: number;
  readonly isLast: boolean;
}

export interface JustifiedAppendOrBreakSettings extends AppendOrBreakSettings {
  readonly stretchRatio: number;
  readonly shrinkRatio: number;
}

export interface MaybeHyphenateSettings {
  readonly word: string;
  readonly nodes: ReadonlyArray<LineNode>;
  readonly measureText: Measurer;
  readonly hyphenator?: Hyphenator;
  readonly hyphenWidth: number;
}

export interface Dimensions {
  readonly width: number;
  readonly height: number;
}

export type Hyphenator = any;

export interface Demerit {
  readonly fitness: number;
  readonly flagged: number;
  readonly line: number;
}

export interface SeedOptions {
  readonly demerits: Demerit;
  readonly tolerance: number;
}

export interface ActiveNode {
  readonly data: ActiveNodeValue;
}

// FIXME: make linked-list and node immutable
// tslint:disable:readonly-keyword
export interface LinkedListNode {
  data: any;
  next: LinkedListNode | null;
  prev: LinkedListNode | null;
}

export interface LinkedList {
  head: LinkedListNode | null;
  tail: LinkedListNode | null;
  length: number;
}
// tslint:enable:readonly-keyword

export interface ReducableLinkedList extends LinkedList {
  readonly reduce: (
    fn: LinkedListReducer,
    initial: LinkedListNode
  ) => LinkedListNode;
}

/**
 * An ‘active node’ in this description refers to a record that includes information about a breakpoint together with its fitness classification and the line number on which it end
 */
export interface ActiveNodeValue {
  readonly demerits: number;
  readonly fitnessClass: 0 | 1 | 2 | 3;
  readonly line: number;
  readonly position: number;
  readonly previous: ActiveNode;
  readonly ratio: number;
  readonly totalShrink: number;
  readonly totalStretch: number;
  readonly totalWidth: number;
}

// TODO: need a better name
export interface Seed {
  readonly activeNodes: ReducableLinkedList;
  readonly lineLengths: ReadonlyArray<number>;
  readonly options: SeedOptions;
  readonly totalShrink: number;
  readonly totalStretch: number;
  readonly totalWidth: number;
}

export interface BestBreakSettings {
  readonly tmp: LinkedListNode;
  readonly breaks: ReadonlyArray<Break>;
}

export type LinkedListReducer = (
  acc: LinkedListNode,
  x: LinkedListNode
) => LinkedListNode;

export type ValidAlignment = 'center' | 'justify' | 'left';
