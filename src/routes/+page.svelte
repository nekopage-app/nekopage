<script lang="ts">
	import { fly } from "svelte/transition";

	import { layout } from "$lib/stores/Layout";
	import type { PageData } from "./$types";

	import Calendar from "$lib/widgets/Calendar.svelte";
	import Weather from "$lib/widgets/Weather.svelte";
	import Search from "$lib/widgets/Search.svelte";
	import Text from "$lib/widgets/Text.svelte";

	let { data }: { data: PageData } = $props();
	layout.set(data.layout);

	const widgetComponents: { [key: string]: any } = {
		Calendar,
		Search,
		Text,
		Weather
	}

    let show = $state(false);

    $effect(() => {
		show = true
        return;
    });
</script>

{#each ['left', 'middle', 'right'] as column}
	{#if show}
		<div class="column" id={column} in:fly={{y: 100}}>
			{#each $layout[column] as widget}
				{@const Component = widgetComponents[widget.name]}
				<Component settings={widget.settings} />
			{/each}
		</div>
	{/if}
{/each}

<style lang="postcss">
	.column {
		@apply flex flex-col gap-2;
	}

	#middle {
		@apply max-xl:row-start-1 max-xl:col-span-full;
	}
</style>