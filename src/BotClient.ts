import { Client, GatewayIntentBits, OAuth2Scopes } from "discord.js"
import AntyCrash from './utils/antycrash.js'
import { Logger } from "winston"


export interface SecretConfig {
    TOKEN: string
    CLIENT_ID: string
    CLIENT_SECRET?: string
    PUBLIC_KEY?: string
    REDIRECT_URI?: string
}
export interface Config  {

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
  async start() {
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
  async resolveModules() {
  }

  // Invite
  getInvite() {
    return this.generateInvite({
      scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
      permissions: ["Administrator"],
    })
  }

  

}
