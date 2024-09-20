<script lang="ts">
	import type { Component } from 'svelte';
	import { backIn, backOut, circOut } from 'svelte/easing';
	import { fade, fly, scale } from 'svelte/transition';

	import { showSettings, showSettingsButton } from '$lib/stores';

	// Tabs
	interface Tab {
		name: string,
		component: Component,
		icon: string
	}

	import Appearance from './Appearance.svelte';
	import Layout from './Layout.svelte';
	import Account from './Account.svelte';
	import Admin from './Admin.svelte';

	const tabs: Tab[] = [
		{
			name: 'appearance',
			component: Appearance,
			icon: 'dashicons:admin-appearance'
		},
		{
			name: 'layout',
			component: Layout,
			icon: 'mingcute:layout-fill'
		},
		{
			name: 'account',
			component: Account,
			icon: 'heroicons:user-solid'
		},
		{
			name: 'admin',
			component: Admin,
			icon: 'material-symbols:shield'
		}
	];

	let saved = $state(false);
	let transitioning = $state(false);
	let currentTab = $state(tabs[0]);

	function changeTab(tab: Tab) {
		currentTab = tab;
		transitioning = true;

		setTimeout(() => {
			transitioning = false;
		}, 450);
	}

	function save() {
		saved = true;
		
		setTimeout(() => {
			saved = false;
		}, 1000);
	}
</script>

{#if $showSettingsButton}
	<button
		id="settings-button"
		class="widget-inner !fixed top-4 right-4 text-[2rem] !p-1 z-10 hover:bg-base"
		onclick={() => (showSettings.set(true))}
		in:fade
		out:fade
	>
		<iconify-icon icon="material-symbols:settings"></iconify-icon>
	</button>
{/if}

{#if $showSettings}
	<div class="flex-container">
		<button
			id="blur-container"
			onclick={() => (showSettings.set(false))}
			in:fade
			out:fade
			class="flex-container backdrop-blur backdrop-brightness-75 z-10 cursor-auto !filter-none active:scale-100"
		></button>

		<div id="settings" class="widget z-10" in:scale={{ easing: circOut }} out:scale={{ easing: backIn }}>
			<h1 class="!text-subtext">
				settings

				<button onclick={() => (showSettings.set(false))}>
					<iconify-icon icon="mingcute:close-fill"></iconify-icon>
					close
				</button>
			</h1>

			<div class="widget-inner !shadow-2xl w-[60rem] h-[40rem] !grid grid-cols-4 !p-0">
				<div id="tabs-list" class="w-full h-full flex flex-col gap-1 bg-base p-2">
					{#each tabs as tab}
						<button
							onclick={() => changeTab(tab)}
							style:background-color={currentTab.name == tab.name ? 'var(--text)' : ''}
							style:color={currentTab.name == tab.name ? 'var(--base)' : ''}
							class="flex items-center gap-2 p-1.5 text-overlay rounded hover:text-subtext"
						>
							<iconify-icon icon={tab.icon} class="text-xl"></iconify-icon>
							{tab.name}
						</button>
					{/each}

					<button
						id="save-button"
						onclick={save}
						class="flex justify-center items-center gap-2 bg-text text-base p-2 rounded m-4 mt-auto"
					>
						<iconify-icon icon="ic:baseline-save" class="text-2xl"></iconify-icon>
						save
					</button>
				</div>

				<main class="col-span-3 p-4">
					{#if !transitioning}
						{@const Component = currentTab.component}

						<div in:fly={{ y: 10 }} out:fly={{ y: 10 }}>
							<h1 class="font-medium text-lg">{currentTab.name}</h1>
							<hr class="mt-0">
							<Component />
						</div>
					{/if}
				</main>
			</div>
		</div>

		{#if saved}
			<div id="save-message" in:fly={{ y: 20, easing: backOut }} out:fly={{ y: 20, easing: backIn }} class="widget-inner !fixed bottom-8 z-10 w-36 !flex-row justify-center gap-2 text-xl shadow-xl">
				<iconify-icon icon="ic:baseline-save" class="text-3xl"></iconify-icon>
				saved!
			</div>
		{/if}
	</div>
{/if}
