<script lang="ts">
	import { inLayoutEditor, layout } from '$lib/stores';
	import { type Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		loading?: boolean;
		data: WidgetData;
		class?: string;
		style?: string;
	}

	let { children, loading, data, class: clazz, style }: Props = $props();

	// Layout editor
	let element: HTMLDivElement;

	// Buttons
	async function deleteWidget() {
		const request = await fetch(`/api/widget/delete?id=${data.id}`, {
			method: 'DELETE'
		});
		const response = await request.json();

		if (response.column) {
			layout.update((currentLayout) => {
				const updatedColumn = currentLayout[response.column].filter(
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

	function openWidgetEditor() {}

	// Dragging animation
	let top = $state(0);
	let left = $state(0);

	let targetTop = $state(0);
	let targetLeft = $state(0);

	let dragging = $state(false);
	let dragX = $state(0);
	let dragY = $state(0);

	let cursor = $state('auto');

	let oldWidth = $state(0);

	const damping = 0.3;

	function startDragging() {
		top += (targetTop - top) * damping;
		left += (targetLeft - left) * damping;

		requestAnimationFrame(startDragging);
	}

	function onDragStart(event: DragEvent) {
		if ($inLayoutEditor) {
			event.dataTransfer?.setData('text/plain', data.id.toString());

			const image = new Image();
			image.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='; // Transparent image
			event.dataTransfer?.setDragImage(image, 0, 0);

			cursor = 'grabbing';
			oldWidth = element.clientWidth;
			dragging = true;

			dragX = event.clientX - element.getBoundingClientRect().x;
			dragY = event.clientY - element.getBoundingClientRect().y;

			left = targetLeft = event.clientX - dragX;
			top = targetTop = event.clientY - dragY;

			startDragging();
		}
	}

	function onDragEnd() {
		dragging = false;
		dragX = dragY = 0;
		cursor = 'grab';
	}

	function onDragOver(event: DragEvent) {
		if (dragging) {
			targetLeft = event.clientX - dragX;
			targetTop = event.clientY - dragY;
		}
	}

	inLayoutEditor.subscribe((value) => {
		if (value) {
			cursor = 'grab';
		} else {
			cursor = 'auto';
		}
	});
</script>

<div
	role="presentation"
	draggable={$inLayoutEditor ? 'true' : 'false'}
	bind:this={element}
	ondragstart={onDragStart}
	ondragend={onDragEnd}
	style="
		top: {top}px;
		left: {left}px;
		cursor: {cursor};
		position: {dragging ? 'absolute' : 'static'};
		width: {dragging ? oldWidth : 'auto'}px;
	"
	class="widget"
>
	<h1>{data.settings.title}</h1>

	<div class="widget-inner {clazz}" {style}>
		{#if $inLayoutEditor}
			<div
				class="absolute top-0 left-0 flex flex-col justify-center items-center gap-2 w-full h-full z-10 rounded-md transition duration-300 text-2xl hover:backdrop-blur hover:backdrop-brightness-[0.8] group"
			>
				<h1 class="font-semibold opacity-0 transition duration-300 group-hover:opacity-100">
					{data.settings.title}
				</h1>

				<div class="flex gap-8 text-5xl opacity-0 transition duration-300 group-hover:opacity-100">
					<button data-tooltip={'Delete'} onclick={deleteWidget}>
						<iconify-icon icon="material-symbols:delete"></iconify-icon>
					</button>
					<button data-tooltip={'Edit'} onclick={openWidgetEditor}>
						<iconify-icon icon="material-symbols:edit"></iconify-icon>
					</button>
				</div>
			</div>
		{/if}

		{#if loading}
			<div
				class="absolute top-0 left-0 flex justify-center items-center w-full h-full z-10 rounded-md backdrop-blur text-6xl"
			>
				<iconify-icon icon="line-md:loading-loop"></iconify-icon>
			</div>
		{/if}

		{@render children()}
	</div>
</div>

<svelte:window ondragover={onDragOver} />
