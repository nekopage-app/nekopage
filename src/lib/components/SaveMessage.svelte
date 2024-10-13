<script>
	import { fly } from 'svelte/transition';
	import { backIn, backOut } from 'svelte/easing';

	import { showSaveMessage } from '$lib/stores';

	showSaveMessage.subscribe(() => {
		setTimeout(() => {
			showSaveMessage.set(false);
		}, 1000);
	});
</script>

{#if $showSaveMessage}
	<div
		id="save-message"
		in:fly={{ y: 40, easing: backOut }}
		out:fly={{ y: 40, easing: backIn }}
		class="widget-inner !fixed bottom-8 left-1/2 -translate-x-1/2 z-30 w-36 !flex-row justify-center gap-2 text-xl"
	>
		<iconify-icon icon="ic:baseline-save" class="text-3xl"></iconify-icon>
		saved!
	</div>
{/if}
