import { useState } from "react";
import { ArrowUp, ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";
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
const monthNames = [
  "Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export function DetailsScreen({
  transactions,
  selectedDay,
  onSelectDay,
  onEditTransaction,
  onDeleteTransaction,
}: DetailsScreenProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed
  const [showScrollTop, setShowScrollTop] = useState(false);

  const todayDay = today.getDate();
  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  // Calendar math
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sunday

  // Filter transactions for the viewed month
  const monthTransactions = transactions.filter((t) => {
    const [tYear, tMonth] = t.date.split("-").map(Number);
    return tYear === viewYear && tMonth === viewMonth + 1;
  });

  const filtered = selectedDay
    ? monthTransactions.filter((transaction) => getDayFromDate(transaction.date) === selectedDay)
    : monthTransactions;

  function goToPrevMonth() {
    onSelectDay(null);
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function goToNextMonth() {
    onSelectDay(null);
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  function handleScroll(e: React.UIEvent<HTMLElement>) {
    setShowScrollTop(e.currentTarget.scrollTop > 300);
  }

  function scrollToTop() {
    document.querySelector(".details-screen")?.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section className="screen active details-screen" onScroll={handleScroll}>
      <section className="calendar-card compact">
        <div className="month-row">
          <button className="mini-button" aria-label="Mes anterior" type="button" onClick={goToPrevMonth}>
            <ChevronLeft size={18} />
          </button>
          <h2>{monthNames[viewMonth]} {viewYear}</h2>
          <button className="mini-button" aria-label="Proximo mes" type="button" onClick={goToNextMonth}>
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="calendar">
          {weekDays.map((label, index) => (
            <div className="weekday" key={`${label}-${index}`}>{label}</div>
          ))}
          {Array.from({ length: firstDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const dayTransactions = monthTransactions.filter((transaction) => getDayFromDate(transaction.date) === day);
            const hasIncome = dayTransactions.some((transaction) => transaction.type === "income");
            const hasExpense = dayTransactions.some((transaction) => transaction.type === "expense");
            const isToday = isCurrentMonth && day === todayDay;

            return (
              <button
                className={`day ${dayTransactions.length ? "has-move" : ""} ${selectedDay === day ? "selected" : ""} ${isToday ? "today" : ""}`}
                key={day}
                onClick={() => onSelectDay(selectedDay === day ? null : day)}
                type="button"
              >
                <span>{day}</span>
                {dayTransactions.length > 0 && (
                  <i className="day-markers" aria-hidden="true">
                    {hasIncome && <b className="income-marker" />}
                    {hasExpense && <b className="expense-marker" />}
                  </i>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <section className="transactions-panel">
        <div className="panel-header">
          <div>
            <h2>{selectedDay ? `Movimentacoes do dia ${selectedDay}` : "Movimentacoes do mes"}</h2>
            <span>
              {filtered.length} lancamento{filtered.length === 1 ? "" : "s"} registrado{filtered.length === 1 ? "" : "s"}
            </span>
          </div>
          <button className="soft-button" onClick={() => onSelectDay(null)} type="button">Todos</button>
        </div>

        <div className="transaction-list">
          {filtered.length === 0 && (
            <p className="empty-state">Nenhuma movimentacao neste periodo.</p>
          )}
          {filtered.map((transaction) => (
            <article className={`transaction ${transaction.type} compact`} key={transaction.id}>
              <IconBadge icon={transaction.icon} type={transaction.type} />
              <div className="tx-info">
                <h3>{transaction.title}</h3>
                <span>{formatShortDate(transaction.date)} · {transaction.category}</span>
              </div>
              <strong className={`amount ${transaction.amount >= 0 ? "positive" : "negative"}`}>
                {transaction.amount >= 0 ? "+" : ""}{formatCurrency(transaction.amount)}
              </strong>
              <div className="item-actions">
                <button onClick={() => onEditTransaction(transaction)} aria-label={`Editar ${transaction.title}`} type="button">
                  <Pencil size={14} />
                </button>
                <button onClick={() => onDeleteTransaction(transaction.id)} aria-label={`Excluir ${transaction.title}`} type="button">
                  <Trash2 size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {showScrollTop && (
        <button className="scroll-top-btn" onClick={scrollToTop} type="button" aria-label="Voltar ao topo">
          <ArrowUp size={20} />
        </button>
      )}
    </section>
  );
}
