<script lang="ts">
	import { widgetEditorSettings } from '$lib/stores';
	import FileInput from '../inputs/FileInput.svelte';
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
		<label for="height">Height</label>
		<p>The height of the image in pixels</p>
	</div>
	<input type="number" name="height" bind:value={$widgetEditorSettings.height} />
</div>

<div class="input input-helper">
	<div>
		<label for="title">Image</label>
		<p>The image to be shown</p>
	</div>
	<div>
		<FileInput />
	</div>
</div>