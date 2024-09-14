<script lang="ts">
	import { page } from '$app/stores';
	import { fade, fly } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';

	let show = $state(false);

	$effect(() => {
		show = true;
		return;
	});
</script>

<div class="flex-container">
	{#if show}
		<div
			class="widget-inner w-[28rem] !p-8 items-center"
			in:fly={{ duration: 1000, y: 100, easing: quintOut }}
		>
			<div id="title" class="flex justify-between items-center text-[2rem] w-full">
				<h1 class="text-[2.5rem] font-black">Error</h1>
				<iconify-icon icon="mdi:cat"></iconify-icon>
			</div>

			<span class="text-5xl font-semibold">{$page.status}</span>
			<span>{$page.error?.message}</span>
		</div>

        <footer in:fade out:fade class="absolute bottom-8">
			<a href="https://github.com/axolotlmaid/nekopage" class="text-overlay">nekopage</a>
		</footer>
	{/if}
</div>
