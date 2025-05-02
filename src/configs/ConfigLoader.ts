import { Config } from "../interfaces/Config.js";
import fs from "fs";
import path from "path";
import {LocalCacheDriver} from "../drivers/cache/LocalDriver.js";
import {SQLiteDatabaseDriver} from "../drivers/database/SqliteDriver.js";

export default class ConfigLoader {
    private configPath = path.join(process.cwd(), "config.js");
    private static config: Config | null = null

    async load(): Promise<Config> {
        try {
            if (ConfigLoader.config !== null) {
                return ConfigLoader.config
            }
            if (!fs.existsSync(this.configPath)) {
                console.warn("⚠️  config.js not found, creating default template.");
                this.writeDefaultConfigFile();
            }

            const module = await import(this.configPath);
            ConfigLoader.config = module.default;
            return ConfigLoader.config!;
        } catch (error) {
            console.error("❌  Failed to load config.js:", error);
            this.writeDefaultConfigFile();
            return this.defaultLoad();
        }
    }

    private writeDefaultConfigFile() {
        const configTemplate = `
// Auto-generated config.js
import { LocalCacheDriver, SQLiteDatabaseDriver } from "dripcord";

export default {
  dev: {
    developers: []
  },
  cache: new LocalCacheDriver(),
  database: new SQLiteDatabaseDriver(),
  eventsDir: "./events",
  commandsDir: "./commands",
  pluginsDir: "./plugins",
  i18n: {
    default: "en",
    locales: ["en"]
  },
  shards: { 
    enabled: false, 
    totalShards: "auto"
  }
};
        `.trim();

        try {
            fs.writeFileSync(this.configPath, configTemplate, "utf-8");
            console.log("✅  Created default config.js template.");
        } catch (error) {
            console.error("❌  Failed to write config.js:", error);
        }
    }

    private defaultLoad(): Config {
        return {
            dev: {
                developers: []
            },
            cache: new LocalCacheDriver(),
            database: new SQLiteDatabaseDriver(),
            eventsDir: "./events",
            commandsDir: "./commands",
            pluginsDir: "./plugins",
            i18n: {
                default: "en",
                locales: ["en"]
            },
            shards: {
              enabled: false,
              totalShards: "auto"
            }
        };
    }
}
