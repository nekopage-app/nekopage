export default function(widget: WidgetData, input: string): string {
    return input.replace(/\{\{\s*([^{}\s]+(?:\.[^{}\s]+)*)\s*\}\}/g, (_, keyPath) => {
        const keys = keyPath.split(".");
        let value = widget;

        for (const key of keys) {
            if (value && key in value) {
                value = value[key];
            } else {
                return `{{ ${keyPath} }}`;
            }
        }

        return String(value);
    });
}