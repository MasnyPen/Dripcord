import chalk from "chalk";
import { Logger } from "./Logger";

export default {
  init: (): void => {
    process.on("unhandledRejection", (reason: any, p) => {
      Logger.error(chalk.red(`[antiCrash] :: Unhandled Rejection/Catch`));

      if (reason instanceof Error) {
        Logger.error(reason.stack || reason.message);
      } else {
        Logger.error("Reason (non-Error):", reason);
      }

      Logger.error("Promise:", p);
    });

    process.on("uncaughtException", (err: Error, origin) => {
      Logger.error(chalk.red(`[antiCrash] :: Uncaught Exception/Catch`));
      Logger.error(err.stack || err.message);
      Logger.error(`Origin: ${origin}`);
    });

    process.on("uncaughtExceptionMonitor", (err: Error, origin) => {
      Logger.error(chalk.red(`[antiCrash] :: Uncaught Exception/Catch (MONITOR)`));
      Logger.error(err.stack || err.message);
      Logger.error(`Origin: ${origin}`);
    });
  }
}
