<script lang="ts">
	import { type Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		class?: string;
		loading?: boolean;
		data: WidgetData;
	}

	let { children, class: clazz, loading, data }: Props = $props();

	// Layout editor
	let element: HTMLDivElement;

	// Dragging animation
	let top = $state(0);
	let left = $state(0);

	let targetTop = $state(0);
	let targetLeft = $state(0);

	let dragging = $state(false);
	let dragX = $state(0);
	let dragY = $state(0);

	let oldWidth = $state(0);

	const damping = 0.3;

	function startDragging() {
		top += (targetTop - top) * damping;
		left += (targetLeft - left) * damping;

		requestAnimationFrame(startDragging);
	}

	function onDragStart(event: DragEvent) {
		event.dataTransfer?.setData('text/plain', data.id.toString());

		const image = new Image();
		image.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';		// Transparent image
		event.dataTransfer?.setDragImage(image, 0, 0);

		oldWidth = element.clientWidth;
		dragging = true;

		dragX = event.clientX - element.getBoundingClientRect().x;
		dragY = event.clientY - element.getBoundingClientRect().y;

		left = targetLeft = event.clientX - dragX;
		top = targetTop = event.clientY - dragY;

		startDragging();
	}

	function onDragEnd() {
		dragging = false;
		dragX = dragY = 0;
	}

	function onDragOver(event: DragEvent) {
		if (dragging) {
			targetLeft = event.clientX - dragX;
			targetTop = event.clientY - dragY;
		}
	}
</script>

<div
	role="presentation"
	draggable="true"
	bind:this={element}
	ondragstart={onDragStart}
	ondragend={onDragEnd}
	style="top: {top}px; left: {left}px; cursor: {dragging ? "grabbing" : "grab"}; position: {dragging ? "absolute" : "static"}; width: {dragging ? oldWidth : "auto"}px;"
	class="widget"
>
	<h1>{data.settings.title}</h1>

	<div class="widget-inner {clazz}">
		{#if loading}
			<div class="loading-container">
				<iconify-icon icon="line-md:loading-loop"></iconify-icon>
			</div>
		{/if}

		{@render children()}
	</div>
</div>

<svelte:window ondragover={onDragOver} />
