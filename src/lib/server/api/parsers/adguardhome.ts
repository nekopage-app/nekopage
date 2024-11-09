import { getResponse } from '..';

interface AdGuardHomeJSON {
	queries: number;
	blocked: number;
}

export default function (widget: WidgetData): AdGuardHomeJSON | undefined {
	const response = getResponse(widget);
	if (response === undefined) return;

    return {
        queries: response.num_dns_queries,
        blocked: response.num_blocked_filtering
    }
}