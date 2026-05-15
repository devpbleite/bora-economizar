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
  } catch {}
}

await loadEnvFile(".env");
await loadEnvFile(".env.local");

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is not set in .env");
  process.exit(1);
}

const sql = neon(databaseUrl);

async function init() {
  try {
    console.log("Creating default profile...");
    const profiles = await sql`
      INSERT INTO profiles (name)
      VALUES ('Esposa')
      RETURNING *
    `;
    const profileId = profiles[0].id;
    console.log("Profile created! ID:", profileId);

    console.log("Creating default categories...");
    const categoriesToInsert = [
      { name: 'Receita fixa', type: 'income', icon: 'briefcase', color: '#bdebd8' },
      { name: 'Extra', type: 'income', icon: 'sparkles', color: '#bdebd8' },
      { name: 'Receita', type: 'income', icon: 'wallet', color: '#bdebd8' },
      { name: 'Casa', type: 'expense', icon: 'shopping', color: '#ff8f8b' },
      { name: 'Alimentacao', type: 'expense', icon: 'utensils', color: '#ff8f8b' },
      { name: 'Conta fixa', type: 'expense', icon: 'zap', color: '#5fa8ff' },
      { name: 'Saude', type: 'expense', icon: 'heart', color: '#57c99a' },
      { name: 'Rotina', type: 'expense', icon: 'car', color: '#9486f2' },
      { name: 'Lazer', type: 'expense', icon: 'ticket', color: '#9486f2' },
      { name: 'Investimento', type: 'expense', icon: 'piggy', color: '#5fa8ff' }
    ];

    for (const cat of categoriesToInsert) {
      await sql`
        INSERT INTO categories (profile_id, name, type, icon, color)
        VALUES (${profileId}, ${cat.name}, ${cat.type}, ${cat.icon}, ${cat.color})
      `;
    }
    console.log("Default categories created!");

    console.log("Creating monthly settings for current month...");
    const today = new Date();
    // Use first day of the current month
    const monthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
    
    await sql`
      INSERT INTO monthly_settings (profile_id, month, fixed_income, savings_goal_percent)
      VALUES (${profileId}, ${monthStr}, 7800, 30)
    `;
    console.log("Monthly settings created!");
    
    // Save the profile ID to .env for the frontend to use
    console.log(`\n\n[IMPORTANTE] Adicione a seguinte linha no seu .env:\nVITE_DEFAULT_PROFILE_ID=${profileId}\n\n`);
  } catch (err) {
    console.error("Error during initialization:", err);
  }
}

init();
