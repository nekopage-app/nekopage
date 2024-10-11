<script lang="ts">
	import { onMount, type Component } from 'svelte';
	import { fly } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';
	import { flip } from 'svelte/animate';

	import { dndzone } from 'svelte-dnd-action';

	import type { PageData } from './$types';
	import { layout, showSettingsButton, showSettings, inLayoutEditor } from '$lib/stores';
	import { Column } from '$lib/enums';

	import default_widget_settings_json from '$lib/data/default_widget_settings.json';
	const default_widget_settings: { [key: string]: WidgetSettings } = default_widget_settings_json;

	import Settings from '$lib/widgets/settings/Settings.svelte';

	// Widgets and layouts
	import Astronomy from '$lib/widgets/Astronomy.svelte';
	import Bookmarks from '$lib/widgets/Bookmarks.svelte';
	import Calendar from '$lib/widgets/Calendar.svelte';
	import Picture from '$lib/widgets/Picture.svelte';
	import RSS from '$lib/widgets/RSS.svelte';
	import Search from '$lib/widgets/Search.svelte';
	import Text from '$lib/widgets/Text.svelte';
	import Weather from '$lib/widgets/Weather.svelte';

	let { data }: { data: PageData } = $props();
	layout.set(data.layout!);

	const widgets: { [key: string]: Component<{ data: WidgetData | any }> } = {
		Astronomy,
		Bookmarks,
		Calendar,
		Picture,
		RSS,
		Search,
		Text,
		Weather
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
		const request = await fetch(`/api/widget/add?name=${widgetName}`, {
			method: 'POST'
		});
		const response = await request.json();

		if (response.id) {
			const settings = default_widget_settings[widgetName];

			layout.update((currentLayout) => {
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

	function updateLayout(event: any) {
		layout.update((currentLayout) => {
			return {
				...currentLayout,
				[event.target.id]: event.detail.items
			};
		});
	}

	async function onFinalize(event: any) {
		updateLayout(event);

		// Convert widgets to an array of their IDs
		const ids = event.detail.items.map((widget: WidgetData) => widget.id);

		// Set the new layout to the database
		await fetch(`/api/column/set?column=${event.target.id}&widgets=${JSON.stringify(ids)}`, {
			method: 'PATCH'
		});
	}
</script>

<svelte:head>
	<title>nekopage</title>
</svelte:head>

<Settings />

{#each Object.values(Column) as column}
	{#if show}
		<div
			id={column}
			use:dndzone={{
				items: $layout[column],
				morphDisabled: true,
				dragDisabled: !$inLayoutEditor,
				flipDurationMs: 400
			}}
			onconsider={updateLayout}
			onfinalize={onFinalize}
			in:fly={{ y: 100 }}
			class="flex flex-col gap-2"
		>
			{#each $layout[column] as widget (widget.id)}
				{@const Component = widgets[widget.name]}
				<div animate:flip={{ duration: 400 }}>
					<Component data={widget} />
				</div>
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
			<button
				class="button !bg-base !text-text hover:brightness-95 shadow-sm"
				onclick={() => addWidget(widget)}>{widget}</button
			>
		{/each}
	</div>
{/if}

<style lang="postcss">
	#middle {
		@apply max-xl:row-start-1 max-xl:col-span-full;
	}
</style>
