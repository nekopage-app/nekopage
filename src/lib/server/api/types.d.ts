type WidgetAPIsList = Record<
	string,
	{
		interval: number;
		apis: Record<
			string,
			{
				url: string;
				headers: Record<string, string>;
				[key: string]: any;
			}
		>;
	}
>;