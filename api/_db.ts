import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;

let sql: postgres.Sql | null = null;

export function getSql() {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (!sql) {
    sql = postgres(databaseUrl, { ssl: "require" });
  }

  return sql;
}
