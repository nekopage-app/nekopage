<script lang="ts">
	import type { Snippet } from "svelte";

    interface Props {
        children: Snippet,
        id: string,
        class?: string,
        loading?: boolean,
        settings: WidgetSettings,
    }

    let { children, id, class: clazz, loading, settings }: Props = $props();
</script>

<div id={id} class="widget">
	<h1>{settings.title}</h1>

	<div class="widget-inner {clazz}">
        {#if loading}
			<div class="loading-container">
				<iconify-icon icon="line-md:loading-loop"></iconify-icon>
			</div>
		{/if}

		{@render children()}
	</div>
</div>