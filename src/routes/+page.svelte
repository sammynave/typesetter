<script lang="ts">
	import CircleText from './../components/CircleText.svelte';
	import { text } from '../test-helpers/test-text.js';
	import TypesetText from './../components/TypesetText.svelte';
	import PineTree from './../components/PineTree.svelte';

	const width = 300;
	const height = 300;
	const padding = 20;
</script>

<TypesetText alignment="left" {text} {padding} {width} {height} />
<TypesetText alignment="justify" {text} {padding} {width} {height} />
<TypesetText alignment="center" {text} {padding} {width} {height} />
<CircleText fontSize={16} {text} {padding} {width} {height} />

<!-- hyphenation example -->
<TypesetText alignment="justify" fontSize={15} {text} {padding} {width} {height} />
<PineTree {text} {padding} {width} {height} />
