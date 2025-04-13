import { Client, GatewayIntentBits, OAuth2Scopes } from "discord.js"
import AntyCrash from './utils/antycrash.js'
import { Logger } from "winston"
import EventHandler from "./handlers/Event/EventHandler.js"


export interface SecretConfig {
    TOKEN: string
    CLIENT_ID: string
    CLIENT_SECRET?: string
    PUBLIC_KEY?: string
    REDIRECT_URI?: string
}
export interface Config  {
  eventsHandler: {
    dir: string,
    enabled: boolean
  }
}

export interface Bot {
  // Logger
  getLogger(): Logger
  // DATABASES

  // HANDLERS

  /**
   * Ends the bot
   * end logic saving
   */
  end(code: number): void
  
  // Invite
  getInvite(): any

}


export default class BotClient extends Client implements Bot {

  // MODE
  private devMode: boolean = process.argv.slice(2).includes("--dev")

  // Logger
  public getLogger(): Logger {
    return this.logger;
  }

  // DATABASES

  // HANDLERS
  private eventHandler: EventHandler | undefined;
  public getEventHandler(): EventHandler | undefined { return this.eventHandler}

  /**
   * Creates a custom discord client
   */
  constructor(private secretConfig: SecretConfig, private config: Config, private logger: Logger) {
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

    // Modules resolve
    await this.resolveModules()

    try {
      await this.login(this.secretConfig.TOKEN)
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
    process.exit(code)
  }

  /**
      Resolves Modules
  */
  private async resolveModules() {
    
    // EventHandler
    if (this.config.eventsHandler.enabled) {
      this.eventHandler = new EventHandler(this, this.config.eventsHandler.dir)
    }
  }

  // Invite
  getInvite() {
    return this.generateInvite({
      scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
      permissions: ["Administrator"],
    })
  }

  

}
