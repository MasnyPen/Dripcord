# 🍣 Dripcord Framework

**Dripcord** is a modern, scalable and modular Discord bot framework built on top of `discord.js`. It supports automatic command & event registration, database and cache drivers, dev tools, and is ready for plugin & i18n support. Designed for developers who want power and structure — without boilerplate.

---

## 🚀 Installation

```bash
npm install dripcord
```

> Requires **Node.js 20+** and **discord.js 14+**

---

## 🔧 Getting Started

```bash
dripcord start
```

---

## ⚙️ Env Configuration

```
# Production credentials
TOKEN=your_bot_token_here
CLIENT_ID=your_bot_client_id_here 

# OPTIONAL
# Production credentials
CLIENT_SECRET=your_bot_client_secret_here
PUBLIC_KEY=your_bot_public_key_here
REDIRECT_URI=https://yourdomain.com/redirect

# Development credentials
DEV_TOKEN=your_dev_bot_token_here
DEV_CLIENT_ID=your_dev_bot_client_id_here
DEV_CLIENT_SECRET=your_dev_bot_client_secret_here
DEV_PUBLIC_KEY=your_dev_bot_public_key_here
DEV_REDIRECT_URI=https://yourdomain.com/dev-redirect
DEV_GUILD_ID=your_dev_guild_id_here

```

---

## ⚙️ Configuration

```js
// config.js
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
    locales: ["en", "pl", "de"]
  }
};

```

---

## 📁 Project Structure

```
.
├── commands/
│   └── ping.js
├── events/
│   └── ready.js
├── plugins/
│   └── plugin.js
├── config.js
├── .env
└── ...
```

---

## ⚙️ Commands

Easily register slash commands using the built-in handler:

```ts
import { Command, SlashCommandBuilder } from "dripcord";

export default class PingCommand extends Command {
  constructor() {
    super(new SlashCommandBuilder(), true, 5); // SlashCommandBuilder data, perGuild boolean option, cooldown (optional)
  }

  async run(interaction) {
    interaction.reply("🏓 Pong!");
  }
}
```

---

## 📡 Events

Define client event listeners like this:

```ts
import { Event, Events } from "dripcord";

export default class ReadyEvent extends Event {
  constructor() {
    super(Events.ClientReady, true);
  }

  async execute(client) {
    client.getLogger().info("Bot is ready!");
  }
}
```

---

## 📂 Database Drivers

Support for multiple database engines with unified API:

- **SQLite** – `SQLiteDatabaseDriver` (sqlite3)
- **MySQL** – `MySQLDatabaseDriver` (mysql2)

```ts
await bot.getDatabase().set("prefix:123", "!");
const prefix = await bot.getDatabase().get("prefix:123");
```

---

## 🧠 Cache Drivers

Use local memory or external cache like Redis:

- `LocalCacheDriver`
- `RedisCacheDriver`

```ts
await bot.getCache().set("user:123", { xp: 100 });
const user = await bot.getCache().get("user:123");
```

---

## 🧹 Plugin System 

Extend Dripcord with plugins to add new features.

```ts
export default {
    name: "Example plugin",
    version: "1.0",
    author: "Example",
    init(client) {
        client.getLogger().info("Plugin loaded!")
    }
}
```

---

## 🌍 i18n Support

With i18n you can easily manage languages.

```ts
import { Translate } from "dripcord";

Translate("command.success", { user: "John" });
```

---

## 🚫 AntiCrash System

Built-in global error handling:

```
[antiCrash] :: Unhandled Rejection/Catch
[antiCrash] :: uncaughtException
```

---

## 🤝 Author

**MasnyPen**

---

## 📜 License

[APACHE LICENSE 2.0](./LICENSE)

