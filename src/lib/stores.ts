import { writable } from 'svelte/store';

export const layout = writable<Layout>({} as Layout);

export const showSaveMessage = writable(false);

export const showSettings = writable(false);
export const showSettingsButton = writable(false);

export const inLayoutEditor = writable(false);
export const inWidgetEditor = writable(false);