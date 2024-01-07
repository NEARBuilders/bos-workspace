import { Log } from "./types";

export enum LogLevel {
  NONE = 0,
  ERROR = 1,
  WARN = 2,
  INFO = 3,
  DEV = 4,
  BUILD = 5,
  DEBUG = 6,
};

export class Logger {
  loglevel: LogLevel;

  constructor(loglevel = LogLevel.INFO) {
    this.loglevel = loglevel;
  }

  loading = (text = "", level: LogLevel.DEV | LogLevel.BUILD | LogLevel.INFO = LogLevel.INFO, enabledots = true) => {
    if (this.loglevel < level) return {
      finish: () => { },
      error: () => { },
    }

    let x = 0;
    const chars = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    const dots = [
      "   ",
      "   ",
      ".  ",
      ".  ",
      ".  ",
      ".. ",
      ".. ",
      ".. ",
      "...",
      "...",
      "...",
    ];
    const delay = 80;

    const interval = setInterval(function() {
      // change dots slower than the chars
      process.stdout.write(
        "\r" +
        chars[x++] +
        " " +
        text +
        (enabledots ? dots[x % dots.length] : ""),
      );
      x = x % chars.length;
    }, delay);

    return {
      finish: (text1 = text) => {
        clearInterval(interval);
        process.stdout.write(
          "\r\x1b[32m\x1b[1m\u2713\x1b[0m " +
          text1 +
          "                                      \n",
        );
      },
      error: (text1 = text) => {
        clearInterval(interval);
        process.stdout.write(
          "\r\x1b[31m\x1b[1m\u2717\x1b[0m " +
          text1 +
          "                                      \n",
        );
      },
    };
  }
  wait = (promise: Promise<any>, message?: string, success?: string, error?: string, level: LogLevel.DEV | LogLevel.BUILD | LogLevel.INFO = LogLevel.INFO, enabledots = true): Promise<any> => {
    const loading = this.loading(message, level, enabledots);
    return promise
      .then((r) => {
        loading.finish(success);
        return r;
      })
      .catch((e) => {
        loading.error(error);
        this.error(e.message);
        return Promise.reject(e);
      });
  }
  success = (text: string, level: LogLevel.DEV | LogLevel.BUILD | LogLevel.INFO = LogLevel.INFO) => {
    if (this.loglevel < level) return;
    process.stdout.write("\x1b[32m\x1b[1m\u2713\x1b[0m " + text + "\n");
  }
  info = (text: string, level: LogLevel.DEV | LogLevel.BUILD | LogLevel.INFO = LogLevel.INFO) => {
    if (this.loglevel < level) return;
    process.stdout.write("\x1b[34m\x1b[1m⋅\x1b[0m " + text + "\n");
  }
  log = (text: string, level: LogLevel = LogLevel.INFO) => {
    if (this.loglevel < level) return;
    process.stdout.write(text + "\n");
  }
  warn = (text: string) => {
    if (this.loglevel < LogLevel.WARN) return;
    process.stdout.write("\x1b[33m\x1b[1m\u26A0\x1b[0m " + text + "\n");
  }
  error = (text: string) => {
    if (this.loglevel < LogLevel.ERROR) return;
    process.stdout.write("\x1b[31m\x1b[1m\u2717\x1b[0m " + text + "\n");
  }
  debug = (text: string) => {
    if (this.loglevel < LogLevel.DEBUG) return;
    process.stdout.write("\x1b[35m\x1b[1m⋅\x1b[0m " + text + "\n");
  }
  send = (log: Log) => {
    const formatLog = (log: Log) => {
      return `[${log.source?.file || ""}:${log.source?.line || ""}] ${log.message}`;
    }
    switch (log.level) {
      case "warn":
        this.warn(formatLog(log));
        break;
      case "error":
        this.error(formatLog(log));
        break;
      case "info":
        this.info(formatLog(log));
        break;
      case "debug":
        this.debug(formatLog(log));
      default:
        this.log(formatLog(log));
    }
  }
};

global.log = new Logger(LogLevel.INFO);
global.LogLevels = LogLevel;
