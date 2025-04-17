import {Logger} from "winston";
import {CacheDriver} from "../drivers/cache/CacheDriver";
import EventHandler from "../handlers/Event/EventHandler";
import CommandHandler from "../handlers/Commands/CommandHandler";
import PluginManager from "../managers/PluginManager";
import { Client } from 'discord.js'

export interface Bot extends Client {

    // Dev
    isDevMode(): boolean
    getDevs(): string[]

    // Logger
    getLogger(): Logger

    // CACHE
    getCache(): CacheDriver

    // DATABASES

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