<script lang="ts">
    import Widget from "$lib/components/Widget.svelte";

    interface BookmarkWidgetData extends WidgetData {
        settings: BookmarkSettings
    }

    interface BookmarkSettings extends WidgetSettings {
        columns: number,
        icons: boolean,
        type: "grid" | "columns",
        bookmarks: Record<string, Record<string, Bookmark>>
    }

    interface Bookmark {
        url: string,
        icon: string
    }

    let { data }: { data: BookmarkWidgetData } = $props();
</script>

<Widget {data}>
    {#if data.settings.type == "columns"}
        <div style="grid-template-columns: repeat({data.settings.columns}, 1fr);" class="grid gap-2">
            {#each Object.entries(data.settings.bookmarks) as [category, bookmarks]}
                <div id={category} class="flex flex-col bg-crust rounded p-2">
                    <h1 class="bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] p-1 font-semibold flex justify-center rounded text-accent">{category}</h1>

                    {#each Object.entries(bookmarks) as [bookmark, bookmarkData]}
                        <a href={bookmarkData.url} id={bookmark} class="flex items-center gap-1.5 p-1 transition hover:brightness-75">
                            {#if data.settings.icons}
                                <iconify-icon icon={bookmarkData.icon} class="text-xl"></iconify-icon>
                            {/if}
                            <span>{bookmark}</span>
                        </a>
                    {/each}
                </div>
            {/each}
        </div>
    {:else}
        <div class="flex flex-col gap-2">
            {#each Object.entries(data.settings.bookmarks) as [category, bookmarks]}
                <div id={category} class="flex flex-col gap-2">
                    <h1 class="bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] p-1 font-semibold flex justify-center rounded text-accent w-max px-2">{category}</h1>

                    <div class="grid grid-cols-8 gap-1.5">
                        {#each Object.entries(bookmarks) as [bookmark, bookmarkData]}
                            <a href={bookmarkData.url} id={bookmark} class="flex flex-col justify-center items-center gap-1.5 bg-crust aspect-square rounded-xl transition hover:brightness-75">
                                {#if data.settings.icons}
                                    <iconify-icon icon={bookmarkData.icon} class="text-6xl"></iconify-icon>
                                {/if}
                                <span class="text-center">{bookmark}</span>
                            </a>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</Widget>