<script lang="ts">
	import { showSaveMessage, widgetEditorSettings } from '$lib/stores';
	import UnsavedMessage from '../UnsavedMessage.svelte';

	let { onClickSave }: WidgetEditorComponentProps = $props();

	let oldWidgetSettings = { ...$widgetEditorSettings };
	let unsaved = $state(false);

	function onInput() {
		unsaved = true;
	}

	// Update oldWidgetSettings on save
	showSaveMessage.subscribe((value) => {
		if (value) {
			oldWidgetSettings = { ...$widgetEditorSettings };
		}
	});
</script>

<!-- Weird bug where clicking reset for the second time doesn't work so I have to stringify then parse it?? -->
<UnsavedMessage bind:show={unsaved} onClickSave={onClickSave} onClickReset={() => widgetEditorSettings.set(JSON.parse(JSON.stringify(oldWidgetSettings)))} />

<div class="input input-helper">
	<div>
		<label for="title">Title</label>
		<p>The title of the widget (the text at top)</p>
	</div>
	<input type="text" name="title" oninput={onInput} bind:value={$widgetEditorSettings.title} />
</div>
