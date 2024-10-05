<script lang="ts">
	import { onMount } from 'svelte';
	import Widget from '$lib/components/Widget.svelte';

	let { data }: { data: WidgetData } = $props();

	let loading = $state(true);

	let location = $state('null, undefined');
	let temperature = $state('??°C');

	let condition = $state('Partly cloudy');
	let icon = $state('material-symbols:cloudy');

	let rainChance = $state('0%');
	let wind = $state('?? kph');
	let humidity = $state('0%');

	async function get() {
		const request = await fetch(`/api/widget-api?id=${data.id}`);
		const response = await request.json();

		if (response.api) {
			location = `${response.api.place}, ${response.api.country}`;

			temperature = `${response.api.temperature}°C`;
			if (data.settings.fahrenheit) {
				temperature = `${(response.api.temperature * 9) / 5 + 32}°F`;
			}

			condition = response.api.condition;
			icon = response.api.icon;

			rainChance = `${response.api.rainChance}%`;
			wind = `${response.api.wind} kph`;
			if (data.settings.mph) {
				wind = `${response.api.wind} mph`;
			}
			humidity = `${response.api.humidity}%`;

			loading = false;
		}
	}

	onMount(() => {
		get();
		const interval = setInterval(get, 1000 * 60 * 60 * 12); // Run every 12 hours
		return clearInterval(interval);
	});

	let form;
</script>

<Widget {loading} {data}>
	<div id="location" class="p-2 flex items-center gap-2">
		<iconify-icon icon="mingcute:location-fill" class="text-xl"></iconify-icon>
		<span>{location}</span>
	</div>

	<div id="icon" class="flex justify-center items-center mb-4">
		<div id="icon-text" class="flex flex-col w-40">
			<span class="text-5xl font-bold">{temperature}</span>
			<span class="font-semibold">{condition}</span>
		</div>

		<iconify-icon {icon} class="text-8xl"></iconify-icon>
	</div>

	<div id="overview" class="flex justify-evenly items-center mb-4">
		<div class="overview-div" data-tooltip={'Chance of rain'}>
			<iconify-icon icon="material-symbols:rainy"></iconify-icon>
			<span>{rainChance}</span>
		</div>

		<div class="overview-div" data-tooltip={'Wind'}>
			<iconify-icon icon="ph:wind-bold"></iconify-icon>
			<span>{wind}</span>
		</div>

		<div class="overview-div" data-tooltip={'Humidity'}>
			<iconify-icon icon="material-symbols:humidity-high"></iconify-icon>
			<span>{humidity}</span>
		</div>
	</div>
</Widget>

<style lang="postcss">
	.overview-div {
		@apply bg-text text-mantle flex items-center gap-1 p-1 rounded-sm;
	}

	:global(.overview-div iconify-icon) {
		@apply text-2xl;
	}
</style>
