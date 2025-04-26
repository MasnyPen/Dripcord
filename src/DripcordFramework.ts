import BotClient from "./BotClient.js";
import createLoggerFromOptions, { LoggerOptions } from "./utils/LoggerFactory.js";
import 'dotenv/config'
import { SecretConfig } from  './interfaces/Config.js'
import ConfigLoader from "./configs/ConfigLoader.js";

export class DripcordFramework {
    private ConfigLoader = new ConfigLoader()

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

    constructor(private devMode: boolean) {
    }


    public async build() {

        if (this.secretConfig.TOKEN === "" || this.secretConfig.CLIENT_ID == "") {
            throw new Error("TOKEN or CLIENT is invalid or missing.")
        }

        const config = await this.ConfigLoader.load()

        const logger = createLoggerFromOptions(this.loggerOptions, this.devMode)
        logger.info("DripcordFramework has started!");
        new BotClient(this.secretConfig, config, logger, this.devMode)
        return
    }
}

