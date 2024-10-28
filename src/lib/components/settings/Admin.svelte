<script lang="ts">
	import { page } from "$app/stores";
	import { UserPermission } from "$lib/enums";


</script>

{#if $page.data.permissions.includes(UserPermission.Administrator)}
    <p>Hello!</p>
{:else}
    <!-- This shouldn't happen but we shouldn't risk it either -->
    <div class="flex-container flex-col backdrop-blur backdrop-brightness-75">
        <iconify-icon icon="ion:warning" class="text-6xl"></iconify-icon>
        <p class="text-2xl">You're not an administrator!</p>

        <p class="absolute bottom-8 text-overlay">refresh to exit screen</p>
    </div>
{/if}