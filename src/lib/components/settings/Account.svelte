<script lang="ts">
    import { page } from '$app/stores';
    import { UserPermission } from '$lib/enums';

	import PasswordInput from '$lib/components/inputs/PasswordInput.svelte';
</script>

<div class="flex justify-between items-center">
    <table>
        <tbody>
            <tr>
                <td class="w-8 flex items-center">
                    <iconify-icon icon="mdi:hand-wave" class="text-xl"></iconify-icon>
                </td>
                <td>Hey there, <b class="font-semibold">{$page.data.user.username}</b></td>
            </tr>
            <tr>
                <td class="flex items-center">
                    <iconify-icon icon="teenyicons:id-solid" class="text-xl"></iconify-icon>
                </td>
                <td>Your ID is <b class="font-semibold">{$page.data.user.id}</b></td>
            </tr>
            {#if $page.data.permissions.includes(UserPermission.Administrator)}
                <tr>
                    <td class="flex items-center">
                        <iconify-icon icon="material-symbols:shield" class="text-xl"></iconify-icon>
                    </td>
                    <td>You're an <b class="font-semibold">administrator</b></td>
                </tr>
            {/if}
        </tbody>
    </table>

    <form method="POST" action="?/logout">
        <button class="button">Log out</button>
    </form>
</div>

<hr>

<div class="grid grid-cols-4 gap-2 items-end">
    <div class="input input-vertical col-span-3">
        <label for="username">Username</label>
        <input type="text" name="username">
    </div>

    <button class="button h-9">Save username</button>
</div>

<hr>

<div id="password" class="grid grid-cols-2 gap-x-4 gap-y-2 relative">
    <div class="input input-vertical w-full">
        <label for="password">Password</label>
        <PasswordInput placeholder="Enter password" />
    </div>
    
    <div class="input input-vertical">
        <label for="new-password">New password</label>
        <PasswordInput placeholder="Enter new password" />
    </div>

    <button class="button w-36">Save password</button>
</div>