import { getSql } from "./_db.js";
import type { ApiRequest, ApiResponse } from "./types.js";

export default async function handler(request: ApiRequest<any>, response: ApiResponse) {
  try {
    const sql = getSql();
    if (request.method === "GET") {
      let rows = await sql`select id, name from profiles order by created_at asc limit 1`;
      
      if (rows.length === 0) {
        // Auto-seed profile and categories if missing
        const inserted = await sql`insert into profiles (name) values ('Esposa') returning id, name`;
        const profileId = inserted[0].id;
        
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

        const today = new Date();
        const monthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
        
        await sql`
          INSERT INTO monthly_settings (profile_id, month, fixed_income, savings_goal_percent)
          VALUES (${profileId}, ${monthStr}, 7800, 30)
        `;

        rows = inserted;
      }

      return response.status(200).json({ profile: rows[0] || null });
    }
    return response.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return response.status(500).json({
      error: error instanceof Error ? error.message : "Unexpected error",
    });
  }
}
