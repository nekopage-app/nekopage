interface WidgetApiResponse {
    cookies: object;
    data: any;
}

type WidgetApiResponsesByName = Record<string, WidgetApiResponse>;