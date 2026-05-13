import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

async function loadEnvFile(path) {
  try {
    const file = await readFile(path, "utf8");
    for (const line of file.split(/\r?\n/)) {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (!match) continue;
      const [, key, rawValue] = match;
      process.env[key] ??= rawValue.replace(/^"|"$/g, "");
    }
  } catch {
    // The script can also run with DATABASE_URL already set by the host.
  }
}

await loadEnvFile(".env.local");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not configured");
}

const schema = await readFile("db/schema.sql", "utf8");
const statements = schema
  .split(";")
  .map((statement) => statement.trim())
  .filter(Boolean);

const sql = neon(process.env.DATABASE_URL);

for (const statement of statements) {
  await sql.query(statement);
}

console.log(`Applied ${statements.length} database statements.`);
