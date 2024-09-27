<script lang="ts">
	import 'iconify-icon';
	import '../app.css';
</script>

<div
	id="theme"
	class="grid grid-cols-[20rem_auto_20rem] gap-8 bg-crust min-h-screen px-24 pt-4 pb-8 text-text max-xl:grid-cols-2 max-2xl:px-8"
	style="
        --accent: #f5bde6;
        --light-accent: #f5bde633;
        --red: #e78284;
        --text: #c6d0f5;
        --subtext: #a5adce;
        --overlay: #737994;
        --surface: #414559;
        --base: #303446;
        --mantle: #292c3c;
        --crust: #232634;
    "
>
	<slot />
</div>

<style lang="postcss">
	:global(.widget) {
		@apply select-none;
	}

	:global(.widget > h1) {
		@apply font-semibold text-overlay p-1 flex justify-between;
	}

	:global(.widget > h1 *) {
		@apply flex justify-center items-center gap-1;
	}

	:global(.widget-inner) {
		@apply relative flex flex-col bg-mantle outline outline-2 outline-base rounded-md p-2 shadow-md;
	}

	:global(.flex-container) {
		@apply flex justify-center items-center fixed w-full h-full top-0 left-0 z-10;
	}

	:global(hr) {
		@apply my-3 border-surface;
	}

	:global(button) {
		@apply font-medium transition duration-[250ms] hover:brightness-90 active:scale-90;
	}

	:global(.input > select),
	:global(.input > input),
	:global(.input-vertical > select),
	:global(.input-vertical > input) {
		@apply bg-base text-text placeholder:text-overlay font-medium text-[0.938rem] border-2 border-solid border-surface rounded-md !outline-none p-1.5 transition duration-300 focus:border-accent focus:ring-[3px] focus:ring-light-accent;
	}

	:global(.input) {
		@apply flex justify-between items-center gap-1;
	}

	:global(.input-vertical) {
		@apply flex flex-col gap-1;
	}

	:global(.button) {
		@apply bg-text text-mantle px-3 py-1.5 rounded;
	}
</style>
