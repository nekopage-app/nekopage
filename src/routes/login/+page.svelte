<script lang="ts">
	import { enhance } from '$app/forms';
	import { quadIn, quintOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import type { ActionData } from './$types';
	import PasswordInput from '$lib/components/PasswordInput.svelte';

	let { form }: { form: ActionData } = $props();

	let show = $state(false);
	let formElement = $state<HTMLFormElement>();

	$effect(() => {
		show = true;
		return;
	});

	function onKeyDown(event: KeyboardEvent) {
		if (event.key == "Enter") {
			show = false;
		}
	}
</script>

<svelte:head>
	<title>login — nekopage</title>
</svelte:head>

<div class="flex-container">
	{#if show}
		<form
			method="POST"
			role="presentation"
			onkeydown={onKeyDown}
			onoutroend={() => formElement?.submit()}
			bind:this={formElement}
			in:fly={{ duration: 1000, y: 100, easing: quintOut }}
			out:fly={{ duration: 500, y: -100, easing: quadIn }}
			use:enhance
			class="widget-inner gap-3 w-[28rem] !p-8"
		>
			<div id="title" class="flex justify-between items-center text-[2rem]">
				<h1 class="text-[2.5rem] font-black">Login</h1>
				<iconify-icon icon="mdi:cat"></iconify-icon>
			</div>

			<div class="input-vertical">
				<label for="username">Username</label>
				<input
					name="username"
					type="text"
					placeholder="Enter username"
					required
					value={form?.username ?? ''}
				/>
			</div>

			<div class="input-vertical">
				<label for="password">Password</label>
				<PasswordInput placeholder="Enter password" />
			</div>

			{#if form?.missing}
				<span class="error">Missing credentials!</span>
			{/if}
			{#if form?.incorrect}
				<span class="error">Incorrect!</span>
			{/if}

			<button
				type="button"
				onclick={() => (show = false)}
				class="button !bg-accent w-28 mt-4"
				>
				Login
			</button>
		</form>

		<footer in:fade out:fade class="absolute bottom-8">
			<a href="https://github.com/axolotlmaid/nekopage" class="text-overlay">nekopage</a>
		</footer>
	{/if}
</div>

<style lang="postcss">
	.error {
		@apply text-red font-medium;
	}
</style>
