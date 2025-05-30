import winston from "winston"
import DailyRotateFile from "winston-daily-rotate-file"

export interface LoggerOptions {
    enabled?: boolean
    prefix?: string
    level?: "info" | "debug" | "warn" | "error"
    console?: boolean
    file?: boolean
    filePath?: string
    dateRotate?: boolean
    maxFiles?: string
}

export let Logger: winston.Logger

export function initLogger(opts: LoggerOptions, devMode: boolean) {
    const transports = []
  
    if (opts.console) {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.label({ label: `[${opts.prefix ?? "Dripcord"}]${ devMode ?? "[DEVMODE]"}`  }),
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(({ level, message, timestamp }) => {
              return `[${timestamp}] [${level}]: ${message}`
            })
          ),
        })
      )
    }
  
    if (opts.file) {
      transports.push(
        new DailyRotateFile({
          dirname: opts.filePath || "./logs",
          filename: "%DATE%.log",
          datePattern: "YYYY-MM-DD",
          zippedArchive: true,
          maxFiles: opts.maxFiles || "14d",
          format: winston.format.json(),
        })
      )
    }
  
    Logger = winston.createLogger({
      level: opts.level || "info",
      transports,
    })
    return
}

  