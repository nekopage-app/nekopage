<script lang="ts">
	import { quadIn, quintOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	import Footer from '$lib/components/Footer.svelte';

	let { data }: { data: PageData } = $props();

	let show = $state(false);
	let formElement = $state<HTMLFormElement>();

	let layouts = $state(data.layouts);
	let chosenLayoutId = $state(-1);

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
		const response = await fetch("/api/layout/add", { method: "POST" });
		const data = await response.json();

		if (data.success) {
			console.log(data);

			layouts.push({
				name: data.name,
				id: data.id
			});
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

			<p class="mb-4">Welcome, {data.user.username}.</p>

			<div class="grid grid-cols-2 gap-2">
				{#each layouts as layout}
					<button
						onclick={() => onClick(layout.id)}
						class="bg-crust p-4 flex justify-center items-center h-16 text-xl font-medium border border-base rounded-lg shadow"
					>
						<h1>{layout.name}</h1>
					</button>
				{/each}
			</div>

			<button type="button" onclick={createLayout} class="button w-40 !bg-accent mt-2">Create Layout</button>
		</form>

		<Footer />
	{/if}
</div>
