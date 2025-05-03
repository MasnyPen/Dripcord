import path from "path"
import fs from "fs"
import BotClient from "../../BotClient.js"
import {Logger} from "../../utils/Logger.js";

class EventHandler {
  constructor(private client: BotClient, dir: string) {
    Logger.info("[EventHandler] Events loading...")
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
        await this.loadEvents(filePath)
      } else if (file.endsWith(".js")) {
        try {
          const mod = await import(filePath)
          const eventClass = mod.default
        
          if (!eventClass) Logger.error("No default export")
          const instance = new eventClass()
          instance.setClient(this.client)
        } catch (err) {
          Logger.error(`Failed to load event at '${filePath}': ${err}`)
          continue
        }
        
      }
    }
    Logger.info("[EventHandler] Events loaded!")
  }
}


export default EventHandler


