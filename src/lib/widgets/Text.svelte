<script lang="ts">
	import Widget from "./Widget.svelte";

	let { settings }: { settings: WidgetSettings } = $props();
</script>

<Widget id="text" class="!p-3" settings={settings}>
	<p>{settings.text}</p>
</Widget>