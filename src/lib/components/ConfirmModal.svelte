<script lang="ts">
	import Modal from "./Modal.svelte";

    interface Props {
		show: boolean;
        id: string;
        description: string;
		onClickYes: () => void
	}

	let { show = $bindable(), id, description, onClickYes: onClickYesProp }: Props = $props();

    function onClickYes() {
        show = false;
        onClickYesProp();
    }
</script>

<Modal {id} title={"confirm"} bind:show={show} class="h-auto">
    <p>{description}</p>

    <hr class="mt-4">

    <div class="grid grid-cols-2 gap-1">
        <button class="button" onclick={() => show = false}>
            cancel
        </button>
        <button class="button" onclick={onClickYes}>
            yes
        </button>
    </div>
</Modal>