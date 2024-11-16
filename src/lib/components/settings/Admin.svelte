<script lang="ts">
	import { onMount } from 'svelte';

	import { page } from '$app/stores';
	import { UserPermission } from '$lib/enums';
    import { errorMessage, showErrorMessage } from '$lib/stores';

	import Modal from '../Modal.svelte';
	import PasswordInput from '../inputs/PasswordInput.svelte';

	let users = $state([]);

	onMount(async () => {
		const response = await fetch('/api/admin/users');
		const data = await response.json();

		users = data.users;
	});

	let showCreateUserModal = $state(false);

    let createUserUsername = $state("");
    let createUserPassword = $state("");

	async function createUser() {
		showCreateUserModal = false;

        const response = await fetch("/api/admin/users", { method: "POST", body: JSON.stringify({ username: createUserUsername, password: createUserPassword }) });
        const data = await response.json();

        if (!data.success) {
            showErrorMessage.set(true);
            errorMessage.set(data.error);
        }
	}
</script>

{#if $page.data.permissions.includes(UserPermission.Administrator)}
	<button class="button" onclick={() => (showCreateUserModal = true)}>Create User</button>

	<hr />

	<table class="w-full">
		<thead class="bg-base">
			<tr>
				<th>ID</th>
				<th>Username</th>
				<th class="w-40">Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each users as { id, username }}
				<tr>
					<td>{id}</td>
					<td>{username}</td>
					<td>
						<button class="button">Edit</button>
						<button class="button !bg-red">Delete</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{:else}
	<!-- This shouldn't happen but we shouldn't risk it either -->
	<div class="flex-container flex-col backdrop-blur backdrop-brightness-75">
		<iconify-icon icon="ion:warning" class="text-6xl"></iconify-icon>
		<p class="text-2xl">You're not an administrator!</p>

		<p class="absolute bottom-8 text-overlay">refresh to exit screen</p>
	</div>
{/if}

<Modal
	id="create-user-modal"
	title="create user"
	bind:show={showCreateUserModal}
	class="gap-2 !h-60"
>
	<div class="input input-vertical">
		<label for="username">Username</label>
		<input name="username" type="text" placeholder="Enter username" bind:value={createUserUsername} />
	</div>

	<div class="input input-vertical">
		<label for="password">Password</label>
		<PasswordInput placeholder="Enter password" bind:value={createUserPassword} />
	</div>

	<hr />

	<div class="grid grid-cols-2 gap-2 mt-auto">
		<button class="button" onclick={() => (showCreateUserModal = false)}>Cancel</button>
		<button class="button !bg-accent" onclick={createUser}>Create</button>
	</div>
</Modal>

<style lang="postcss">
	th {
		@apply font-semibold text-left;
	}

	th,
	td {
		@apply p-1 px-2 border border-surface;
	}
</style>
