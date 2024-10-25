<script lang="ts">
	import { showSaveMessage, widgetEditorData } from '$lib/stores';
	import PasswordInput from '../inputs/PasswordInput.svelte';
	import UnsavedMessage from '../UnsavedMessage.svelte';

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

    // API Key
    let apiKey = $state("#################################");

    $effect(() => {
		apiKey;

		$widgetEditorData.settings.apiKey = apiKey;
	});
</script>

<!-- Weird bug where clicking reset for the second time doesn't work so I have to stringify then parse it?? -->
<UnsavedMessage
	bind:show={unsaved}
	{onClickSave}
	onClickReset={() => widgetEditorData.set(JSON.parse(JSON.stringify(oldWidgetData)))}
/>

<div class="input input-helper-parent">
	<div class="input-helper">
		<label for="title">Title</label>
		<p>The title of the widget (the text at top)</p>
	</div>
	<input type="text" name="title" oninput={onInput} bind:value={$widgetEditorData.settings.title} />
</div>

<hr />

<div class="input input-helper-parent">
	<div class="input-helper">
		<label for="api">API</label>
		<p>Choose the API service you want to use.</p>
	</div>
	<select name="api" oninput={onInput} bind:value={$widgetEditorData.settings.api}>
		<option value="weatherapi.com">weatherapi.com</option>
	</select>
</div>

<div class="input input-helper-parent">
	<div class="input-helper">
		<label for="api-key">API Key</label>
		<p>Choose the API service you want to use.</p>
	</div>
    <PasswordInput placeholder="Type your API key here..." bind:value={apiKey} onInput={onInput} />
</div>

<div class="input input-helper-parent">
	<div class="input-helper">
		<label for="location">Location</label>
		<p>Your location. See nekopage documentation for more information.</p>
	</div>
	<input
		type="text"
		name="location"
		oninput={onInput}
		bind:value={$widgetEditorData.settings.location}
	/>
</div>
