interface AdGuardHomeJSON {
	queries: number;
	blocked: number;
}

export default function (widget: WidgetData, response: WidgetAPIResponse): AdGuardHomeJSON | undefined {
    return {
        queries: response.data.num_dns_queries,
        blocked: response.data.num_blocked_filtering
    }
}