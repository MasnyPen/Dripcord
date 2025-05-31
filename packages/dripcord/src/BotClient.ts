import { Client, GatewayIntentBits } from "discord.js"
import AntyCrash from './utils/AntyCrash.js'
import {initLogger, Logger} from "./utils/Logger.js"
import EventHandler from "./handlers/Event/EventHandler.js"
import CommandHandler from "./handlers/Commands/CommandHandler.js"
import { CacheDriver } from "./drivers/cache/CacheDriver.js"
import { DatabaseDriver } from "./drivers/database/DatabaseDriver.js"
import PluginManager from "./managers/PluginManager.js";
import { Bot } from './interfaces/Bot.js'
import {Config, SecretConfig} from "./interfaces/Config.js";
import {initI18n} from "./utils/i18n.js";
import ConfigLoader from "./configs/ConfigLoader.js";


export default class BotClient extends Client implements Bot {
  // Dev
  public isDevMode() {
    return this.devMode
  }
  public getDevs() {
    return this.config.dev.developers
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

  // Secret Config
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

  // Config
  private config!: Config
  private ConfigLoader = new ConfigLoader()



  /**
   * Creates a custom discord client
   */
  constructor(private devMode: boolean = false) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
    })

    this.start()
    process.on("exit", () => this.end())
  }

  /**
   * Starts the bot
   */
  private async start() {

    if (this.secretConfig.TOKEN === "" || this.secretConfig.CLIENT_ID == "") {
      throw new Error("TOKEN or CLIENT is invalid or missing.")
    }

    this.config = await this.ConfigLoader.load()

    Logger.info("DripcordFramework has started!");

    // AntyCrash
    AntyCrash.init()
    Logger.info("AntyCrash initialized")

    // i18n
    initI18n(this, this.config.i18n.default, this.config.i18n.locales)

    // Handlers
    this.eventHandler = new EventHandler(this, this.config.eventsDir)
    this.commandHandler = new CommandHandler(this, this.config.commandsDir, this.secretConfig)
    this.pluginManager = new PluginManager(this)

    // Cache
    Logger.info("[CACHE] Connecting to cache...")

    try {
      await this.getCache().connect()
      Logger.info("[CACHE] Cache connected")
    } catch (err) {
      Logger.info("[CACHE] " + err)
    }

    // Database
    Logger.info("[DATABASE] Connecting to database...")

    try {
      await this.getDatabase().connect()
      Logger.info("[DATABASE] Database connected")
    } catch (err) {
      Logger.info("[DATABASE] " + err)
    }

    try {
      await this.login(this.devMode ? this.secretConfig.dev?.TOKEN : this.secretConfig.TOKEN)
    } catch (err: any) {
      Logger.error("Bot login error:", err)
      this.end(1)
    } finally {
      Logger.info("Dripcord login to your bot!")
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
}

export function initShard() {
  initLogger({
    enabled: true,
    level: "info",
    console: true,
    file: true,
    filePath: "./logs",
    dateRotate: true,
    maxFiles: "14d"
  }, false)
  new BotClient()
}