interface DatabaseUser {
    id: number,
    username: string,
    password: string,
    session_id: string,
    session_created: string
}

interface DatabaseLayout {
    user_id: number,
    left: number[],
    middle: number[],
    right: number[]
}

interface DatabaseWidget {
    id: number,
    user_id: number,
    column: string,
    name: string,
    settings: string | WidgetSettings
}