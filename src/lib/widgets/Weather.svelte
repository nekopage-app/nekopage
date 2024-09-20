<script lang="ts">
	import Widget from '$lib/components/Widget.svelte';

	import { apiResponses } from '$lib/stores';
	import weatherIcons from '$lib/data/weather_icons.json';

	let { data }: { data: WidgetData } = $props();
</script>

<Widget {data}>
	<div id="location" class="p-2 flex items-center gap-2">
		<iconify-icon icon="mingcute:location-fill" class="text-xl"></iconify-icon>
		<span>
            {$apiResponses[data.id]['location']['name']}, {$apiResponses[data.id]['location']['country']}
        </span>
	</div>

	<div id="icon" class="flex justify-center items-center mb-4">
		<div id="icon-text" class="flex flex-col w-40">
			<!-- todo: add option to use fahrenheit -->
			<span class="text-5xl font-bold">
                {Math.floor($apiResponses[data.id]['current']['temp_c'])}°C
            </span>
			<span class="font-semibold">{$apiResponses[data.id]['current']['condition']['text']}</span>
		</div>

		<iconify-icon
			icon={weatherIcons[$apiResponses[data.id]['current']['condition']['code'] as keyof typeof weatherIcons]}
			class="text-8xl"
		></iconify-icon>
	</div>

	<div id="overview" class="flex justify-evenly items-center mb-4">
		<div class="overview-div" data-tooltip={'Chance of rain'}>
			<iconify-icon icon="material-symbols:rainy"></iconify-icon>
			<span>
                {$apiResponses[data.id]['forecast']['forecastday'][0]['day']['daily_will_it_rain']}%
            </span>
		</div>

		<div class="overview-div" data-tooltip={'Wind'}>
			<iconify-icon icon="ph:wind-bold"></iconify-icon>
			<!-- todo: add option to use kph -->
			<span>{$apiResponses[data.id]['current']['wind_mph']} mph</span>
		</div>

		<div class="overview-div" data-tooltip={'Humidity'}>
			<iconify-icon icon="material-symbols:humidity-high"></iconify-icon>
			<span>{$apiResponses[data.id]['current']['humidity']}%</span>
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
