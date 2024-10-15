<script lang="ts">
	import { onMount } from 'svelte';
	import DOMPurify from 'dompurify';

	import Widget from '$lib/components/Widget.svelte';

	let { data }: { data: WidgetData } = $props();

	let loading = $state(true);
	let rssItems = $state([] as any[]);

	async function get() {
		const request = await fetch(`/api/widget/${data.id}/api`);
		const response = await request.json();

		if (Object.keys(response.api).length > 0) {
			rssItems = response.api;
			loading = false;
		}
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
			class="flex flex-col bg-base rounded transition duration-200 hover:ring-2 ring-[color-mix(in_srgb,var(--accent)_30%,transparent)]"
		>
			{#if data.settings.showImages}
				{#if item['media:thumbnail']}
					<img
						src={item['media:thumbnail']['@_url']}
						alt="rss item thumbnail"
						class="rounded rounded-b-none object-cover h-32"
					/>
				{/if}
			{/if}

			<div id="item-information" class="p-4 h-full flex flex-col">
				<h1 class="text-lg font-semibold">{item.title}</h1>

				{#if data.settings.showDescription}
					{#if item.description}
						<hr />
						<p class="text-sm">{@html DOMPurify.sanitize(item.description)}</p>
					{/if}
				{/if}

				{#if data.settings.showPublished}
					{#if item.pubDate}
						<div id="published" class="mt-auto">
							<hr class="mb-1" />
							<sub class="text-overlay">{item.pubDate}</sub>
						</div>
					{/if}
				{/if}
			</div>
		</a>
	{/each}
</Widget>
