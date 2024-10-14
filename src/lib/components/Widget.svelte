<script lang="ts">
	import { type Snippet } from 'svelte';

	import type { Column } from '$lib/enums';
	import { inLayoutEditor, inWidgetEditor, layout, widgetEditorData } from '$lib/stores';
	
	import Loading from '$lib/components/Loading.svelte';

	interface Props {
		children: Snippet;
		loading?: boolean;
		data: WidgetData;
		class?: string;
		style?: string;
	}

	let { children, loading, data, class: clazz, style }: Props = $props();

	// Buttons
	async function deleteWidget() {
		const request = await fetch(`/api/widget/delete?id=${data.id}`, {
			method: 'DELETE'
		});
		const response = await request.json();

		if (response.column) {
			layout.update((currentLayout) => {
				const updatedColumn = currentLayout[response.column as Column].filter(
					(widget) => widget.id !== data.id
				);

				return {
					...currentLayout,
					[response.column]: updatedColumn
				};
			});
		} else {
			// todo: show error on client
		}
	}

	function openWidgetEditor() {
		inWidgetEditor.set(true);
		widgetEditorData.set(data);
	}
</script>

<div class="widget select-none">
	<h1>{data.settings.title}</h1>

	<div class="widget-inner {clazz}" {style}>
		{#if $inLayoutEditor}
			<div
				class="absolute top-0 left-0 flex flex-col justify-center items-center gap-2 w-full h-full z-20 rounded-md transition duration-300 text-2xl hover:backdrop-blur hover:backdrop-brightness-[0.8] group"
			>
				<h1 class="font-semibold opacity-0 transition duration-300 drop-shadow group-hover:opacity-100">
					{data.type}
				</h1>

				<div class="flex gap-4 text-4xl opacity-0 transition duration-300 group-hover:opacity-100">
					<button data-tooltip={'Delete'} onclick={deleteWidget}>
						<iconify-icon icon="material-symbols:delete" class="drop-shadow"></iconify-icon>
					</button>
					<button data-tooltip={'Edit'} onclick={openWidgetEditor}>
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
