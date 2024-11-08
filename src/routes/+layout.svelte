<script lang="ts">
	import 'iconify-icon';
	import '../app.css';
</script>

<div
	id="theme"
	class="grid grid-cols-[20rem_auto_20rem] gap-4 bg-crust min-h-screen px-24 pt-2 pb-8 text-text max-xl:grid-cols-2 max-2xl:px-8"
	style="
        --accent: #f5bde6;
        --red: #e78284;
		--green: #a6d189;
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
		@apply flex justify-center items-center fixed w-full h-full top-0 left-0 z-30;
	}

	:global(hr) {
		@apply my-3 border-surface;
	}

	:global(button) {
		@apply font-medium transition duration-[250ms] hover:brightness-75 active:scale-90;
	}

	:global(.input > textarea),
	:global(.input > select),
	:global(.input > input) {
		@apply bg-base text-text placeholder:text-overlay h-9 font-medium text-[0.938rem] border-2 border-solid border-surface rounded-md flex-grow !outline-none p-1.5 transition duration-300 focus:border-accent focus:ring-[3px] ring-[color-mix(in_srgb,var(--accent)_30%,transparent)];
	}

	:global(.input) {
		@apply flex justify-between items-center gap-1;
	}

	:global(.input-vertical) {
		@apply flex flex-col items-stretch gap-1;
	}

	:global(.input-helper-parent) {
		@apply grid grid-cols-2;
	}

	:global(.input-helper label) {
		@apply font-medium;
	}

	:global(.input-helper p) {
		@apply text-[0.8rem] text-overlay;
	}

	:global(.button) {
		@apply bg-text text-mantle px-3 py-1.5 rounded;
	}

	:global([data-tooltip]) {
		@apply relative;
	}

	:global([data-tooltip]:before),
	:global([data-tooltip]:after) {
		@apply opacity-0 pointer-events-none -translate-x-1/2 translate-y-1 transition-all ease-out;
	}

	:global([data-tooltip]:before) {
		@apply absolute top-[125%] left-1/2 px-2 py-1.5 rounded bg-subtext text-crust shadow-lg text-center text-sm font-normal whitespace-nowrap z-50;
		content: attr(data-tooltip);
	}

	:global([data-tooltip]:after) {
		@apply absolute left-1/2 -bottom-1/4 w-0 text-[0] border-b-4 border-b-subtext border-x-4 border-x-transparent;
		content: '';
	}

	:global([data-tooltip]:hover:before),
	:global([data-tooltip]:hover:after) {
		@apply opacity-100 -translate-x-1/2 translate-y-0;
	}
</style>
