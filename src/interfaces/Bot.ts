import {CacheDriver} from "../drivers/cache/CacheDriver";
import EventHandler from "../handlers/Event/EventHandler";
import CommandHandler from "../handlers/Commands/CommandHandler";
import PluginManager from "../managers/PluginManager";
import { Client } from 'discord.js'
import {DatabaseDriver} from "../drivers/database/DatabaseDriver";

export interface Bot extends Client {

    // Dev
    isDevMode(): boolean
    getDevs(): string[]

    // CACHE
    getCache(): CacheDriver

    // DATABASES
    getDatabase(): DatabaseDriver

    // HANDLERS
    getEventHandler(): EventHandler
    getCommandHandler(): CommandHandler
    getPluginManager(): PluginManager

    /**
     * Ends the bot
     * end logic saving
     */
    end(code: number): void

}