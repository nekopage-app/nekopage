<script lang="ts">
	import { onMount, type Component } from 'svelte';
	import { fly } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';
	
	import type { PageData } from './$types';
	import { layout, showSettingsButton, showSettings, inLayoutEditor } from '$lib/stores';

	import default_widget_settings_json from '$lib/data/default_widget_settings.json';
	const default_widget_settings: { [key: string]: WidgetSettings } = default_widget_settings_json;

	import Settings from '$lib/widgets/settings/Settings.svelte';

	// Widgets and layouts
	import Calendar from '$lib/widgets/Calendar.svelte';
	import Weather from '$lib/widgets/Weather.svelte';
	import Search from '$lib/widgets/Search.svelte';
	import Text from '$lib/widgets/Text.svelte';
	import RSS from '$lib/widgets/RSS.svelte';

	let { data }: { data: PageData } = $props();
	layout.set(data.layout!);

	const widgets: { [key: string]: Component<{ data: WidgetData }> } = {
		Calendar,
		Search,
		Text,
		Weather,
		RSS
	};

	// Animation on page load
	let show = $state(false);

	onMount(() => {
		show = true;
		showSettingsButton.set(true);
		return;
	});

	// Layout editor
	let showAddMenu = $state(false);

	function exitLayoutEditor() {
		showSettings.set(true);
		showSettingsButton.set(true);
		inLayoutEditor.set(false);
		showAddMenu = false;
	}

	async function addWidget(widgetName: string) {
		const request = await fetch(`/api/add-widget?name=${widgetName}`, {
			method: "POST",
		});
		const response = await request.json();
		
		if (response.id) {
			const settings = default_widget_settings[widgetName];

			layout.update(currentLayout => {
				return {
					...currentLayout,
					left: [
						...currentLayout.left,
						{
							id: response.id,
							name: widgetName,
							settings
						}
					]
				};
			});
		} else {
			// todo: show error on client
		}
	}

	function onDragOver(event: DragEvent) {
		event.preventDefault();
	}

	async function onDrop(event: DragEvent, targetColumn: string) {
		event.preventDefault();
		const id = Number(event.dataTransfer?.getData("text/plain"));

		console.log(targetColumn);

		if (id) {
			const body = new FormData();
			body.append("id", id.toString());
			body.append("column", targetColumn);
			body.append("index", "0");

			console.log(body);
			// await fetch("?/moveWidget", {
			// 	method: "POST",
			// 	body
			// });
		}
	}
</script>

<svelte:head>
	<title>nekopage</title>
</svelte:head>

<Settings />

{#each ['left', 'middle', 'right'] as column}
	{#if show}
		<div id={column} role="presentation" ondragover={onDragOver} ondrop={(event) => onDrop(event, column)} in:fly={{ y: 100 }} class="flex flex-col gap-2">
			{#each $layout[column] as widget}
				{@const Component = widgets[widget.name]}
				<Component data={widget} />
			{/each}
		</div>
	{/if}
{/each}

{#if $inLayoutEditor}
	<div
		id="layout-editor"
		in:fly={{ y: 10 }}
		out:fly={{ y: 10 }}
		class="widget-inner !fixed bottom-8 left-8 w-96 h-[3.25rem] z-20 !flex-row justify-between items-center !shadow-xl"
	>
		<h1 class="text-xl">Layout Editor</h1>

		<div id="buttons">
			<button class="button" onclick={() => (showAddMenu = !showAddMenu)}> add </button>
			<button class="button" onclick={exitLayoutEditor}> exit </button>
		</div>
	</div>
{/if}

{#if showAddMenu}
	<div
		id="add-menu-layout-editor"
		in:fly={{ x: -10, easing: quadOut }}
		out:fly={{ x: -10, easing: quadOut }}
		class="widget-inner !fixed bottom-24 left-8 w-96 h-96 z-20 !shadow-xl !grid grid-cols-2 grid-rows-9 gap-1.5"
	>
		{#each Object.keys(widgets) as widget}
			<button class="button !bg-base !text-text hover:brightness-95 shadow-sm" onclick={() => addWidget(widget)}>{widget}</button>
		{/each}
	</div>
{/if}

<style lang="postcss">
	#middle {
		@apply max-xl:row-start-1 max-xl:col-span-full;
	}
</style>
