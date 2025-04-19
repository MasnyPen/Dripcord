import BotClient from "./BotClient.js";
import { CacheDriver } from "./drivers/cache/CacheDriver.js";
import { LocalCacheDriver } from "./drivers/cache/LocalDriver.js";
import { DatabaseDriver } from "./drivers/database/DatabaseDriver.js";
import { SQLiteDatabaseDriver } from "./drivers/database/SqliteDriver.js";
import createLoggerFromOptions, { LoggerOptions } from "./utils/LoggerFactory.js";
import 'dotenv/config'
import { Bot } from "./interfaces/Bot.js";
import { Config, SecretConfig } from  './interfaces/Config.js'

export class DripcordFramework {
    private config: Config = {
        dev: {
            developers: []
        },
        eventsDir: "./events",
        commandsDir: "./commands",
        pluginsDir: "./plugins",
        i18n: {
            default: "en",
            locales: ["en"]
        }
    }

    private secretConfig: SecretConfig = {
        TOKEN: process.env.TOKEN || "",
        CLIENT_ID: process.env.CLIENT_ID || "",
        CLIENT_SECRET: process.env.CLIENT_SECRET,
        PUBLIC_KEY: process.env.PUBLIC_KEY,
        REDIRECT_URI: process.env.REDIRECT_URI,
        dev: {
            TOKEN: process.env.DEV_TOKEN || "",
            CLIENT_ID: process.env.DEV_CLIENT_ID || "",
            GUILD_ID: process.env.DEV_GUILD_ID || "",
            CLIENT_SECRET: process.env.DEV_CLIENT_SECRET,
            PUBLIC_KEY: process.env.DEV_PUBLIC_KEY,
            REDIRECT_URI: process.env.DEV_REDIRECT_URI,
        }

    }

    private loggerOptions: LoggerOptions = {
        enabled: true,
        level: "info",
        console: true,
        file: true,
        filePath: "./logs",
        dateRotate: true,
        maxFiles: "14d"
    }

    private cache: CacheDriver = new LocalCacheDriver();
    private database: DatabaseDriver = new SQLiteDatabaseDriver();

    private devMode: boolean = process.argv.slice(2).includes("--dev")


    setLogger(options: LoggerOptions) {
        this.loggerOptions = options
        return this
    }

    setDevelopers(developers: string[]) {
        this.config.dev.developers = developers;
    }

    setEventsDir(dir: string) {
        this.config.eventsDir = dir;
        return this;
    }
    setCommandsDir(dir: string) {
        this.config.commandsDir = dir;
        return this;
    }
    setPluginsDir(dir: string) {
        this.config.pluginsDir = dir;
        return this;
    }

    setCacheDriver(cache: CacheDriver) {
        this.cache = cache;
        return this;
    }
    setDatabaseDriver(database: DatabaseDriver) {
        this.database = database;
        return this;
    }

    setI18n(defaultLanguage: string = "en", locales: string[] = ["en"]) {
        this.config.i18n.default = defaultLanguage;
        this.config.i18n.locales = locales;
    }

    public build(): Bot {

        if (this.secretConfig.TOKEN === "" || this.secretConfig.CLIENT_ID == "") {
            throw new Error("TOKEN or CLIENT is invalid or missing.")
        }

        const logger = createLoggerFromOptions(this.loggerOptions, this.devMode)
        logger.info("DripcordFramework has started!");
        return new BotClient(this.secretConfig, this.config, logger, this.cache, this.database, this.devMode)
    }
}

