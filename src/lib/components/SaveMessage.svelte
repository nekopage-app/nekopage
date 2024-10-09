<script>
	import { fly } from "svelte/transition";
	import { backIn, backOut } from "svelte/easing";

    let { saved = false } = $props();
</script>

{#if saved}
	<div
		id="save-message"
		in:fly={{ y: 20, easing: backOut }}
		out:fly={{ y: 20, easing: backIn }}
		class="widget-inner !fixed bottom-8 z-10 w-36 !flex-row justify-center gap-2 text-xl shadow-xl"
	>
		<iconify-icon icon="ic:baseline-save" class="text-3xl"></iconify-icon>
		saved!
	</div>
{/if}