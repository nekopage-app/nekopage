<script lang="ts">
	import { widgetEditorSettings } from '$lib/stores';
</script>

<div class="input input-helper">
	<div>
		<label for="title">Title</label>
		<p>The title of the widget (the text at top)</p>
	</div>
	<input type="text" name="title" bind:value={$widgetEditorSettings.title} />
</div>
