<script lang="ts">
	import { onMount } from 'svelte';
	import Widget from '$lib/components/Widget.svelte';

	let { data }: { data: WidgetData } = $props();

	let loading = $state(true);

	let queries = $state(0);
	let blocked = $state(0);

	async function onRefresh() {
		const response = await fetch(`/api/widget/${data.id}/api`);
		const responseData = await response.json();

		if (Object.keys(responseData.api).length > 0) {
			queries = responseData.api.queries;
			blocked = responseData.api.blocked;

			loading = false;
		}
	}

	onMount(() => {
		onRefresh();
		const interval = setInterval(onRefresh, 1000 * 60 * 60 * 12); // Run every 12 hours
		return clearInterval(interval);
	});
</script>

<Widget {loading} {data} {onRefresh}>
	<iconify-icon icon="fluent:calendar-shield-28-filled" class="text-4xl"></iconify-icon>
	<p>Queries: {queries}</p>
	<p>Blocked: {blocked}</p>
</Widget>