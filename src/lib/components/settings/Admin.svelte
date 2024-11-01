<script lang="ts">
    import { onMount } from "svelte";

	import { page } from "$app/stores";
	import { UserPermission } from "$lib/enums";

    let users = $state([]);

    onMount(async () => {
        const response = await fetch("/api/admin/users");
        const data = await response.json();

        users = data.users;
    });
</script>

{#if $page.data.permissions.includes(UserPermission.Administrator)}
    <button class="button">Create User</button>

    <hr>

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

<style lang="postcss">
    th {
        @apply font-semibold text-left;
    }

    th, td {
        @apply p-1 px-2 border border-surface;
    }
</style>