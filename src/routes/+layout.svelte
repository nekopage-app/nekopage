<script lang="ts">
    import "iconify-icon";
    import "../app.css";
</script>

<div
    id="theme"
    class="grid grid-cols-[20rem_auto_20rem] gap-8 bg-crust min-h-screen px-24 pb-8 text-text max-xl:grid-cols-2 max-2xl:px-8"
    style="
        --accent: #f5bde6;
        --light-accent: #f5bde626;
        --red: #e78284;
        --text: #c6d0f5;
        --subtext: #a5adce;
        --overlay: #737994;
        --surface: #414559;
        --base: #303446;
        --mantle: #292c3c;
        --crust: #232634;
    ">
    <slot />
</div>

<style lang="postcss">
    :global(.widget > h1) {
        @apply font-semibold text-overlay px-1 pb-[0.1rem];
    }

    :global(.widget-inner) {
        @apply relative flex flex-col bg-mantle outline outline-2 outline-base rounded-md p-2;
    }

    :global(.loading-container) {
        @apply absolute top-0 left-0 flex justify-center items-center w-full h-full z-10 rounded-md backdrop-blur text-6xl;
    }

    :global(button) {
        @apply font-medium;
    }

    :global(select),
	:global(input) {
		@apply bg-base text-text placeholder:text-overlay font-medium text-sm border-2 border-solid border-light-accent rounded-md !outline-none p-1.5;
	}

    :global(input:focus) {
        @apply border-accent;
    }

    :global(.input) {
        @apply flex justify-between items-center gap-1;
    }
</style>