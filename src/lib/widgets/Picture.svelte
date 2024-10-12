<script lang="ts">
	import Widget from "$lib/components/Widget.svelte";

	let { data }: { data: WidgetData } = $props();
</script>

<Widget class="!p-0" {data}>
	<img src={data.settings.image} alt="not found!" style="height: {data.settings.height}px;" class="rounded object-cover">
</Widget>