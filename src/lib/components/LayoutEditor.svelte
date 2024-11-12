<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';

	import { layout, showSettingsButton, showSettings, inLayoutEditor, showErrorMessage, errorMessage } from '$lib/stores';
	import widgetsJSON from '$lib/data/widgets.json';
	const widgetsData: WidgetsJSON = widgetsJSON;

	import WidgetEditor from './widget-editor/WidgetEditor.svelte';

	// Layout editor
	let showAddMenu = $state(false);

	let addMenuSearchValue = $state('');
	let filteredWidgets = $derived(
		Object.entries(widgetsData).filter(([_, widget]) =>
			widget.name.toLocaleLowerCase().includes(addMenuSearchValue.toLocaleLowerCase())
		).map(([type, widget]) => ({ type, name: widget.name }))
	);

	function exitLayoutEditor() {
		showSettings.set(true);
		showSettingsButton.set(true);
		inLayoutEditor.set(false);
		showAddMenu = false;
	}

	async function addWidget(widgetType: string) {
		const response = await fetch(`/api/widget/add?type=${widgetType}`, {
			method: 'POST'
		});
		const data = await response.json();

		if (data.id) {
			const settings = widgetsData[widgetType].settings;

			layout.update((currentLayout) => {
				return {
					...currentLayout,
					left: [
						...currentLayout.left,
						{
							id: data.id,
							type: widgetType,
							settings
						}
					]
				};
			});
		} else {
			showErrorMessage.set(true);
			errorMessage.set("Failed to add widget!");
		}
	}
</script>

{#if showAddMenu}
	<div
		id="add-widget-menu"
		class="widget select-none fixed bottom-28 left-1/2 -translate-x-1/2 z-30 !shadow-lg"
		in:fly={{ y: 10, easing: quadOut }}
		out:fly={{ y: 10, easing: quadOut }}
	>
		<h1 class="!justify-center !text-accent">add widgets</h1>

		<div
			class="widget-inner w-72 h-96 overflow-auto !outline-accent ring-[5px] ring-[color-mix(in_srgb,var(--accent)_30%,transparent)]"
		>
			<div class="input">
				<input type="text" placeholder="search..." bind:value={addMenuSearchValue} />
			</div>

			<hr class="m-2" />

			<div class="!grid grid-cols-2 gap-1.5">
				{#each filteredWidgets as widget}
					<button class="button !bg-accent !text-crust shadow-sm" onclick={() => addWidget(widget.type)}
						>{widget.name}</button
					>
				{/each}
			</div>
		</div>
	</div>
{/if}

{#if $inLayoutEditor}
	<div
		id="layout-editor-menu"
		class="widget select-none fixed bottom-4 left-1/2 -translate-x-1/2 z-30"
		in:fly={{ y: 10 }}
		out:fly={{ y: 10 }}
	>
		<h1 class="!justify-center !text-accent">layout editor</h1>

		<div
			class="widget-inner !flex-row gap-1 !outline-accent ring-[5px] ring-[color-mix(in_srgb,var(--accent)_30%,transparent)]"
		>
			<button class="button !bg-accent !text-crust" onclick={() => (showAddMenu = !showAddMenu)}>
				add
			</button>
			<button class="button !bg-accent !text-crust" onclick={exitLayoutEditor}> exit </button>
		</div>
	</div>

	<WidgetEditor />
{/if}
