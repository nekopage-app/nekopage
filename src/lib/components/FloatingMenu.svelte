<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { fade, scale } from 'svelte/transition';
	import { circOut, sineIn } from 'svelte/easing';

	interface Props {
		children: Snippet;
		show: Writable<boolean>;
		id: string;
		class?: string;
		title: string;
	}

	let { children, show, id, class: clazz, title }: Props = $props();
</script>

{#if $show}
	<div class="flex-container">
		<button
			id="blur-container"
			aria-labelledby="close-settings"
			onclick={() => show.set(false)}
			in:fade
			out:fade
			class="fixed w-full h-full top-0 left-0 backdrop-blur backdrop-brightness-75 cursor-auto !filter-none active:scale-100"
		></button>

		<div {id} class="widget z-30" in:scale={{ easing: circOut }} out:scale={{ easing: sineIn }}>
			<h1 class="!text-subtext">
				{title}

				<button id="close-settings" aria-label="Close Settings" onclick={() => show.set(false)}>
					<iconify-icon icon="mingcute:close-fill"></iconify-icon>
					close
				</button>
			</h1>

			<div class="widget-inner !shadow-2xl w-[60rem] h-[40rem] overflow-auto {clazz}">
				{@render children()}
			</div>
		</div>
	</div>
{/if}