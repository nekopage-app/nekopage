<script lang="ts">
	import { fade } from "svelte/transition";

	let { loading }: { loading: boolean } = $props();
</script>

{#if loading}
	<div
        in:fade out:fade
		class="absolute top-0 left-0 flex justify-center items-center w-full h-full z-10 rounded-md backdrop-blur text-6xl"
	>
		<iconify-icon icon="line-md:loading-loop"></iconify-icon>
	</div>
{/if}