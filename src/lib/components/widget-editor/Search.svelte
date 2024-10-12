<script lang="ts">
	import { widgetEditorSettings } from '$lib/stores';

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

<div class="input input-helper">
	<div>
		<label for="title">Title</label>
		<p>The title of the widget (the text at top)</p>
	</div>
	<input type="text" name="title" bind:value={$widgetEditorSettings.title} />
</div>

<div class="input input-helper">
	<div>
		<label for="url">Search Engine</label>
		<p>The search engine.</p>
	</div>
	<select name="url" bind:value={searchEngine}>
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
		oninput={() => (searchEngine = 'custom')}
	/>
</div>
