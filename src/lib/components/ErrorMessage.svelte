<script>
	import { fly } from 'svelte/transition';
	import { backIn, backOut } from 'svelte/easing';

	import { errorMessage, showErrorMessage } from '$lib/stores';

	showErrorMessage.subscribe(() => {
		setTimeout(() => {
			showErrorMessage.set(false);
		}, 3000);
	});
</script>

{#if $showErrorMessage}
	<button
		id="error-message"
		in:fly={{ y: 40, easing: backOut }}
		out:fly={{ y: 40, easing: backIn }}
        onclick={() => navigator.clipboard.writeText($errorMessage)}
		class="widget-inner !bg-red !fixed bottom-8 left-1/2 -translate-x-1/2 z-30 !flex-row justify-center items-center gap-2 text-lg text-crust !outline-none"
	>
		<iconify-icon icon="material-symbols:error" class="text-2xl"></iconify-icon>
		<span class="font-normal"><b>error:</b> {$errorMessage}</span>
    </button>
{/if}
