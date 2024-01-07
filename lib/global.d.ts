import type { LogLevel, Logger } from "@/lib/logger";

declare global {
  var log: Logger;
  var LogLevels: typeof LogLevel;
};

export { };
