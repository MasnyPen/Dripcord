import path from "path"
import fs from "fs"
import BotClient from "../../BotClient.js"
import { Events } from "discord.js";
import { Event } from "./Event.js";
Events

class EventHandler {
  constructor(private client: BotClient, dir: string) {
      this.loadEvents(dir)
  }

  async loadEvents(directory: string) {
    this.client.getLogger().info("[EventHandler] Events loading...")
    const eventsDir = path.join(process.cwd(), directory)

    if (!fs.existsSync(eventsDir)) {
        this.client.getLogger().error(`Directory '${directory}' does not exist.`)
        return
    }

    const files = fs.readdirSync(eventsDir)

    for (const file of files) {
      const filePath = path.join(eventsDir, file)

      if (fs.statSync(filePath).isDirectory()) {
        this.loadEvents(path.join(eventsDir, file))
      } else if (file.endsWith(".js")) {
        let event: Event
        try {
          event = await import(filePath).then(res => res.default)
        } catch (err) {
          this.client.getLogger().error(`Failed to load event at '${filePath}': ${err}`);
          continue
        } finally {
          new event().setClient(this.client)
        }
      }
    }
    this.client.getLogger().info("[EventHandler] Events loaded!")
  }
}


export default EventHandler


