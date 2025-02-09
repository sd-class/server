import "dotenv/config";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { eq } from "drizzle-orm";
import { usersTable } from "./db/schema";

const db = drizzle(process.env.DB_FILE_NAME!);

async function main() {
  const user: typeof usersTable.$inferInsert = {
    name: "John",
    age: 30,
    email: "john@example.com",
  };

  await db.insert(usersTable).values(user);
  console.log("New user created!");

  const users = await db.select().from(usersTable);
  console.log("Getting all users from the database: ", users);
  /*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */

  await db
    .update(usersTable)
    .set({
      age: 31,
    })
    .where(eq(usersTable.email, user.email));
  console.log("User info updated!");

  await db.delete(usersTable).where(eq(usersTable.email, user.email));
  console.log("User deleted!");

  Bun.serve({
    fetch(req, server) {
      // upgrade the request to a WebSocket
      if (server.upgrade(req)) {
        return; // do not return a Response
      }
      return new Response("Upgrade failed", { status: 500 });
    },
    websocket: {
      message(ws, message) {
        ws.send(message); // echo back the message
      }, // a message is received
      open(ws) {}, // a socket is opened
      close(ws, code, message) {}, // a socket is closed
      drain(ws) {}, // the socket is ready to receive more data
    }, // handlers
  });
}

main();
