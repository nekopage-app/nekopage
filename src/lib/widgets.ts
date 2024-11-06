import type { Component } from 'svelte';

import AdGuardHome from './widgets/AdGuardHome.svelte';
import Astronomy from '$lib/widgets/Astronomy.svelte';
import Bookmarks from '$lib/widgets/Bookmarks.svelte';
import Calendar from '$lib/widgets/Calendar.svelte';
import Picture from '$lib/widgets/Picture.svelte';
import RSS from '$lib/widgets/RSS.svelte';
import Search from '$lib/widgets/Search.svelte';
import Text from '$lib/widgets/Text.svelte';
import Weather from '$lib/widgets/Weather.svelte';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const widgets: Record<string, Component<{ data: WidgetData | any }>> = {
	AdGuardHome,
	Astronomy,
	Bookmarks,
	Calendar,
	Picture,
	RSS,
	Search,
	Text,
	Weather
};
