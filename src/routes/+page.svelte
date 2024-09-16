<script lang="ts">
	import { onMount, type Component } from 'svelte';
	import { fly } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';
	import type { PageData } from './$types';

	import { layout, showSettingsButton, showSettings, inLayoutEditor } from '$lib/stores';

	import Settings from '$lib/widgets/settings/Settings.svelte';

	// Widgets and layouts
	import Calendar from '$lib/widgets/Calendar.svelte';
	import Weather from '$lib/widgets/Weather.svelte';
	import Search from '$lib/widgets/Search.svelte';
	import Text from '$lib/widgets/Text.svelte';

	let { data }: { data: PageData } = $props();
	layout.set(data.layout);

	const widgets: { [key: string]: Component<{ settings: WidgetSettings }> } = {
		Calendar,
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
	let showAddMenu = $state(true);

	function exitLayoutEditor() {
		showSettings.set(true);
		showSettingsButton.set(true);
		inLayoutEditor.set(false);
		showAddMenu = false;
	}

	async function addWidget(widget: string) {
		const formData = new FormData();
		formData.append("name", widget);

		const request = await fetch("?/addWidget", {
			method: "POST",
			body: formData
		});
		const response = await request.json();
		const widgetId = JSON.parse(response.data)[0];

		layout.update(currentLayout => {
			return {
				...currentLayout,
				left: [
					...currentLayout.left,
					{
						id: widgetId,
						name: widget,
						settings: {
							title: widget.toLocaleLowerCase()
						}
					}
				]
			};
		});

		console.log($layout.left);
	}
</script>

<Settings />

{#each ['left', 'middle', 'right'] as column}
	{#if show}
		<div id={column} in:fly={{ y: 100 }} class="flex flex-col gap-2">
			{#each $layout[column] as widget}
				{@const Component = widgets[widget.name]}
				<Component settings={widget.settings} />
			{/each}
		</div>
	{/if}
{/each}

{#if $inLayoutEditor}
	<div
		id="layout-editor"
		in:fly={{ y: 10 }}
		out:fly={{ y: 10 }}
		class="widget-inner !fixed bottom-8 left-8 w-96 h-[3.25rem] !flex-row justify-between items-center !shadow-xl"
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
		class="widget-inner !fixed bottom-24 left-8 w-96 h-96 !shadow-xl !grid grid-cols-2 grid-rows-9 gap-1.5"
	>
		{#each Object.keys(widgets) as widget}
			<button class="button !bg-base !text-text hover:brightness-95" onclick={() => addWidget(widget)}>{widget}</button>
		{/each}
	</div>
{/if}

<style lang="postcss">
	#middle {
		@apply max-xl:row-start-1 max-xl:col-span-full;
	}
</style>
