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

	let feed = $state('custom');

	$effect(() => {
		feed;

		switch (feed) {
			case 'bbc':
				$widgetEditorData.settings.url = 'https://feeds.bbci.co.uk/news/rss.xml';
				break;
			case 'hackernews':
				$widgetEditorData.settings.url = 'https://hnrss.org/frontpage';
				break;
			case 'anime':
				$widgetEditorData.settings.url = 'https://www.animenewsnetwork.com/all/rss.xml';
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

<div class="input input-helper">
	<div>
		<label for="title">Title</label>
		<p>The title of the widget (the text at top)</p>
	</div>
	<input type="text" name="title" oninput={onInput} bind:value={$widgetEditorData.settings.title} />
</div>

<hr>

<div class="input input-helper">
	<div>
		<label for="columns">Columns</label>
		<p>The amount of columns to show in the widget</p>
	</div>
	<input type="number" name="columns" oninput={onInput} bind:value={$widgetEditorData.settings.columns} />
</div>

<div class="input input-helper">
	<div>
		<label for="items">Items</label>
		<p>The amount of items to show in the widget</p>
	</div>
	<input type="number" name="items" oninput={onInput} bind:value={$widgetEditorData.settings.items} />
</div>

<hr>

<div class="input input-helper">
	<div>
		<label for="show-images">Show Images</label>
		<p>Toggle to show images taken from the RSS feed</p>
	</div>
	<input type="checkbox" name="show-images" oninput={onInput} bind:checked={$widgetEditorData.settings.showImages} />
</div>

<div class="input input-helper">
	<div>
		<label for="show-descriptions">Show Descriptions</label>
		<p>Toggle to show descriptions taken from the RSS feed</p>
	</div>
	<input type="checkbox" name="show-descriptions" oninput={onInput} bind:checked={$widgetEditorData.settings.showDescriptions} />
</div>

<div class="input input-helper">
	<div>
		<label for="show-published">Show Published Dates</label>
		<p>Toggle to show published dates taken from the RSS feed</p>
	</div>
	<input type="checkbox" name="show-published" oninput={onInput} bind:checked={$widgetEditorData.settings.showPublished} />
</div>

<hr>

<div class="input input-helper">
	<div>
		<label for="url">Feed</label>
		<p>The RSS feed. Choosing custom will allow you to put your own URL.</p>
	</div>
	<select name="url" oninput={onInput} bind:value={feed}>
		<option value="bbc">BBC News — Main</option>
		<option value="hackernews">HackerNews — Front page</option>
		<option value="anime">Anime News Network</option>
		<option value="duckduckgo">DuckDuckGo</option>
		<option value="startpage">Startpage</option>
		<option value="custom">Custom...</option>
	</select>
</div>

<div class="input input-helper">
	<div>
		<label for="url">Feed URL</label>
		<p>The URL for the RSS feed.</p>
	</div>
	<input
		type="text"
		name="title"
		bind:value={$widgetEditorData.settings.url}
		oninput={() => { feed = 'custom'; onInput() }}
	/>
</div>
