import { getSql } from "./_db";
import type { ApiRequest, ApiResponse } from "./types";

type CreateTransactionBody = {
  profileId?: string;
  categoryId?: string;
  type?: "income" | "expense";
  title?: string;
  amount?: number;
  transactionDate?: string;
  notes?: string;
  isRecurring?: boolean;
};

export default async function handler(request: ApiRequest<CreateTransactionBody>, response: ApiResponse) {
  try {
    const sql = getSql();

    if (request.method === "GET") {
      const rows = await sql`
        select
          id,
          type,
          title,
          amount,
          transaction_date,
          notes,
          is_recurring,
          created_at
        from transactions
        order by transaction_date desc, created_at desc
        limit 200
      `;

      return response.status(200).json({ transactions: rows });
    }

    if (request.method === "POST") {
      const { profileId, categoryId, type, title, amount, transactionDate, notes, isRecurring } = request.body;

      if (!profileId || !type || !title || !amount || !transactionDate) {
        return response.status(400).json({ error: "Missing required transaction fields" });
      }

      const rows = await sql`
        insert into transactions (
          profile_id,
          category_id,
          type,
          title,
          amount,
          transaction_date,
          notes,
          is_recurring
        )
        values (
          ${profileId},
          ${categoryId ?? null},
          ${type},
          ${title},
          ${amount},
          ${transactionDate},
          ${notes ?? null},
          ${Boolean(isRecurring)}
        )
        returning *
      `;

      return response.status(201).json({ transaction: rows[0] });
    }

    response.setHeader("Allow", "GET, POST");
    return response.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return response.status(500).json({
      error: error instanceof Error ? error.message : "Unexpected error",
    });
  }
}
