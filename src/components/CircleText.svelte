<svelte:options namespace="svg" />

<script lang="ts">
	import { Y_EM } from '$lib/svg/writer.js';
	import { SvgTypesetter } from '$lib/svg/svg-typesetter.js';
	import { onMount } from 'svelte';
	import type { ValidAlignment } from '$lib/types.js';

	export let height: number;
	export let width: number;
	export let padding: number;
	export let text: string;
	export let fontSize: number = 16;

	const lineHeightInPx = fontSize * Y_EM;

	function getCircleLines({ diameter }: { diameter: number }) {
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
		SvgTypesetter({
			text,
			targetNode: textEl,
			parentNode: gEl,
			alignment,
			lineLengths: getCircleLines({ diameter: width })
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
	<g bind:this={gEl} transform="translate({0} {padding})">
		<text font-size={fontSize} bind:this={textEl} />
	</g>
</svg>
