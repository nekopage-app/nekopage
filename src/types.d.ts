type Column = 'left' | 'middle' | 'right';

interface Layout {
    left: WidgetData[],
    middle: WidgetData[],
    right: WidgetData[],
    [key: string]: WidgetData[]
}

interface WidgetData {
    id: number,
    name: string,
    settings: WidgetSettings
}

interface WidgetSettings {
    title: string,
    [key: string]: any
}