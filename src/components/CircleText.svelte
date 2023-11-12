<svelte:options namespace="svg" />

<script lang="ts">
	import { Y_EM } from '$lib/svg/writer.js';
	import { SvgTypeset } from '$lib/svg/svg-typeset.js';
	import { onMount } from 'svelte';
	import type { ValidAlignment } from '$lib/types.js';

	export let height: number;
	export let width: number;
	export let padding: number;
	export let text: string;
	export let fontSize: number = 16;

	const lineHeightInPx = fontSize * Y_EM;

	function getCircleLines({ diameter }) {
		let r = [];
		const radius = diameter / 2;
		for (let j = 0; j < diameter; j += lineHeightInPx) {
			r.push(Math.round(Math.sqrt((radius - j / 2) * (8 * j))));
		}
		return r.filter((x) => x > 0);
	}

	let textEl: SVGTextElement;
	let gEl: SVGGElement;
	let alignment: ValidAlignment = 'center';

	onMount(() => {
		SvgTypeset(
			text,
			textEl,
			gEl,
			alignment,
			getCircleLines({ diameter: width }),
			20,
			alignment === 'center',
			'|'
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
	<g bind:this={gEl} transform="translate({0} {padding})">
		<text font-size={fontSize} bind:this={textEl} />
	</g>
</svg>
