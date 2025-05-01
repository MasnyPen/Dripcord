import chalk from "chalk"
import {Logger} from "./Logger";


export default {
  init: (): void => {
    process.on("unhandledRejection", (reason, p) => {
      Logger.error(
          chalk.red(
              `[antiCrash] :: Unhandled Rejection/Catch`
          )
      );
      Logger.error(`${reason}\n ${p}`);
    });
    process.on("uncaughtException", (err, origin) => {
      Logger.error(
          chalk.red(
              `\n[antiCrash] :: Uncaught Exception/Catch`
          )
      );
      Logger.error(`${err}\n${origin}`);
    });
    process.on("uncaughtExceptionMonitor", (err, origin) => {
      Logger.error(
          chalk.red(
              `\n[antiCrash] :: Uncaught Exception/Catch (MONITOR)`
          )
      );
      Logger.error(`${err}\n${origin}`);
    });
  }
}
