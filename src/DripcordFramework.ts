import BotClient, { Config, SecretConfig } from "./BotClient.js";
import createLoggerFromOptions, { LoggerOptions } from "./utils/LoggerFactory.js";

 export class DripcordFramework {
    private config: Config = {

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
     static default: any;

    constructor(private secretConfig: SecretConfig) {
        console.info("DripcordFramework has started!");
    }

    setLogger(options: LoggerOptions) {
        this.loggerOptions = options
        return this
    }


    public build(): BotClient {
        const logger = createLoggerFromOptions(this.loggerOptions)
        return new BotClient(this.secretConfig, this.config, logger)
    }
}

