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
	[key: string]: any;
}

interface WidgetEditorComponentProps {
	onClickSave: () => void;
}

type WidgetsJSON = Record<
	string,
	{
		name: string;
		apis: {
			interval: number;
			list: Record<
				string,
				{
					url: string;
					headers?: Record<string, string>;
					cookies?: Record<string, string>;
					[key: string]: any;
				}
			>;
		} | any;
		settings: WidgetSettings;
	}
>;
