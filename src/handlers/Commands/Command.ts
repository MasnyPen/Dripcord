import {
  PermissionsString,
  SlashCommandBuilder,
  ContextMenuCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from "discord.js"
import BotClient from "../../BotClient.js"

export abstract class Command<
  T extends
    | { name: string }
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | SlashCommandOptionsOnlyBuilder
    | ContextMenuCommandBuilder = SlashCommandBuilder
> {
  public cooldown?: number
  public abstract data: T
  public perGuild?: boolean
  public devModeCmd?: boolean
  public devOnly?: boolean
  public permissions?: PermissionsString[]

  private commandCooldowns = new Map<string, Map<string, number>>()
  private interaction!:
    | UserContextMenuCommandInteraction
    | MessageContextMenuCommandInteraction
    | ChatInputCommandInteraction

  private client!: BotClient
  getClient() { return this.client}

  constructor() {
    const originalExecute = this.execute
    this.execute = async function (
      ...args: [
        (
          | UserContextMenuCommandInteraction
          | MessageContextMenuCommandInteraction
          | ChatInputCommandInteraction
        ),
        BotClient
      ]
    ) {
      const event = args[0]
      this.interaction = event
      const client: BotClient = args[1]
      this.client = client

      /*
       * Cooldowns Logic
       */
      if (await this.cooldownCommand()) return
      return originalExecute.apply(this, args)
    }
  }

  abstract execute(
    event:
      | UserContextMenuCommandInteraction
      | MessageContextMenuCommandInteraction
      | ChatInputCommandInteraction,
    client?: BotClient,
    args?: string[]
  ): void | Promise<void>
  autoComplete?(
    interaction: AutocompleteInteraction,
    client?: BotClient
  ): void | Promise<void>

  /*
   * Cooldowns Logic
   */
  private async cooldownCommand() {
    const commandName = this.data.name
    let userId: string
    if (this.interaction) userId = this.interaction.user.id

    else return

    if (!this.commandCooldowns.has(commandName)) {
      this.commandCooldowns.set(commandName, new Map())
    }

    const timeNow = Date.now()
    const cooldownMap = this.commandCooldowns.get(commandName)!

    if (cooldownMap.has(userId)) {
      const expirationTime = cooldownMap.get(userId)!
      if (timeNow < expirationTime) {
        await this.interaction.reply({
          content: `Please wait ${Math.ceil(
            (expirationTime - timeNow) / 1000
          )} seconds.`,
          ephemeral: true,
        })
        return true
      } else {
        return false
      }
    }

    cooldownMap.set(userId, timeNow + (this.cooldown || 5) * 1000)
  }
  /*
   * Permissions Logic
   */
  private async permissionsCommand() {
    if (this.permissions)
      if (
        !this.interaction?.memberPermissions?.has(this.permissions)
      ) {
        await this.interaction.reply({
          content: `No required permissions: ${this.permissions.join(
            ", "
          )}`,
          ephemeral: true,
        })
        return true
      } else {
        return false
      }
  }

  /*
   * DevOnly Logic
   */
  private async devOnlyCommand(): Promise<boolean> {
    let userId: string
    if (this.interaction) userId = this.interaction.user.id

    else return true
    if (
      this.devOnly &&
      !this.client.getDevs().find((el: string) => el === userId)
    ) {
        this.interaction.reply({
          content: "Only the bot developer can use this command!",
          ephemeral: true,
        })
      return true
    } else {
      return false
    }
  }
}
