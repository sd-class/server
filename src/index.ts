import "dotenv/config";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { eq } from "drizzle-orm";
import { usersTable } from "./db/schema";
import type { ServerWebSocket } from "bun";

const db = drizzle(process.env.DB_FILE_NAME!);
const clients = new Set<ServerWebSocket<unknown>>();

if (import.meta.main) {
  Bun.serve({
    fetch(req, server) {
      if (server.upgrade(req)) return;
      return new Response("Upgrade failed", { status: 500 });
    },
    websocket: {
      message(ws, message) {
        console.log(message);
        ws.send("reply:" + message);
      },
      async open(ws) {
        console.log("open");
        clients.add(ws);
      },
      close(ws, code, message) {
        console.log("close", code, message);
        clients.delete(ws);
      },
      drain(ws) {
        console.log("drain");
      }, // the socket is ready to receive more data
    },
    port: 3000,
  });
  for await (const line of console) {
    clients.forEach((ws) => ws.send(line));
  }
}
