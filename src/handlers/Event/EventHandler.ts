import path from "path"
import fs from "fs"
import BotClient from "../../BotClient.js"
import { Events } from "discord.js";
import { Event } from "./Event.js";
Events

class EventHandler {
  constructor(private client: BotClient, dir: string) {
    this.client.getLogger().info("[EventHandler] Events loading...")
    this.loadEvents(dir)
  }

  async loadEvents(directory: string) {
    const eventsDir = path.join(process.cwd(), directory)

    if (!fs.existsSync(eventsDir)) {
        return
    }

    const files = fs.readdirSync(eventsDir)

    for (const file of files) {
      const filePath = path.join(eventsDir, file)

      if (fs.statSync(filePath).isDirectory()) {
        this.loadEvents(path.join(eventsDir, file))
      } else if (file.endsWith(".js")) {
        try {
          const mod = await import(filePath)
          const eventClass = mod.default
        
          if (!eventClass) this.client.getLogger().error("No default export")
          const instance = new eventClass()
          instance.setClient(this.client)
        } catch (err) {
          this.client.getLogger().error(`Failed to load event at '${filePath}': ${err}`)
          continue
        }
        
      }
    }
    this.client.getLogger().info("[EventHandler] Events loaded!")
  }
}


export default EventHandler


