interface AdGuardHomeJSON {
	queries: number;
	blocked: number;
}

export default function (widget: WidgetData, responses: WidgetApiResponsesByName): AdGuardHomeJSON | undefined {
    return {
        queries: responses["stats"].data.num_dns_queries,
        blocked: responses["stats"].data.num_blocked_filtering
    }
}