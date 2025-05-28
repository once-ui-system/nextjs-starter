"use client";

/**
 * Logger utility that only logs in development mode
 * Use this instead of console.log for debugging messages that
 * should not appear in production
*/
export const dev = {
  log: (...args: any[]) => {
    if (process.env.NODE_ENV === "development") {
      console.log(...args);
    }
  },

  warn: (...args: any[]) => {
    if (process.env.NODE_ENV === "development") {
      console.warn(...args);
    }
  },

  error: (...args: any[]) => {
    if (process.env.NODE_ENV === "development") {
      console.error(...args);
    }
  },

  info: (...args: any[]) => {
    if (process.env.NODE_ENV === "development") {
      console.info(...args);
    }
  },

  debug: (...args: any[]) => {
    if (process.env.NODE_ENV === "development") {
      console.debug(...args);
    }
  },
};