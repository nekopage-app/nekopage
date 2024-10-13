<script lang="ts">
	import { fly } from 'svelte/transition';
	import { backIn, backOut } from 'svelte/easing';

    interface Props {
        show: boolean,
        onClickReset: () => void,
        onClickSave: () => void
    }

    let { show = $bindable(), onClickReset, onClickSave }: Props = $props();
</script>

{#if show}
	<div id="unsaved-message" in:fly={{ y: 40, easing: backOut }} out:fly={{ y: 40, easing: backIn }} class="widget-inner !fixed bottom-8 left-1/2 -translate-x-1/2 z-30 w-[30rem] !flex-row justify-between items-center gap-2">
		<span class="font-medium text-red">You have unsaved changes!</span>

		<div class="flex gap-6">
			<button onclick={() => { show = false; onClickReset() }}>
				reset
			</button>
			<button onclick={() => { show = false; onClickSave() }} class="button flex items-center gap-2">
				<iconify-icon icon="ic:baseline-save" class="text-xl"></iconify-icon>
				save
			</button>
		</div>
	</div>
{/if}