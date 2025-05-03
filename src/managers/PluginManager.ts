import BotClient from "../BotClient.js";
import path from "path";
import fs from "fs";
import { Plugin } from '../interfaces/Plugin.js'
import {Logger} from "../utils/Logger.js";

export default class PluginManager {
    private plugins: Plugin[] = []

    constructor(private client: BotClient, dir: string = "./plugins") {
        Logger.info("[PluginManager] Plugins loading...")
        this.loadPlugins(dir).then(() => {
            this.initPlugins()
        });
    }

    private async loadPlugins(dir: string) {
        const pluginsDir = path.join(process.cwd(), dir)

        if (!fs.existsSync(pluginsDir)) {
            return
        }

        const files = fs.readdirSync(pluginsDir)

        for (const file of files) {
            const filePath = path.join(pluginsDir, file)

            if (fs.statSync(filePath).isDirectory()) {
                this.loadPlugins(path.join(pluginsDir, file))
            } else if (file.endsWith(".js")) {
                try {
                    const plugin: Plugin = await import(filePath).then(res => res.default)

                    if (!plugin) Logger.error("No default export")
                    this.plugins.push(plugin)
                } catch (err) {
                    Logger.error(`Failed to load plugin at '${filePath}': ${err}`)
                    continue
                }

            }
        }
        Logger.info("[PluginManager] Plugins loaded!")
    }

    public initPlugins() {
        for (const plugin of this.plugins) {
            plugin.init(this.client)
            Logger.info(`[PluginManager] [${plugin.name}] Loaded plugin. Version: ${plugin.version} Author: ${plugin.author}`)
        }
    }
    public shutdown() {
        for (const plugin of this.plugins) {
            if (plugin.shutdown) plugin.shutdown(this.client)
        }
    }
}