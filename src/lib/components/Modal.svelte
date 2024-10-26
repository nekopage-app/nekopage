<script lang="ts">
	import type { Snippet } from "svelte";
	import { fade, fly } from "svelte/transition";

    interface Props {
		children: Snippet;
		show: boolean;
        id: string;
        title: string;
		class?: string;
	}

	let { children, show = $bindable(), id, title, class: clazz }: Props = $props();
</script>

{#if show}
    <div class="flex-container">
        <button
            id="blur-container"
            aria-hidden="true"
            onclick={() => show = false}
            in:fade
            out:fade
            class="flex-container backdrop-blur backdrop-brightness-75 cursor-auto !filter-none active:scale-100"
        ></button>

        <div id={id} in:fly={{ y: 10 }} out:fly={{ y: 10 }} class="widget z-30">
            <h1 class="!text-subtext">
                {title}
        
                <button onclick={() => show = false}>
                    <iconify-icon icon="mingcute:close-fill"></iconify-icon>
                    close
                </button>
            </h1>
        
            <div class="widget-inner !shadow-2xl w-96 h-96 overflow-auto {clazz}">
                {@render children()}
            </div>
        </div>
    </div>
{/if}