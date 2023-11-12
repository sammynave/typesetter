<svelte:options namespace="svg" />

<script lang="ts">
	import { SvgTypeset, type ValidAlignment } from '@safs.io/typesetter';
	import { onMount } from 'svelte';

	let height = 600;
	let width = 300;
	let padding = 20;
	let text =
		"In olden times when wishing still helped one, there lived a king whose daughters were all beautiful; and the youngest was so beautiful that the sun itself, which has seen so much, was astonished whenever it shone in her face. Close by the king's castle lay a great dark forest, and under an old lime-tree in the forest was a well, and when the day was very warm, the king's child went out to the forest and sat down by the fountain; and when she was bored she took a golden ball, and threw it up on high and caught it; and this ball was her favorite plaything.";
	let alignment: ValidAlignment = 'center';
	let fontSize: number = 16;

	let textEl: SVGTextElement;
	let gEl: SVGGElement;

	onMount(async () => {
		await SvgTypeset(
			text,
			textEl,
			gEl,
			alignment,
			[width - padding * 2],
			20,
			alignment === 'center',
			'|',
			0,
			true
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
