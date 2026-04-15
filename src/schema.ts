import {
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  boolean,
  date,
} from "drizzle-orm/pg-core";

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
});

// プロジェクトテーブル
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
});

// タスクテーブル
export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("todo"), // 'todo' | 'in_progress' | 'done'
  priority: text("priority").notNull().default("medium"), // 'high' | 'medium' | 'low'
  dueDate: date("due_date"),
  completed: boolean("completed").notNull().default(false),
  projectId: uuid("project_id").references(() => projects.id),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
});
