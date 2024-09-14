<script lang="ts">
	let { settings }: { settings: WidgetSettings } = $props();
</script>

<div id="text" class="widget">
	<h1>{settings.title}</h1>

	<div class="widget-inner">
		<p>{settings.text}</p>
	</div>
</div>