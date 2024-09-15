<script lang="ts">
	import { inLayoutEditor } from '$lib/stores';
	import { onDestroy, type Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		id: string;
		class?: string;
		loading?: boolean;
		settings: WidgetSettings;
	}

	let { children, id, class: clazz, loading, settings }: Props = $props();

	// Layout editor
	let top = $state(0);
	let left = $state(0);
	let rotation = $state(0);

	let targetTop = $state(0);
	let targetLeft = $state(0);
	let targetRotation = $state(0);

	let dragging = $state(false);
	let cursor = $state('auto');

	const damping = 0.3;

	function lerp(start: number, end: number, t: number) {
		return start * (1 - t) + end * t;
	}

	function onMouseDown() {
		if ($inLayoutEditor) {
			dragging = true;
			cursor = 'grabbing';
		}
	}

	function onMouseMove(event: MouseEvent) {
		if ($inLayoutEditor && dragging) {
			targetTop += event.movementY;
			targetLeft += event.movementX;
			targetRotation = event.movementX;
		}
	}

	function onMouseUp() {
		if ($inLayoutEditor) {
			targetRotation = 0;
			dragging = false;
			cursor = 'grab';
		}
	}

	function startDragging() {
		top += (targetTop - top) * damping;
		left += (targetLeft - left) * damping;

		rotation = lerp(rotation, targetRotation, 0.1);

		requestAnimationFrame(startDragging);
	}

	inLayoutEditor.subscribe((value) => {
		if (value) {
			cursor = 'grab';
            startDragging();
		} else {
			cursor = 'auto';
		}
	});
</script>

<div {id} class="widget">
	<h1>{settings.title}</h1>

	<div
		class="widget-inner {clazz}"
		role="presentation"
		onmousedown={onMouseDown}
		style="top: {top}px; left: {left}px; transform: rotate({rotation}deg); cursor: {cursor};"
	>
		{#if loading}
			<div class="loading-container">
				<iconify-icon icon="line-md:loading-loop"></iconify-icon>
			</div>
		{/if}

		{@render children()}
	</div>
</div>

<svelte:window onmouseup={onMouseUp} onmousemove={onMouseMove} />
