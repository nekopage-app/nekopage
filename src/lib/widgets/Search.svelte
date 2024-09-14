<script lang="ts">
	let searchInputValue = $state('');

	function search() {
		// todo: add more seach engines
		window.location.href = `https://www.google.com/search?q=${searchInputValue}`;
	}

	function onKeyDown(event: KeyboardEvent) {
		if (event.key == 'Enter') {
			search();
		}
	}
</script>

<div id="search" class="widget">
	<h1>search</h1>

	<div
		class="widget-inner !flex-row justify-center items-center gap-2 transition-colors hover:bg-base"
	>
		<button onclick={search} class="ml-2 bg-transparent border-none outline-none cursor-pointer">
			<iconify-icon icon="fa:search" class="text-[2rem] text-text"></iconify-icon>
		</button>

		<input
			type="text"
			id="search-input"
			placeholder="Search here..."
			bind:value={searchInputValue}
			onkeydown={onKeyDown}
			class="w-full outline-none border-none bg-transparent text-2xl text-text p-4 pl-2 placeholder:text-overlay"
		/>
	</div>
</div>