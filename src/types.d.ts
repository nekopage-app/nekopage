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
	onClickSave: () => void
}