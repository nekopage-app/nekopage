<script lang="ts">
	import { onMount } from 'svelte';
	import DOMPurify from 'dompurify';

	import Widget from '$lib/components/Widget.svelte';

	let { data }: { data: WidgetData } = $props();

	let loading = $state(true);
	let rssItems = $state([] as any[]);

	async function get() {
		const request = await fetch(`/api/get-widget-api?widgetId=${data.id}`);
		const response = await request.json();

		rssItems = response['rss']['channel']['item'].slice(0, data.settings.items);

		loading = false;
	}

	onMount(() => {
		get();
		const interval = setInterval(get, 1000 * 60 * 60 * 4); // Run every 4 hours
		return clearInterval(interval);
	});
</script>

<Widget
	{loading}
	{data}
	style="grid-template-columns: repeat({data.settings.columns}, 1fr);"
	class="!grid gap-2"
>
	{#each rssItems as item}
		<a
			href={item.link}
			id="item"
			class="flex flex-col bg-base rounded transition duration-200 hover:ring-2 ring-light-accent"
		>
			{#if data.settings.showImages}
				<img
					src={item['media:thumbnail']['@_url']}
					alt="rss item thumbnail"
					class="rounded rounded-b-none object-cover h-32"
				/>
			{/if}

			<div id="item-information" class="p-4 h-full flex flex-col">
				<h1 class="text-xl font-semibold">{item.title}</h1>

				{#if data.settings.showDescription}
					<hr />
					<p>{@html DOMPurify.sanitize(item.description)}</p>
				{/if}

				{#if data.settings.showPublished}
					<div id="published" class="mt-auto">
						<hr class="mb-1" />
						<sub class="text-overlay">{item.pubDate}</sub>
					</div>
				{/if}
			</div>
		</a>
	{/each}
</Widget>
