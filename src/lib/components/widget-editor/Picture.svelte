<script lang="ts">
	import { showSaveMessage, widgetEditorData } from '$lib/stores';

	import UnsavedMessage from '../UnsavedMessage.svelte';
	import FileInput from '../inputs/FileInput.svelte';

	let { onClickSave }: WidgetEditorComponentProps = $props();

	let oldWidgetData = { ...$widgetEditorData };
	let unsaved = $state(false);

	function onInput() {
		unsaved = true;
	}

	// Update oldWidgetData on save
	showSaveMessage.subscribe((value) => {
		if (value) {
			oldWidgetData = { ...$widgetEditorData };
		}
	});
</script>

<!-- Weird bug where clicking reset for the second time doesn't work so I have to stringify then parse it?? -->
<UnsavedMessage bind:show={unsaved} onClickSave={onClickSave} onClickReset={() => widgetEditorData.set(JSON.parse(JSON.stringify(oldWidgetData)))} />

<div class="input input-helper-parent">
	<div class="input-helper">
		<label for="title">Title</label>
		<p>The title of the widget (the text at top)</p>
	</div>
	<input type="text" name="title" oninput={onInput} bind:value={$widgetEditorData.settings.title} />
</div>

<div class="input input-helper-parent">
	<div class="input-helper">
		<label for="height">Height</label>
		<p>The height of the image in pixels</p>
	</div>
	<input type="number" name="height" oninput={onInput} bind:value={$widgetEditorData.settings.height} />
</div>

<div class="input input-helper-parent">
	<div class="input-helper">
		<label for="title">Image</label>
		<p>The image to be shown</p>
	</div>
	<div>
		<FileInput onInput={onInput} />
	</div>
</div>