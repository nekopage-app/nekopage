interface Layout {
	left: WidgetData[];
	middle: WidgetData[];
	right: WidgetData[];
}

interface WidgetData {
	id: number;
	type: string;
	settings: WidgetSettings;
}

interface WidgetSettings {
	title: string;
	apis?: string[];
	[key: string]: any;
}

interface WidgetEditorComponentProps {
	onClickSave: () => void;
}

interface ApiListItem {
	url: string;
	method?: string;
	headers?: Record<string, string>;
	cookies?: Record<string, string>;
	body?: Record<string, any> | string;
	[key: string]: any;
}

type WidgetsJSON = Record<
	string,
	{
		name: string;
		apis: {
			interval?: number;
			list?: Record<string, ApiListItem>;
		};
		settings: WidgetSettings;
	}
>;
