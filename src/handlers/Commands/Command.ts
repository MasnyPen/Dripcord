import {
  SlashCommandBuilder,
  ContextMenuCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from "discord.js"
import {Bot} from "../../interfaces/Bot.js";

export abstract class Command<
  T extends
    | { name: string }
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | SlashCommandOptionsOnlyBuilder
    | ContextMenuCommandBuilder = SlashCommandBuilder
> {

  private commandCooldowns = new Map<string, Map<string, number>>()
  private interaction!:
    | UserContextMenuCommandInteraction
    | MessageContextMenuCommandInteraction
    | ChatInputCommandInteraction

  private client!: Bot
  getClient() { return this.client}

  constructor(private data: T, private perGuild: boolean, private cooldown = 0) {
    const originalExecute = this.execute
    this.execute = async function (
      ...args: [
        (
          | UserContextMenuCommandInteraction
          | MessageContextMenuCommandInteraction
          | ChatInputCommandInteraction
        ),
        Bot
      ]
    ) {
      const event = args[0]
      this.interaction = event
      const client: Bot = args[1]
      this.client = client

      /*
       * Cooldowns Logic
       */
      if (await this.cooldownCommand()) return
      return originalExecute.apply(this, args)
    }
  }

  public getData() {
    return this.data
  }

  public isPerGuild() {
    return this.perGuild
  }

  public abstract execute(
    event:
      | UserContextMenuCommandInteraction
      | MessageContextMenuCommandInteraction
      | ChatInputCommandInteraction,
    client?: Bot,
    args?: string[]
  ): void | Promise<void>
  autoComplete?(
    interaction: AutocompleteInteraction,
    client?: Bot
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
}
