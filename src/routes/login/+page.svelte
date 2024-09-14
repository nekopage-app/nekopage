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
</script>

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

		<div class="input">
			<label for="username">Username</label>
			<input
				name="username"
				type="text"
				placeholder="Enter username"
				required
				value={form?.username ?? ''}
			/>
		</div>

		<div class="input">
			<label for="password">Password</label>
			<input name="password" type="password" placeholder="Enter password" required />
		</div>

		{#if form?.missing}
			<span class="error">Missing credentials!</span>
		{/if}
		{#if form?.incorrect}
			<span class="error">Incorrect!</span>
		{/if}

		<button type="button" onclick={() => (show = false)} class="bg-accent text-crust border-none outline-none rounded-sm w-28 h-8 mt-4 cursor-pointer transition-transform hover:scale-105 active:scale-90">Login</button>
	</form>

    <footer in:fade out:fade class="absolute bottom-8">
        <a href="https://github.com/axolotlmaid/nekopage" class="text-overlay">nekopage</a>
    </footer>
{/if}

<style lang="postcss">
    :global(#theme) {
        @apply flex justify-center items-center;
    }

    input {
        @apply w-full;
    }

    .input {
        @apply flex-col items-start;
    }

    .error {
        @apply text-red font-medium;
    }
</style>