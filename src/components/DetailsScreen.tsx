import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";
import type { Transaction } from "../types";
import { formatCurrency, formatShortDate, getDayFromDate } from "../utils/format";
import { IconBadge } from "./IconBadge";

type DetailsScreenProps = {
  transactions: Transaction[];
  selectedDay: number | null;
  onSelectDay: (day: number | null) => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (transactionId: string) => void;
};

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

export function DetailsScreen({
  transactions,
  selectedDay,
  onSelectDay,
  onEditTransaction,
  onDeleteTransaction,
}: DetailsScreenProps) {
  const filtered = selectedDay
    ? transactions.filter((transaction) => getDayFromDate(transaction.date) === selectedDay)
    : transactions;

  return (
    <section className="screen active details-screen">
      <section className="calendar-card">
        <div className="month-row">
          <button className="mini-button" aria-label="Mes anterior" type="button">
            <ChevronLeft size={18} />
          </button>
          <h2>Maio 2026</h2>
          <button className="mini-button" aria-label="Proximo mes" type="button">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="calendar">
          {weekDays.map((label, index) => (
            <div className="weekday" key={`${label}-${index}`}>{label}</div>
          ))}
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={`empty-${index}`} />
          ))}
          {Array.from({ length: 31 }).map((_, index) => {
            const day = index + 1;
            const hasTransaction = transactions.some((transaction) => getDayFromDate(transaction.date) === day);

            return (
              <button
                className={`day ${hasTransaction ? "has-move" : ""} ${selectedDay === day ? "selected" : ""}`}
                key={day}
                onClick={() => onSelectDay(selectedDay === day ? null : day)}
                type="button"
              >
                {day}
              </button>
            );
          })}
        </div>
      </section>

      <section className="transactions-panel">
        <div className="panel-header sticky">
          <div>
            <h2>{selectedDay ? `Movimentacoes do dia ${selectedDay}` : "Movimentacoes do mes"}</h2>
            <span>
              {filtered.length} lancamento{filtered.length === 1 ? "" : "s"} registrado{filtered.length === 1 ? "" : "s"}
            </span>
          </div>
          <button className="soft-button" onClick={() => onSelectDay(null)} type="button">Todos</button>
        </div>

        <div className="transaction-list">
          {filtered.map((transaction) => (
            <article className={`transaction ${transaction.type}`} key={transaction.id}>
              <IconBadge icon={transaction.icon} type={transaction.type} />
              <div>
                <h3>{transaction.title}</h3>
                <span>{formatShortDate(transaction.date)} · {transaction.category}</span>
              </div>
              <strong className={`amount ${transaction.amount >= 0 ? "positive" : "negative"}`}>
                {transaction.amount >= 0 ? "+" : ""}{formatCurrency(transaction.amount)}
              </strong>
              <div className="item-actions">
                <button onClick={() => onEditTransaction(transaction)} aria-label={`Editar ${transaction.title}`} type="button">
                  <Pencil size={15} />
                </button>
                <button onClick={() => onDeleteTransaction(transaction.id)} aria-label={`Excluir ${transaction.title}`} type="button">
                  <Trash2 size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
