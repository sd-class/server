import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  identity: text().notNull().unique(),
  tel: text().notNull(),
  email: text().notNull(),
  passwordHash: text().notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: int("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  lastActiveAt: int("last_active_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
