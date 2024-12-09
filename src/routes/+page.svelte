<script lang="ts">
	import type { PageData } from './$types';

	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	import { dndzone } from 'svelte-dnd-action';

	import { Column } from '$lib/enums';
	import { layout, showSettingsButton, inLayoutEditor } from '$lib/stores';
	import { widgets } from '$lib/widgets';

	import Settings from '$lib/components/settings/Settings.svelte';
	import LayoutEditor from '$lib/components/LayoutEditor.svelte';
	import SaveMessage from '$lib/components/SaveMessage.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';

	// Set layout
	let { data }: { data: PageData } = $props();
	layout.set(data.layout!);

	// Animation on page load
	let show = $state(false);

	onMount(() => {
		show = true;
		showSettingsButton.set(true);
		return;
	});

	// Layout editor
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
<LayoutEditor />
<SaveMessage />
<ErrorMessage />

{#each Object.values(Column) as column}
	{#if show}
		<div
			id={column}
			use:dndzone={{
				items: $layout[column],
				dragDisabled: !$inLayoutEditor,
				flipDurationMs: 400,
				dropTargetStyle: {},
				centreDraggedOnCursor: true
			}}
			onconsider={updateLayout}
			onfinalize={onFinalize}
			in:fly={{ y: 100 }}
			class="flex flex-col gap-2 rounded p-2 {$inLayoutEditor ? "outline-2 outline-overlay outline-dashed" : ""}"
		>
			{#each $layout[column] as widget (widget.id)}
				{@const Component = widgets[widget.type]}
				<div animate:flip={{ duration: 400 }}>
					<Component data={widget} />
				</div>
			{/each}
		</div>
	{/if}
{/each}

<style lang="postcss">
	#middle {
		@apply max-xl:row-start-1 max-xl:col-span-full;
	}
</style>
