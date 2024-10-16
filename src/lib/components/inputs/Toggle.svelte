<script lang="ts">
    interface Props {
        name: string,
        checked: boolean,
        onInput?: () => void,
    }

    let { name, checked = $bindable(), onInput }: Props = $props();
</script>

<label class="inline-flex justify-center items-center cursor-pointer">
    <input type="checkbox" class="sr-only peer" {name} bind:checked={checked} oninput={onInput}>
    <div class="relative w-12 h-7 bg-base rounded-full border-2 border-surface duration-200 peer peer-focus:ring-[3px] peer-focus:ring-[color-mix(in_srgb,var(--accent)_30%,transparent)] peer-focus:border-accent peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-accent after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent peer-checked:after:bg-base"></div>
</label>