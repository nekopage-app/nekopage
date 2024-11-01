import { writable } from 'svelte/store';

export const layout = writable<Layout>({} as Layout);

export const showSaveMessage = writable(false);

export const showErrorMessage = writable(false);
export const errorMessage = writable("");

export const showSettings = writable(false);
export const showSettingsButton = writable(false);

export const inLayoutEditor = writable(false);

export const inWidgetEditor = writable(false);
export const widgetEditorData = writable({} as WidgetData);