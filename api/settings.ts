import { getSql } from "./_db";
import type { ApiRequest, ApiResponse } from "./types";

export default async function handler(request: ApiRequest<any>, response: ApiResponse) {
  try {
    const sql = getSql();

    if (request.method === "GET") {
      const { profileId, month } = request.query;
      if (!profileId || !month) {
        return response.status(400).json({ error: "Missing profileId or month" });
      }

      const rows = await sql`
        select
          id,
          profile_id,
          month,
          fixed_income,
          savings_goal_percent
        from monthly_settings
        where profile_id = ${profileId} and month = ${month}
      `;

      return response.status(200).json({ settings: rows[0] || null });
    }

    if (request.method === "POST") {
      const { profileId, month, fixedIncome, savingsGoalPercent } = request.body;

      if (!profileId || !month) {
        return response.status(400).json({ error: "Missing required fields" });
      }

      const rows = await sql`
        insert into monthly_settings (
          profile_id,
          month,
          fixed_income,
          savings_goal_percent
        )
        values (
          ${profileId},
          ${month},
          ${fixedIncome ?? 0},
          ${savingsGoalPercent ?? 30}
        )
        on conflict (profile_id, month) do update set
          fixed_income = excluded.fixed_income,
          savings_goal_percent = excluded.savings_goal_percent
        returning *
      `;

      return response.status(201).json({ settings: rows[0] });
    }

    response.setHeader("Allow", "GET, POST");
    return response.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return response.status(500).json({
      error: error instanceof Error ? error.message : "Unexpected error",
    });
  }
}
