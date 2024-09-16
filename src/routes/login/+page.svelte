<script lang="ts">
	import { enhance } from '$app/forms';
	import { quadIn, quintOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let show = $state(false);
	let formElement = $state<HTMLFormElement>();

	$effect(() => {
		show = true;
		return;
	});

	// Password visibility
	let passwordInput = $state<HTMLInputElement>();
	let eyeIcon = $state("mdi:eye-off");

	function togglePasswordVisibility() {
		if (passwordInput?.type == "password") {
			passwordInput.type = "text";
			eyeIcon = "mdi:eye";
		} else {
			passwordInput!.type = "password";
			eyeIcon = "mdi:eye-off";
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
			class="widget-inner gap-3 w-[28rem] !p-8"
			bind:this={formElement}
			onoutroend={() => formElement?.submit()}
			in:fly={{ duration: 1000, y: 100, easing: quintOut }}
			out:fly={{ duration: 500, y: -100, easing: quadIn }}
			use:enhance
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
				<div class="relative flex items-center bg-base border-2 border-solid border-surface rounded-md transition duration-300 focus-within:border-accent focus-within:ring-[3px] focus-within:ring-light-accent">
					<input name="password" type="password" placeholder="Enter password" required bind:this={passwordInput} class="w-full bg-transparent text-text placeholder:text-overlay font-medium text-[0.938rem] p-1.5 !outline-none" />
					<button type="button" class="flex" onclick={togglePasswordVisibility}>
						<iconify-icon icon={eyeIcon} class="text-xl text-overlay mr-1.5"></iconify-icon>
					</button>
				</div>
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
