<script lang="ts">
	import { widgetEditorData } from '$lib/stores';
	import { onMount } from 'svelte';

	import Modal from '$lib/components/Modal.svelte';
	import Loading from '$lib/components/Loading.svelte';

	let { onInput }: { onInput: () => void } = $props();

    let loading = $state(false);
	let files: FileList | undefined = $state();

	let draggingOver = $state(false);
	let dropped = $state(false);
    let selectedFileName = $state("");

	let uploads: string[] = $state([]);
	let viewingUploads = $state(false);

	function onDrop() {
		draggingOver = false;
		dropped = true;
	}

    function onChange() {
        if (files) {
            dropped = true;
            selectedFileName = files![0].name;

			onInput();
        }
    }

    function selectImage(fileName: string) {
        $widgetEditorData.settings.image = `/uploads/${fileName}.webp`;
        selectedFileName = `${fileName}.webp`;
        viewingUploads = false;
        dropped = true;

		onInput();
    }

	async function upload() {
		if (files) {
			const formData = new FormData();
			formData.append('file', files[0]);

            loading = true;

			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});
			const data = await response.json();

			$widgetEditorData.settings.image = `/uploads/${data.file}.webp`;
			uploads.push(data.file);

            selectedFileName = "";
            loading = false;
			dropped = false;
            files = undefined;
		}
	}

	onMount(async () => {
		const response = await fetch('/api/uploads');
		const data = await response.json();

		if (data.uploads) uploads = data.uploads;
		return;
	});
</script>

<div
	class="flex justify-center items-center flex-col relative border-2 border-surface transition duration-300 p-4 rounded-md bg-base
        {draggingOver ? 'shadow-[0px_0px_20px_-5px] shadow-accent !border-accent' : ''} {dropped
		? '!border-accent'
		: ''}"
>
    <Loading {loading} />

	<input
		type="file"
		name="file-input"
		class="absolute w-full h-full opacity-0"
		bind:files
		ondragenter={() => (draggingOver = true)}
		ondragleave={() => (draggingOver = false)}
		ondrop={onDrop}
		onchange={onChange}
	/>

	<iconify-icon
		icon="material-symbols:upload"
		class="text-5xl {draggingOver ? 'animate-pulse' : ''}"
	></iconify-icon>

	{#if dropped}
		<span class="text-xl font-semibold">{selectedFileName}</span>
		<span>file selected!</span>
	{:else}
		<span class="text-xl font-semibold">{draggingOver ? 'drop it!' : 'upload'}</span>
		<span>drag or select a file</span>
	{/if}
</div>

<div class="grid grid-cols-2 gap-1 mt-1">
	<button class="button" onclick={() => (viewingUploads = true)}>view uploads</button>
	<button class="button" onclick={upload}>upload</button>
</div>

<Modal id="view-uploads" title="view uploads" bind:show={viewingUploads} class="!grid grid-cols-3 grid-rows-3 gap-1">
	{#each uploads as fileName}
		<button onclick={() => selectImage(fileName)} class="aspect-square brightness-50 hover:brightness-100">
			<img
				src="/uploads/{fileName}.webp"
				alt={fileName}
				class="w-full h-full object-cover rounded"
			/>
		</button>
	{/each}
</Modal>
