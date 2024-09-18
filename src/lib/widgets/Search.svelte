<script lang="ts">
	import Widget from "$lib/components/Widget.svelte";

	let { data }: { data: WidgetData } = $props();

	let searchInputValue = $state('');

	function search() {
		window.location.href = `${data.settings.url}${searchInputValue}`;
	}

	function onKeyDown(event: KeyboardEvent) {
		if (event.key == 'Enter') {
			search();
		}
	}
</script>

<Widget class="!flex-row justify-center items-center gap-2 transition-colors hover:bg-base" data={data}>
	<button onclick={search} class="ml-2 bg-transparent border-none outline-none cursor-pointer">
		<iconify-icon icon="fa:search" class="text-[2rem] text-text"></iconify-icon>
	</button>

	<input
		type="text"
		id="search-input"
		placeholder="Search here..."
		bind:value={searchInputValue}
		onkeydown={onKeyDown}
		class="w-full outline-none border-none bg-transparent font-medium text-2xl text-text p-4 pl-2 placeholder:text-overlay"
	/>
</Widget>