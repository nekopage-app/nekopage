import { responses } from '..';

import template from '$lib/utils/handlebars';
import widgetAPIsJSON from '$lib/data/widget_apis.json';
const widgetAPIs: WidgetAPIsList = widgetAPIsJSON;

export default function (widget: WidgetData): AdGuardHomeJSON {
	const response = responses[template(widget, widgetAPIs[widget.type][widget.settings.api].url)];

    return {
        queries: response.num_dns_queries,
        blocked: response.num_blocked_filtering
    }
}