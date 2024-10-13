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

	let searchEngine = $state('custom');

	$effect(() => {
		searchEngine;

		switch (searchEngine) {
			case 'google':
				$widgetEditorSettings.url = 'https://www.google.com/search?q=';
				break;
			case 'bing':
				$widgetEditorSettings.url = 'https://www.bing.com/search?q=';
				break;
			case 'yahoo':
				$widgetEditorSettings.url = 'https://search.yahoo.com/search?p=';
				break;
			case 'duckduckgo':
				$widgetEditorSettings.url = 'https://duckduckgo.com/?q=';
				break;
			case 'startpage':
				$widgetEditorSettings.url = 'https://www.startpage.com/sp/search?query=';
				break;
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

<div class="input input-helper">
	<div>
		<label for="url">Search Engine</label>
		<p>The search engine.</p>
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

<div class="input input-helper">
	<div>
		<label for="url">Search Engine URL</label>
		<p>User input will be inserted at the end of the URL.</p>
	</div>
	<input
		type="text"
		name="title"
		bind:value={$widgetEditorSettings.url}
		oninput={() => { searchEngine = 'custom'; onInput() }}
	/>
</div>
