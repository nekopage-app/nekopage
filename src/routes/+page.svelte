<script lang="ts">
	import { onMount, type Component } from "svelte";
	import { fly } from "svelte/transition";

	import {  layout, showSettingsButton, showSettings, inLayoutEditor } from '$lib/stores';
	import type { PageData } from "./$types";

	import Settings from "$lib/widgets/settings/Settings.svelte";

	import Calendar from "$lib/widgets/Calendar.svelte";
	import Weather from "$lib/widgets/Weather.svelte";
	import Search from "$lib/widgets/Search.svelte";
	import Text from "$lib/widgets/Text.svelte";

	let { data }: { data: PageData } = $props();
	layout.set(data.layout);

	const widgetComponents: { [key: string]: Component<{ settings: WidgetSettings }> } = {
		Calendar,
		Search,
		Text,
		Weather
	}

	function exitLayoutEditor() {
		showSettings.set(true);
        showSettingsButton.set(true);
        inLayoutEditor.set(false);
	}

	// For the transition on page load
    let show = $state(false);

    onMount(() => {
		show = true;
		showSettingsButton.set(true);
        return;
    });
</script>

<Settings />

{#each ['left', 'middle', 'right'] as column}
	{#if show}
		<div id={column} in:fly={{y: 100}} class="flex flex-col gap-2">
			{#each $layout[column] as widget}
				{@const Component = widgetComponents[widget.name]}
				<Component settings={widget.settings} />
			{/each}
		</div>
	{/if}
{/each}

{#if $inLayoutEditor}
	<div id="layout-editor" in:fly={{ y: 10 }} out:fly={{ y: 10 }} class="widget-inner !fixed bottom-8 left-8 w-96 h-[3.25rem] !flex-row justify-between items-center !shadow-xl">
		<h1 class="text-xl">Layout Editor</h1>

		<div id="buttons">
			<button class="button">
				add
			</button>
			<button class="button" onclick={exitLayoutEditor}>
				exit
			</button>
		</div>
	</div>
{/if}

<style lang="postcss">
	#middle {
		@apply max-xl:row-start-1 max-xl:col-span-full;
	}
</style>