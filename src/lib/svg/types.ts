import type { Break, LineNode } from '$lib/types.js';

export interface WriteLineNodeAccumulator {
	readonly line: Line;
	readonly svgElement: SVGTextElement;
	readonly x: number;
	readonly y: number;
}

export interface WriteLineAccumulator {
	readonly center: boolean;
	readonly lineLengths: ReadonlyArray<number>;
	readonly maxLength: number;
	readonly svgElement: SVGTextElement;
	readonly x: number;
	readonly y: number;
}

export interface Line extends Break {
	readonly nodes: ReadonlyArray<LineNode>;
}
