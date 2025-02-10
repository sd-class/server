import "dotenv/config";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { promises as fs, watch } from "fs";
import path from "path";
import type { ServerWebSocket } from "bun";
import type { MyWebSocketEventHandler } from "./types";

const db = drizzle({
  connection: process.env.DATABASE_URL,
  casing: "snake_case",
});
const eventsPath = path.join(__dirname, "events");
const clients = new Set<ServerWebSocket<unknown>>();
let routes = new Map<string, MyWebSocketEventHandler<unknown>>();

async function registerRoute(eventsPath: string) {
  const newRoutes = new Map();
  for (const file of await fs.readdir(eventsPath, {
    withFileTypes: true,
    recursive: true,
  })) {
    if (!file.isFile()) continue;
    const ext = path.extname(file.name);
    if (ext !== ".ts" && ext !== ".js") continue;
    const filePath = path.join(file.parentPath, file.name);
    const basename = path.basename(file.name, ext);
    const route = await import(filePath);
    const event = path
      .relative(eventsPath, path.join(file.parentPath, basename))
      .replace(/\\/g, "/");
    if (typeof route.default?.message !== "function") {
      console.error(`Route ${event} does not have a message function`);
      continue;
    }
    newRoutes.set(event, route.default);
    console.log(`Registered route: ${event}`, route.default);
  }
  routes = newRoutes;
}

if (import.meta.main) {
  registerRoute(eventsPath);
  const watcher = watch(eventsPath, { recursive: true }, (event, filename) => {
    console.log(`Detected ${event} in ${filename}`);
    registerRoute(eventsPath);
  });
  process.on("SIGINT", () => {
    console.log("Closing watcher...");
    watcher.close();
    process.exit(0);
  });
  Bun.serve({
    fetch(req, server) {
      if (server.upgrade(req)) return;
      return new Response("Upgrade failed", { status: 500 });
    },
    websocket: {
      message(ws, message) {
        if (typeof message === "string") return;
        const headIndex = message.indexOf(0);
        const event = message.subarray(0, headIndex).toString("utf-8");
        const data = message.subarray(headIndex + 1);
        console.log(event, data);
        routes
          .entries()
          .filter(([name]) => name === event)
          .forEach(([_, route]) => route.message(ws, data));
      },
      async open(ws) {
        console.log("open");
        clients.add(ws);
        routes.forEach((route) => route.open?.(ws));
      },
      async close(ws, code, message) {
        console.log("close", code, message);
        clients.delete(ws);
        routes.forEach((route) => route.close?.(ws, code, message));
      },
    },
    port: process.env.PORT || 3000,
  });
}
