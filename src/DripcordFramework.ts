import BotClient, { Config, SecretConfig } from "./BotClient.js";
import { CacheDriver } from "./drivers/cache/CacheDriver.js";
import { LocalCacheDriver } from "./drivers/cache/LocalDriver.js";
import createLoggerFromOptions, { LoggerOptions } from "./utils/LoggerFactory.js";

 export class DripcordFramework {
    private config: Config = {
        dev: {
            developers: []
        },
        eventsHandler: {
            dir: "./events",
            enabled: false
        },
        commandHandler: {
            dir: "./commands",
            enabled: false
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

    private devMode: boolean = process.argv.slice(2).includes("--dev")

    constructor(private secretConfig: SecretConfig) {
    }

    setLogger(options: LoggerOptions) {
        this.loggerOptions = options
        return this
    }

    setDevelopers(developers: string[]) {
        this.config.dev.developers = developers;
    }

    setEventsHandler(enabled: boolean, dir = "./events") {
        this.config.eventsHandler.enabled = enabled;
        this.config.eventsHandler.dir = dir;
        return this
    }
    setCommandHandler(enabled: boolean, dir = "./commands") {
        this.config.commandHandler.enabled = enabled;
        this.config.commandHandler.dir = dir
        return this
    }

    setCacheDriver(cache: CacheDriver) {
        this.cache = cache;
    }

    public build(): BotClient {
        const logger = createLoggerFromOptions(this.loggerOptions, this.devMode)
        logger.info("DripcordFramework has started!");
        return new BotClient(this.secretConfig, this.config, logger,this.cache, this.devMode)
    }
}

