import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

// 既存テーブル（サンプル用、削除しない）
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
});

// 備品テーブル
export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  quantity: integer("quantity").default(1).notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
});

// 利用者テーブル
export const appUsers = pgTable("app_users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
});

// 貸出記録テーブル
export const loans = pgTable("loans", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id")
    .notNull()
    .references(() => items.id),
  userId: integer("user_id")
    .notNull()
    .references(() => appUsers.id),
  borrowedAt: timestamp("borrowed_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  returnedAt: timestamp("returned_at", { mode: "date", withTimezone: true }),
});
