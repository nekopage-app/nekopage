<script lang="ts">
    import { page } from '$app/stores';
	import PasswordInput from '$lib/components/inputs/PasswordInput.svelte';
</script>

<div class="flex justify-between items-center">
    <p>Hey there, {$page.data.user.username}</p>
    
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

    <button class="button h-9 mb-[1px]">Save username</button>
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