<script lang="ts">
	import { onMount } from 'svelte';
	import Widget from '$lib/components/Widget.svelte';

	let { data }: { data: WidgetData } = $props();

	let loading = $state(true);

    let playing = $state(false);
    let scrobbles = $state(0);

    let name = $state("");
    let artist = $state("");
    let album = $state("");
	let albumCover = $state("");

	async function onRefresh() {
		const response = await fetch(`/api/widget/${data.id}/api`);
		const responseData = await response.json();

		if (Object.keys(responseData.api).length > 0) {
			playing = responseData.api.playing;
			scrobbles = responseData.api.scrobbles;

            name = responseData.api.name;
			artist = responseData.api.artist;
            album = responseData.api.album;
			albumCover = responseData.api.albumCover;

			loading = false;
		}
	}

	onMount(() => {
		onRefresh();
		const interval = setInterval(onRefresh, 1000 * 60 * 5); // Run every 5 minutes
		return clearInterval(interval);
	});
</script>

<Widget {loading} {data} {onRefresh} class="!flex-row gap-2">
    <div data-tooltip={album} class="h-16">
        <img id="album-cover" src={albumCover} alt="album cover" class="h-full max-w-fit rounded-lg {data.settings.cd ? "animate-[spin_20s_linear_infinite] !rounded-full cd" : ""}">
    </div>

    <div>
        <p class="text-lg font-semibold">{name}</p>
        <p class="text-sm">{artist}</p>
    </div>
</Widget>

<style lang="postcss">
    .cd {
        mask-image: radial-gradient(
            circle 10px at 32px 32px,
            transparent 8px,
            white 10px,
            black
        );
    }
</style>