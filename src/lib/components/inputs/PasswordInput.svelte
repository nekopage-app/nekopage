<script lang="ts">
	interface Props {
		placeholder: string,
		value?: string,
		onInput?: () => void
	}

	let { placeholder, value = $bindable(), onInput }: Props = $props();

	let passwordInput = $state<HTMLInputElement>();
	let eyeIcon = $state('mdi:eye-off');

	function togglePasswordVisibility() {
		if (passwordInput?.type == 'password') {
			passwordInput.type = 'text';
			eyeIcon = 'mdi:eye';
		} else {
			passwordInput!.type = 'password';
			eyeIcon = 'mdi:eye-off';
		}
	}
</script>

<div
	class="h-9 relative flex items-center bg-base border-2 border-solid border-surface rounded-md transition duration-300 focus-within:border-accent focus-within:ring-[3px] ring-[color-mix(in_srgb,var(--accent)_30%,transparent)]"
>
	<input
		name="password"
		type="password"
		{placeholder}
		required
		bind:this={passwordInput}
		bind:value={value}
		oninput={onInput}
		class="w-full bg-transparent text-text placeholder:text-overlay font-medium text-[0.938rem] p-1.5 !outline-none"
	/>
	<button type="button" aria-label="Toggle Password Visibility" class="flex" onclick={togglePasswordVisibility}>
		<iconify-icon icon={eyeIcon} class="text-xl text-overlay mr-1.5"></iconify-icon>
	</button>
</div>
