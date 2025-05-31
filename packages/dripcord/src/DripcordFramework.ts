import BotClient from "./BotClient.js";
import {initLogger, Logger} from "./utils/Logger.js";
import ConfigLoader from "./configs/ConfigLoader.js";
import {ShardingManager} from "discord.js";
import {Bot} from "./interfaces/Bot.js";
import 'dotenv/config'
import { resolve } from 'path'

export class DripcordFramework {
    private client: Bot | undefined
    private manager: ShardingManager | undefined
    private ConfigLoader = new ConfigLoader()

    public isClient() {
        return this.client != undefined;
    }

    public getClient() {
        return this.client;
    }

    public isManager() {
        return this.manager != undefined;
    }
    public getManager() {
        return this.manager;
    }

    constructor(private devMode: boolean) {
        initLogger({
            enabled: true,
            level: "info",
            console: true,
            file: true,
            filePath: "./logs",
            dateRotate: true,
            maxFiles: "14d"
        }, this.devMode)
        this.start()
    }
    private async start() {
        const config = await this.ConfigLoader.load()

        if (config.shards.enabled && !this.devMode) {
            this.manager = new ShardingManager(resolve('shard.js'), {
                respawn: true,
                token: process.env.TOKEN,
                totalShards: 'auto',
                shardList: 'auto',
            })
            await this.managerSetup()
        } else {
            this.client = new BotClient(this.devMode)
        }
    }

    private async managerSetup() {
        this.manager!.on('shardCreate', shard => {
            shard.on('ready', () => {
                Logger.info(`[CLIENT] Shard ${shard.id} connected to Discord's Gateway.`);
            });
        });

        await this.manager!.spawn();

        Logger.info(`[CLIENT] ${this.manager!.totalShards} shard(s) spawned.`);
    }
    public async end() {
        if (this.isClient()) {
            this.client!.destroy()
        } else if (this.isManager()) {
            this.manager!.shards.map(shard => shard.kill());
        }
    }
}

