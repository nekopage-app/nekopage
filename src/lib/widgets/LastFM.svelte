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

<Widget {loading} {data} {onRefresh} class="gap-2">
    <div class="flex gap-2">
        <div data-tooltip={album} class="h-16">
            <img id="album-cover" src={albumCover} alt="album cover" class="h-16 w-16 bg-base rounded-lg {data.settings.cd ? "animate-[spin_20s_linear_infinite] !rounded-full cd" : ""}">
        </div>
    
        <div>
            <p class="text-xl font-semibold">{name}</p>
            <p class="text-sm">{artist}</p>
        </div>
    
        <div id="ping" class="ping {playing ? "bg-green" : "bg-red"}"></div>
        
        {#if playing}
            <div id="ping-animation" class="ping animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite] bg-green"></div>
        {/if}
    </div>

    {#if data.settings.showScrobbles}
        <hr class="m-1">

        <div class="flex gap-2 w-min" data-tooltip="Scrobbles">
            <iconify-icon icon="iconamoon:music-1-fill" class="text-2xl"></iconify-icon>
            <span>{scrobbles}</span>
        </div>
    {/if}
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

    .ping {
        @apply w-3 h-3 aspect-square block rounded-full absolute right-2 top-2;
    }
</style>