<script lang="ts">
	import Widget from "$lib/components/Widget.svelte";

	let { data }: { data: WidgetData } = $props();
</script>

<Widget class="!p-3" data={data}>
	<p>{data.settings.text}</p>
</Widget>