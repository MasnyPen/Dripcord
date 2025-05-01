import {
  Collection,
  REST,
  Routes,
  Events,
  ContextMenuCommandBuilder,
  Interaction,
} from "discord.js"
import path from "path"
import fs from "fs"
import { Command } from "./Command.js"
import BotClient from "../../BotClient.js"
import {SecretConfig} from "../../interfaces/Config.js";
import {Logger} from "../../utils/Logger";

export default class CommandHandler {
  private cmds: string[] = []
  private commands: Collection<string, Command> = new Collection()
  private rest: REST
  private cmdsPerGuilds: any[] = []

  constructor(
    private client: BotClient,
    private commandsPath: string,
    private options: SecretConfig
  ) {
    this.rest = new REST().setToken(this.options.TOKEN)
    this.registerCommands()
  }

  private async loadCommands(dir: string): Promise<void> {
    try {
      const commandsDir = path.join(process.cwd(), dir)

      if (!fs.existsSync(commandsDir)) return

      const files = fs.readdirSync(dir)

      for (const file of files) {
        const filePath = path.join(commandsDir, file)

        if (fs.statSync(filePath).isDirectory()) {
          this.loadCommands(path.join(commandsDir, file))
        } else if (file.endsWith(".js")) {
          try {
            const instance = await import(filePath).then(res => res.default)
            const command: Command = new instance()

            if (!command?.getData() || typeof command.execute !== "function") {
              Logger.error(`[CommandHandler] Command ${file} is missing 'data' or 'execute'.`)
              continue
            }

            if (!command.getData().name) {
              Logger.error(`[CommandHandler] Command ${file} has no 'name'.`)
              continue
            }

            if (this.commands.has(command.getData().name)) {
              Logger.warn(`[CommandHandler] Command '${command.getData().name}' is already registered. Skipping.`)
              continue
            }

            this.commands.set(command.getData().name, command)
            this.cmds.push(command.getData().name)

          } catch (err) {
            Logger.error(`[CommandHandler] Failed to load command: ${file} - ${err}`)
            continue
          }
        }   
      }
    } catch (err) {
      Logger.error(`[CommandHandler] Error loading commands: ${err}`)
    }
  }

  private async registerCommands(): Promise<void> {
    await this.loadCommands(this.commandsPath)
    const cmds = []

    for (const cmd of this.commands.values()) {
      if (cmd.getData() && typeof cmd.getData().toJSON === "function") {
        if (!cmd.getData().description && !(cmd.getData() instanceof ContextMenuCommandBuilder)) {
          cmd.getData().setDescription("Brak Opisu")
        }

        if (cmd.isPerGuild()) {
          this.cmdsPerGuilds.push(cmd.getData().toJSON())
        } else {
          cmds.push(cmd.getData().toJSON())
        }
      } else {
        Logger.error(`[CommandHandler] Invalid JSON for command: ${cmd.getData()?.name}`)
      }
    }

    try {
      if (!this.client.isDevMode() || !this.options.dev) {
        Logger.info(`[CommandHandler] Registering ${cmds.length + this.cmdsPerGuilds.length} global commands.`)

        const dataGlobal: any = await this.rest.put(
          Routes.applicationCommands(this.options.CLIENT_ID),
          { body: cmds }
        )

        this.client.guilds.cache.forEach(guild => {
          this.registerCommandsPerGuild(guild.id)
        })

        Logger.info(`[CommandHandler] Global registration complete (${dataGlobal.length + this.cmdsPerGuilds.length} commands).`)
      } else {
        Logger.info(`[CommandHandler] Registering ${cmds.length + this.cmdsPerGuilds.length} dev commands.`)

        const data: any = await this.rest.put(
          Routes.applicationGuildCommands(
            this.options.dev.CLIENT_ID,
            this.options.dev.GUILD_ID
          ),
          { body: [...cmds, ...this.cmdsPerGuilds] }
        )

        Logger.info(`[CommandHandler] Dev registration complete (${data.length} commands).`)
      }
    } catch (error) {
      Logger.error(`[CommandHandler] Failed to register commands: ${error}`)
    } finally {
      this.listeners()
    }
  }

  public async registerCommandsPerGuild(guildId: string) {
    try {
      return await this.rest.put(
        Routes.applicationGuildCommands(this.options.CLIENT_ID, guildId),
        { body: this.cmdsPerGuilds }
      )
    } catch (error) {
      Logger.error(`[CommandHandler] Guild command registration failed for ${guildId}: ${error}`)
    }
  }

  public async unregisterCommand(commandId: string) {
    return await this.rest.delete(Routes.applicationCommand(this.options.CLIENT_ID, commandId))
  }

  public async unregisterCommandPerGuild(guildId: string, commandId: string) {
    return await this.rest.delete(Routes.applicationGuildCommand(this.options.CLIENT_ID, guildId, commandId))
  }

  private listeners(): void {
    this.client.on(Events.InteractionCreate, async interaction => {
      this.commandExecute(interaction)
      this.autocomplete(interaction)
    })
  }

  private async commandExecute(interaction: Interaction): Promise<void> {
    try {
      if (!interaction.isChatInputCommand() && !interaction.isContextMenuCommand()) return

      const command = this.commands.get(interaction.commandName)
      if (!command) {
        Logger.warn(`Command '${interaction.commandName}' not found.`)
        return
      }

      try {
        await command.execute(interaction, this.client)
        if (this.client.isDevMode()) Logger.info(`[CommandHandler] ${interaction.user.id} executed command: ${command.getData().name}`)
        
      } catch (error) {
        Logger.error(`[CommandHandler] Execution error for '${command.getData().name}': ${error}`)
        await interaction.reply({ content: "An error occurred while executing the command.", ephemeral: true })
      }
    } catch (err) {
      Logger.error(`[CommandHandler] commandExecute error: ${err}`)
    }
  }

  private async autocomplete(interaction: Interaction): Promise<void> {
    if (!interaction.isAutocomplete()) return

    const command = this.commands.get(interaction.commandName)
    if (!command) {
      Logger.warn(`Autocomplete command not found: ${interaction.commandName}`)
      return
    }

    try {
      if (command.autoComplete) {
        await command.autoComplete(interaction, this.client)
      }
    } catch (error) {
      Logger.error(`[CommandHandler] Autocomplete error for '${command.getData().name}': ${error}`)
    }
  }
}
