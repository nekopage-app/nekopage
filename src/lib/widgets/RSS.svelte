<script lang="ts">
	import { onMount } from "svelte";
	import DOMPurify from "dompurify";

	import Widget from "$lib/components/Widget.svelte";

	let { data }: { data: WidgetData } = $props();

	let loading = $state(true);
	let rssItems = $state([] as any[]);

	async function get() {
		const request = await fetch(`/api/get-widget-api?widgetId=${data.id}`);
		const response = await request.json();

		rssItems = response["rss"]["channel"]["item"].slice(0, data.settings.items);

		loading = false;
	}

	onMount(() => {
		get();
		const interval = setInterval(get, 1000 * 60 * 60 * 4); // Run every 4 hours
		return clearInterval(interval);
	});
</script>

<Widget loading={loading} data={data} class="!grid grid-cols-3 gap-2">
	{#if data.settings.style == "cozy"}
		{#each rssItems as item}
			<a href={item.link} id="item" class="flex flex-col bg-base rounded p-4 transition hover:ring-2 ring-light-accent">
				<h1 class="text-xl font-semibold">{item.title}</h1>
				<hr>
				<p>{@html DOMPurify.sanitize(item.description)}</p>
				
				<div id="published" class="mt-auto">
					<hr class="mb-1">
					<sub class="text-overlay">{item.pubDate}</sub>
				</div>
			</a>
		{/each}
	{/if}
</Widget>