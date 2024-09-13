<script lang="ts">
	import Calendar from "$lib/widgets/Calendar.svelte";
import { fly } from "svelte/transition";

    let show = $state(false);

    $effect(() => {
        show = true;
    });
</script>

{#each ['left', 'middle', 'right'] as column}
	{#if show}
		<div class="column" id={column} in:fly={{y: 100}}>
			<Calendar />
		</div>
	{/if}
{/each}