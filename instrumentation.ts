export async function register() {
  // Node.js ランタイムのみ（Edge ランタイムでは実行しない）
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const databaseUrl =
    process.env.DATABASE_URL_UNPOOLED ??
    process.env.POSTGRES_URL_NON_POOLING ??
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.NETLIFY_DATABASE_URL;

  if (!databaseUrl) {
    console.warn("[instrumentation] DATABASE_URL が設定されていないためマイグレーションをスキップします");
    return;
  }

  try {
    const { neon } = await import("@neondatabase/serverless");
    const { drizzle } = await import("drizzle-orm/neon-http");
    const { migrate } = await import("drizzle-orm/neon-http/migrator");
    const path = await import("path");

    const sql = neon(databaseUrl);
    const db = drizzle({ client: sql });

    await migrate(db, {
      migrationsFolder: path.join(process.cwd(), "drizzle"),
    });

    console.log("[instrumentation] マイグレーション完了");
  } catch (err) {
    console.error("[instrumentation] マイグレーション失敗:", err);
  }
}
