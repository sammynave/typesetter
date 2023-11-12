<svelte:options namespace="svg" />

<script lang="ts">
	import type { Hyphenator, ValidAlignment } from '$lib/types.js';
	import { SvgTypeset } from '$lib/svg/svg-typeset.js';
	import { onMount } from 'svelte';

	export let height: number;
	export let width: number;
	export let padding: number;
	export let text: string;
	export let fontSize: number = 11;
	export let hyphenator: Hyphenator | undefined = undefined;

	const alignment: ValidAlignment = 'center';
	let textEl: SVGTextElement;
	let gEl: SVGGElement;

	const treeLines = [
		20, 30, 40, 70, 80, 50, 90, 120, 150, 80, 110, 140, 170, 200, 100, 130, 160, 190, 220, 240, 90,
		130, 170, 210, 240, 90
	];

	onMount(() => {
		SvgTypeset(
			text,
			textEl,
			gEl,
			alignment,
			treeLines,
			20000,
			alignment === 'center',
			'|',
			0,
			hyphenator
		);
	});
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 {width} {height}"
	{width}
	{height}
	xml:space="preserve"
	xmlns:xlink="http://www.w3.org/1999/xlink"
>
	<g bind:this={gEl} transform="translate({padding} {padding})">
		<text font-size={fontSize} bind:this={textEl} />
	</g>
</svg>
