<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { fade, scale } from 'svelte/transition';
	import { circOut, sineIn } from 'svelte/easing';

	interface Props {
		children: Snippet;
		show: Writable<boolean>;
		id: string;
	}

	let { children, show, id }: Props = $props();
</script>

<div class="flex-container">
	<button
		id="blur-container"
		onclick={() => show.set(false)}
		in:fade
		out:fade
		class="flex-container backdrop-blur backdrop-brightness-75 cursor-auto !filter-none active:scale-100"
	></button>

	<div {id} class="widget z-20" in:scale={{ easing: circOut }} out:scale={{ easing: sineIn }}>
		<h1 class="!text-subtext">
			settings

			<button onclick={() => show.set(false)}>
				<iconify-icon icon="mingcute:close-fill"></iconify-icon>
				close
			</button>
		</h1>

		<div class="widget-inner !shadow-2xl w-[60rem] h-[40rem] !grid grid-cols-4 !p-0">
			{@render children()}
		</div>
	</div>
</div>
