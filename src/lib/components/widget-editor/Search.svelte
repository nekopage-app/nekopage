<script lang="ts">
	import { showSaveMessage, widgetEditorData } from '$lib/stores';
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

	let searchEngine = $state('custom');

	$effect(() => {
		searchEngine;

		switch (searchEngine) {
			case 'google':
				$widgetEditorData.settings.url = 'https://www.google.com/search?q=';
				break;
			case 'bing':
				$widgetEditorData.settings.url = 'https://www.bing.com/search?q=';
				break;
			case 'yahoo':
				$widgetEditorData.settings.url = 'https://search.yahoo.com/search?p=';
				break;
			case 'duckduckgo':
				$widgetEditorData.settings.url = 'https://duckduckgo.com/?q=';
				break;
			case 'startpage':
				$widgetEditorData.settings.url = 'https://www.startpage.com/sp/search?query=';
				break;
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
		<label for="url">Search Engine</label>
		<p>The search engine. Choosing custom will allow you to put your own URL.</p>
	</div>
	<select name="url" oninput={onInput} bind:value={searchEngine}>
		<option value="google">Google</option>
		<option value="bing">Bing</option>
		<option value="yahoo">Yahoo</option>
		<option value="duckduckgo">DuckDuckGo</option>
		<option value="startpage">Startpage</option>
		<option value="custom">Custom...</option>
	</select>
</div>

<div class="input input-helper-parent">
	<div class="input-helper">
		<label for="url">Search Engine URL</label>
		<p>User input will be inserted at the end of the URL.</p>
	</div>
	<input
		type="text"
		name="title"
		bind:value={$widgetEditorData.settings.url}
		oninput={() => { searchEngine = 'custom'; onInput() }}
	/>
</div>
