<script lang="ts">
	import { type Snippet } from 'svelte';

	import type { Column } from '$lib/enums';
	import { errorMessage, inLayoutEditor, inWidgetEditor, layout, showErrorMessage, widgetEditorData } from '$lib/stores';
	
	import Loading from '$lib/components/Loading.svelte';
	import ConfirmModal from './ConfirmModal.svelte';

	interface Props {
		children: Snippet;
		loading?: boolean;
		data: WidgetData;
		class?: string;
		style?: string;
		onRefresh?: () => void;
	}

	let { children, loading, data, class: clazz, style, onRefresh: onRefreshProp }: Props = $props();

	async function onRefresh() {
		// Tell API to fetch the widget's API again
		await fetch(`/api/widget/${data.id}/api?data=${JSON.stringify(data)}`, {
			method: 'PUT'
		});

		if (onRefreshProp) onRefreshProp();
	}

	// Layout editor
	let showDeleteModal = $state(false);

	async function deleteWidget() {
		const response = await fetch(`/api/widget/${data.id}/delete`, {
			method: 'DELETE'
		});
		const responseData = await response.json();

		if (responseData.column) {
			layout.update((currentLayout) => {
				const updatedColumn = currentLayout[responseData.column as Column].filter(
					(widget) => widget.id !== data.id
				);

				return {
					...currentLayout,
					[responseData.column]: updatedColumn
				};
			});
		} else {
			showErrorMessage.set(true);
			errorMessage.set("Failed to delete widget!")
		}
	}

	function openWidgetEditor() {
		inWidgetEditor.set(true);
		widgetEditorData.set(data);
	}
</script>

<div class="widget select-none">
	<h1>
		{data.settings.title}

		{#if onRefreshProp}
			<button onclick={onRefresh}>
				<iconify-icon icon="material-symbols:refresh"></iconify-icon>
				refresh
			</button>
		{/if}
	</h1>

	<div class="widget-inner {clazz}" {style}>
		{#if $inLayoutEditor}
			<div
				class="absolute top-0 left-0 flex flex-col justify-center items-center gap-2 w-full h-full z-20 rounded-md transition duration-300 text-2xl hover:backdrop-blur hover:backdrop-brightness-[0.8] group"
			>
				<h1 class="font-semibold opacity-0 transition duration-300 drop-shadow group-hover:opacity-100">
					{data.type}
				</h1>

				<div class="flex gap-4 text-4xl opacity-0 transition duration-300 group-hover:opacity-100">
					<button aria-label="Delete Widget" data-tooltip={'Delete'} onclick={() => showDeleteModal = true}>
						<iconify-icon icon="material-symbols:delete" class="drop-shadow"></iconify-icon>
					</button>
					<button aria-label="Edit Widget" data-tooltip={'Edit'} onclick={openWidgetEditor}>
						<iconify-icon icon="material-symbols:edit" class="drop-shadow"></iconify-icon>
					</button>
				</div>
			</div>
		{/if}

		{#if loading}
			<Loading {loading} />
		{/if}

		{@render children()}
	</div>
</div>

{#if $inLayoutEditor}
	<ConfirmModal bind:show={showDeleteModal} id="delete-widget-modal" description="Are you sure you want to delete this {data.type} widget? This is irreversible!" onClickYes={deleteWidget} />
{/if}