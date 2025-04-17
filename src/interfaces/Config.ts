export interface SecretConfig {
    TOKEN: string
    CLIENT_ID: string
    CLIENT_SECRET?: string
    PUBLIC_KEY?: string
    REDIRECT_URI?: string
    dev?: {
        TOKEN: string,
        CLIENT_ID: string,
        GUILD_ID: string
        CLIENT_SECRET?: string
        PUBLIC_KEY?: string
        REDIRECT_URI?: string
    }
}
export interface Config  {
    dev: {
        developers: string[]
    }
    eventsDir: string
    commandsDir: string
    pluginsDir: string
}