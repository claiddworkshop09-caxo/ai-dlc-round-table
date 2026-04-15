import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as schema from "./schema";

config({ path: ".env" });
config({ path: ".env.local", override: true });

// ランタイム用: Neon HTTP ドライバは pooler 接続でも動作する
const databaseUrl =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.NETLIFY_DATABASE_URL;
const sql = neon(databaseUrl!);
export const db = drizzle({ client: sql, schema });
