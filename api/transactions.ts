import { getSql } from "./_db";
import type { ApiRequest, ApiResponse } from "./types";

type CreateTransactionBody = {
  id?: string;
  profileId?: string;
  categoryId?: string;
  type?: "income" | "expense";
  title?: string;
  amount?: number;
  transactionDate?: string;
  notes?: string;
  isRecurring?: boolean;
};

export default async function handler(request: ApiRequest<any>, response: ApiResponse) {
  try {
    const sql = getSql();

    if (request.method === "GET") {
      const rows = await sql`
        select
          t.id,
          t.type,
          t.title,
          t.amount,
          t.transaction_date,
          t.notes,
          t.is_recurring,
          t.created_at,
          c.name as category_name,
          c.icon as category_icon,
          c.color as category_color,
          t.category_id
        from transactions t
        left join categories c on t.category_id = c.id
        order by t.transaction_date desc, t.created_at desc
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

    if (request.method === "PUT") {
      const { id, categoryId, type, title, amount, transactionDate, notes, isRecurring } = request.body;

      if (!id) {
        return response.status(400).json({ error: "Missing transaction id" });
      }

      const rows = await sql`
        update transactions set
          category_id = ${categoryId ?? null},
          type = ${type},
          title = ${title},
          amount = ${amount},
          transaction_date = ${transactionDate},
          notes = ${notes ?? null},
          is_recurring = ${Boolean(isRecurring)}
        where id = ${id}
        returning *
      `;

      if (rows.length === 0) return response.status(404).json({ error: "Transaction not found" });
      return response.status(200).json({ transaction: rows[0] });
    }

    if (request.method === "DELETE") {
      const { id } = request.query;

      if (!id) {
        return response.status(400).json({ error: "Missing transaction id" });
      }

      await sql`delete from transactions where id = ${id}`;
      return response.status(204).end();
    }

    response.setHeader("Allow", "GET, POST, PUT, DELETE");
    return response.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return response.status(500).json({
      error: error instanceof Error ? error.message : "Unexpected error",
    });
  }
}
