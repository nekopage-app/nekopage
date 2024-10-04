interface DatabaseUser {
    id: number,
    username: string,
    password: string,
    session_id: string,
    session_created: string
}

interface DatabaseLayout {
    id: number,
    name: string,
    user_id: number,
    left: number[],
    middle: number[],
    right: number[],
    [key: string]: number[]
}

interface DatabaseGetLayout {
    name: string,
    id: number
}

interface DatabaseWidgetBase {
    id: number,
    user_id: number,
    name: string,
}

interface DatabaseWidgetSettingsString extends DatabaseWidgetBase {
    settings: string
}

interface DatabaseWidgetSettings extends DatabaseWidgetBase {
    settings: WidgetSettings
}