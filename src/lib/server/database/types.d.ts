interface DatabaseUser {
	id: number;
	username: string;
	password: string;
	session_id: string;
	session_created: string;
}

interface DatabaseLayout {
	id: number;
	name: string;
	user_id: number;
	left: number[];
	middle: number[];
	right: number[];
	[key: string]: number[];
}

interface DatabaseGetLayout {
	name: string;
	id: number;
}

interface DatabaseWidgetData {
	id: number;
	layout_id: number;
	type: string;
	settings: string;
}

interface DatabaseSetting {
	user_id: number;
	setting_key: string;
	setting_value: string;
}
