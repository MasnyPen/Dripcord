import chalk from "chalk"
import { Bot } from "../interfaces/Bot.js"


export default {
  init: (client: Bot): void => {
    process.on("unhandledRejection", (reason, p) => {
      client.getLogger().error(
          chalk.red(
              `[antiCrash] :: Unhandled Rejection/Catch`
          )
      );
      client.getLogger().error(`${reason}\n ${p}`);
    });
    process.on("uncaughtException", (err, origin) => {
      client.getLogger().error(
          chalk.red(
              `\n[antiCrash] :: Uncaught Exception/Catch`
          )
      );
      client.getLogger().error(`${err}\n${origin}`);
    });
    process.on("uncaughtExceptionMonitor", (err, origin) => {
      client.getLogger().error(
          chalk.red(
              `\n[antiCrash] :: Uncaught Exception/Catch (MONITOR)`
          )
      );
      client.getLogger().error(`${err}\n${origin}`);
    });
  }
}
