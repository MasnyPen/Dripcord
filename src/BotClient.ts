import { Client, GatewayIntentBits } from "discord.js"
import AntyCrash from './utils/AntyCrash.js'
import { Logger } from "winston"
import EventHandler from "./handlers/Event/EventHandler.js"
import CommandHandler from "./handlers/Commands/CommandHandler.js"
import { CacheDriver } from "./drivers/cache/CacheDriver.js"
import { DatabaseDriver } from "./drivers/database/DatabaseDriver.js"
import PluginManager from "./managers/PluginManager.js";
import { Bot } from './interfaces/Bot.js'
import {Config, SecretConfig} from "./interfaces/Config.js";
import {initI18n} from "./utils/i18n";

export default class BotClient extends Client implements Bot {
  // Dev
  public isDevMode() {
    return this.devMode
  }
  public getDevs() {
    return this.config.dev.developers
  }

  // Logger
  public getLogger(): Logger {
    return this.logger;
  }

  // Cache
  public getCache(): CacheDriver {
    return this.config.cache
  }

  // DATABASE
  public getDatabase(): DatabaseDriver {
    return this.config.database
  }

  // HANDLERS
  private eventHandler!: EventHandler;
  public getEventHandler(): EventHandler { return this.eventHandler}
  private commandHandler!: CommandHandler
  public getCommandHandler(): CommandHandler { return this.commandHandler }
  private pluginManager!: PluginManager
  public getPluginManager(): PluginManager { return this.pluginManager; }

  /**
   * Creates a custom discord client
   */
  constructor(private secretConfig: SecretConfig, private config: Config, private logger: Logger , private devMode: boolean) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
    })
    this.start()
  }

  /**
   * Starts the bot
   */
  private async start() {
    // AntyCrash
    AntyCrash.init(this)
    this.getLogger().info("AntyCrash initialized")

    // i18n
    initI18n(this, this.config.i18n.default, this.config.i18n.locales)

    // Modules resolve
    await this.resolveModules()

    // Cache
    this.logger.info("[CACHE] Connecting to cache...")

    try {
      await this.getCache().connect()
      this.logger.info("[CACHE] Cache connected")
    } catch (err) {
      this.logger.info("[CACHE] " + err)
    }

    // Database
    this.logger.info("[DATABASE] Connecting to database...")

    try {
      await this.getDatabase().connect()
      this.logger.info("[DATABASE] Database connected")
    } catch (err) {
      this.logger.info("[DATABASE] " + err)
    }

    try {
      await this.login(this.devMode ? this.secretConfig.dev?.TOKEN : this.secretConfig.TOKEN)
    } catch (err: any) {
      this.getLogger().error("Bot login error:", err)
      this.end(1)
    } finally {
      this.getLogger().info("Dripcord login to your bot!")
    }

  }

  /**
   * Ends the bot
   * end logic saving
   */
  async end(code = 0) {
    this.pluginManager.shutdown()
    process.exit(code)
  }

  /**
      Resolves Modules
  */
  private async resolveModules() {

    // Handlers
    this.eventHandler = new EventHandler(this, this.config.eventsDir)
    this.commandHandler = new CommandHandler(this, this.config.commandsDir, this.secretConfig)
    this.pluginManager = new PluginManager(this)
  }
}
