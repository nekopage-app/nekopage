<script lang="ts">
	import { onMount } from 'svelte';
	import Widget from '$lib/components/Widget.svelte';

	let { data }: { data: WidgetData } = $props();

	let loading = $state(true);

	let moonPhaseIcon = $state('wi:moon-alt-waning-gibbous-6');
	let moonPhase = $state('Waning Gibbous');
	let sunrise = $state('04:29 am');
	let sunset = $state('10:04 pm');

	async function get() {
		const request = await fetch(`/api/widget/api?id=${data.id}`);
		const response = await request.json();

		if (Object.keys(response.api).length > 0) {
			moonPhaseIcon = response.api.icon;
			moonPhase = response.api.moonPhase;
			sunrise = new Date(response.api.sunrise)
				.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
				.toLocaleLowerCase();
			sunset = new Date(response.api.sunset)
				.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
				.toLocaleLowerCase();

			loading = false;
		}
	}

	onMount(() => {
		get();
		const interval = setInterval(get, 1000 * 60 * 60 * 12); // Run every 12 hours
		return clearInterval(interval);
	});
</script>

<Widget class="!p-4 items-center bg-gradient-to-t from-transparent to-[#00000048]" {loading} {data}>
	<iconify-icon icon="line-md:moon-filled-alt-loop" class="absolute left-4 text-4xl"></iconify-icon>
	<iconify-icon icon={moonPhaseIcon} class="text-8xl"></iconify-icon>
	<span class="text-[1.3rem] font-bold">{moonPhase}</span>

	<table class="table-fixed w-48 mt-2">
		<tbody class="*:text-[1rem] *:text-center">
			<tr>
				<td class="font-medium">Sunrise</td>
				<td>{sunrise}</td>
			</tr>
			<tr>
				<td class="font-medium">Sunset</td>
				<td>{sunset}</td>
			</tr>
		</tbody>
	</table>
</Widget>
