<script lang="ts">
    import "../app.css";
</script>

<div
    class="grid grid-cols-[20rem_auto_20rem] gap-8 bg-crust min-h-screen px-24 pb-8 text-text max-xl:grid-cols-2 max-2xl:px-8"
    style="
        --accent: #f5bde6;
        --light-accent: #f5bde626;
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
        @apply bg-mantle outline outline-2 outline-base rounded-md p-2;
    }
</style>