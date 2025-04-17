# 🍣 Dripcord Framework

**Dripcord** is a modern, scalable and modular Discord bot framework built on top of `discord.js`. It supports automatic command & event registration, database and cache drivers, dev tools, and is ready for plugin & i18n support. Designed for developers who want power and structure — without boilerplate.

---

## 🚀 Installation

```bash
npm install dripcord
```

> Requires **Node.js 18+** and **discord.js 14+**

---

## 🔧 Getting Started

```ts
import { DripcordFramework, LocalCacheDriver, SQLiteDatabaseDriver } from 'dripcord'

const bot = new DripcordFramework()
    .setDevelopers(["DEV_ID", "DEV_ID2"])
    .setEventsHandler(true, "./events") // Dir is default value
    .setCommandHandler(true, "./commands") // Dir is default value
    .setCacheDriver(new LocalCacheDriver()) // Default value
    .setDatabaseDriver(new SQLiteDatabaseDriver(":memory:")) // Default value
    .build()
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

## 📁 Project Structure

```
.
├── commands/
│   └── ping.js
├── events/
│   └── ready.js
├── app.js
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

## 🌍 Language Manager (Coming Soon)

Multilingual support is planned through an optional language manager.

```ts
bot.getLanguage().t("command.success", { user: "John" });
```

---

## 🧹 Plugin System (Coming Soon)

Extend Dripcord with plugins to add new features.

```ts
bot.use(new AnalyticsPlugin());
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

Made with ❤️ by **MasnyPen**

---

## 📜 License

[APACHE LICENSE 2.0](./LICENSE)

