<script lang="ts">
	import { quadIn, quintOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import { errorMessage, showErrorMessage } from '$lib/stores';

	import Footer from '$lib/components/Footer.svelte';
	import Modal from '$lib/components/Modal.svelte';

	let { data }: { data: PageData } = $props();

	let show = $state(false);
	let formElement = $state<HTMLFormElement>();

	let layouts = $state(data.layouts);
	let chosenLayoutId = $state(-1);
	let chosenLayoutName = $state('');

	let showRenameModal = $state(false);
	let newLayoutName = $state('');

	$effect(() => {
		show = true;
		return;
	});

	function onFormData(event: FormDataEvent) {
		const formData = event.formData;
		formData.append('id', chosenLayoutId.toString());
	}

	function onClick(layoutId: number) {
		show = false;
		chosenLayoutId = layoutId;
	}

	async function createLayout() {
		const response = await fetch('/api/layout/add', { method: 'POST' });
		const data = await response.json();

		if (data.success) {
			layouts.push({
				name: data.name,
				id: data.id
			});
		}
	}

	function onClickRename(layoutId: number, layoutName: string) {
		showRenameModal = true;
		chosenLayoutId = layoutId;
		chosenLayoutName = layoutName;
	}

	async function renameLayout() {
		const response = await fetch(`/api/layout/${chosenLayoutId}/rename?name=${newLayoutName}`, {
			method: 'PATCH'
		});
		const data = await response.json();

		if (data.success) {
			showRenameModal = false;
			const layout = layouts.find((l) => l.id === chosenLayoutId);

			if (!layout) {
				showErrorMessage.set(true);
				errorMessage.set('Could not find layout when renaming');
			} else {
				layout.name = newLayoutName;
			}
		} else {
			showErrorMessage.set(true);
			errorMessage.set('Something went wrong');
		}
	}
</script>

<svelte:head>
	<title>choose layout — nekopage</title>
</svelte:head>

<div class="flex-container">
	{#if show}
		<form
			method="POST"
			role="presentation"
			onformdata={onFormData}
			onoutroend={() => formElement?.submit()}
			bind:this={formElement}
			in:fly={{ duration: 1000, y: 100, easing: quintOut }}
			out:fly={{ duration: 500, y: -100, easing: quadIn }}
			use:enhance
			class="widget-inner w-[28rem] !p-8"
		>
			<div id="title" class="flex justify-between items-center text-[2rem]">
				<h1 class="text-[2.5rem] font-black">Choose layout</h1>
				<iconify-icon icon="mdi:cat"></iconify-icon>
			</div>

			<p>Welcome, {data.user.username}.</p>

			<hr />

			<div class="grid grid-cols-2 gap-2">
				{#each layouts as layout}
					<div class="relative h-16 group">
						<button
							onclick={() => onClick(layout.id)}
							class="bg-crust p-4 flex justify-center items-center text-xl font-medium border border-base rounded-lg shadow w-full"
						>
							<h1>{layout.name}</h1>
						</button>

						<button
							type="button"
							aria-label="Rename Layout"
							onclick={() => onClickRename(layout.id, layout.name)}
							class="absolute top-2 right-2 flex opacity-0 group-hover:opacity-100"
						>
							<iconify-icon icon="material-symbols:edit" class="text-xl"></iconify-icon>
						</button>
					</div>
				{/each}
			</div>

			<button type="button" onclick={createLayout} class="button w-40 !bg-accent mt-2">
				Create Layout
			</button>
		</form>

		<Footer />
	{/if}
</div>

<Modal id="rename-layout-modal" title="rename layout" bind:show={showRenameModal} class="!h-56">
	<div class="input input-vertical mb-2">
		<label for="username">Old layout name</label>
		<input name="new-layout-name" type="text" bind:value={chosenLayoutName} disabled />
	</div>

	<div class="input input-vertical">
		<label for="new-layout-name">New layout name</label>
		<input
			name="new-layout-name"
			type="text"
			placeholder="Enter new layout name"
			bind:value={newLayoutName}
		/>
	</div>

	<hr />

	<div class="grid grid-cols-2 gap-2 mt-auto">
		<button class="button" onclick={() => (showRenameModal = false)}>Cancel</button>
		<button class="button !bg-accent" onclick={renameLayout}>Rename</button>
	</div>
</Modal>
