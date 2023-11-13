<svelte:options namespace="svg" />

<script lang="ts">
	import type { Hyphenator, ValidAlignment } from '$lib/types.js';
	import { SvgTypesetter } from '$lib/svg/svg-typesetter.js';
	import { onMount } from 'svelte';

	export let height: number;
	export let width: number;
	export let padding: number;
	export let text: string;
	export let alignment: ValidAlignment;
	export let fontSize: number = 16;
	export let hyphenator: Hyphenator | undefined = undefined;
	export let tolerance: number = 2;

	let textEl: SVGTextElement;
	let gEl: SVGGElement;

	onMount(() => {
		SvgTypesetter({
			text,
			targetNode: textEl,
			parentNode: gEl,
			alignment,
			lineLengths: [width - padding * 2],
			tolerance,
			hyphenator
		});
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
