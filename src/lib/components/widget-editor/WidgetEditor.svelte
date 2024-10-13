<script lang="ts">
	import type { Component } from 'svelte';

	import { Column } from '$lib/enums';
	import {
		inWidgetEditor,
		layout,
		showSaveMessage,
		widgetEditorId,
		widgetEditorSettings
	} from '$lib/stores';

	import FloatingMenu from '../FloatingMenu.svelte';

	import TitleOnly from './TitleOnly.svelte';
    import Picture from './Picture.svelte';
	import Search from './Search.svelte';

	let widgetType = $state('');
	let widgetColumn = $state('left' as Column);

	widgetEditorId.subscribe((id) => {
		const columns = [
			{ name: Column.Left, widgets: $layout.left },
			{ name: Column.Middle, widgets: $layout.middle },
			{ name: Column.Right, widgets: $layout.right }
		];

		const foundColumn = columns.find(({ widgets }) => widgets.some((widget) => widget.id === id));

		const widgetData = foundColumn?.widgets.find((widget) => widget.id === id);

		if (widgetData && foundColumn) {
			widgetEditorSettings.set(widgetData.settings);
			widgetType = widgetData.type;
			widgetColumn = foundColumn.name;
		} else {
			inWidgetEditor.set(false);
		}
	});

	const widgetComponents: { [key: string]: Component<WidgetEditorComponentProps> } = {
		Calendar: TitleOnly,
        Picture: Picture,
		Search: Search,
	};

	export async function onClickSave() {
		showSaveMessage.set(true);

		await fetch(
			`/api/widget/set?id=${$widgetEditorId}&settings=${JSON.stringify($widgetEditorSettings)}`,
			{
				method: 'PATCH'
			}
		);

		layout.update((currentLayout) => {
			return {
				...currentLayout,
				[widgetColumn]: currentLayout[widgetColumn].map((widget) => {
					if (widget.id == $widgetEditorId) {
						return {
							...widget,
							settings: $widgetEditorSettings
						};
					}

					return widget;
				})
			};
		});
	}
</script>

<FloatingMenu title="widget editor" id="widget-editor" show={inWidgetEditor}>
	<div class="flex gap-8 *:flex *:gap-2 *:items-center">
		<div id="widget-type" data-tooltip="Widget type">
			<iconify-icon icon="solar:widget-bold" class="text-3xl"></iconify-icon>
			<h1 class="text-lg">{widgetType.toLocaleLowerCase()}</h1>
		</div>
		<div id="widget-column" data-tooltip="Widget column">
			<iconify-icon icon="mingcute:column-fill" class="text-3xl"></iconify-icon>
			<h1 class="text-lg">{widgetColumn}</h1>
		</div>
		<div id="widget-id" data-tooltip="Widget ID">
			<iconify-icon icon="solar:key-bold" class="text-3xl"></iconify-icon>
			<h1 class="text-lg">{$widgetEditorId}</h1>
		</div>

		<button class="button ml-auto" onclick={onClickSave}>
			<iconify-icon icon="ic:baseline-save" class="text-xl"></iconify-icon>
			save
		</button>
	</div>

	<hr />

	{@const Component = widgetComponents[widgetType]}

	<div class="flex flex-col gap-1">
		<Component onClickSave={onClickSave} />
	</div>
</FloatingMenu>