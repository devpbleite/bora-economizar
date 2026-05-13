import { AlertCircle, CalendarCheck, TrendingUp } from "lucide-react";
import { categorySummaries } from "../data/demoData";
import type { Transaction } from "../types";
import { formatCurrency } from "../utils/format";

type InsightsScreenProps = {
  transactions: Transaction[];
};

export function InsightsScreen({ transactions }: InsightsScreenProps) {
  const income = transactions.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amount, 0);
  const expenses = Math.abs(transactions.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amount, 0));
  const expectedReserve = Math.max(income - expenses, 0);

  return (
    <section className="screen active">
      <section className="insight-hero">
        <TrendingUp size={23} />
        <span>Previsao de fechamento</span>
        <strong>{formatCurrency(expectedReserve)}</strong>
        <small>Reserva esperada se mantiver o ritmo atual</small>
      </section>

      <div className="progress-list">
        <article className="progress-card">
          <div>
            <h2>Meta de economia</h2>
            <span>73% concluida</span>
          </div>
          <div className="bar"><i style={{ width: "73%" }} /></div>
        </article>

        {categorySummaries.map((category) => {
          const percent = Math.round((category.amount / category.budget) * 100);

          return (
            <article className="progress-card" key={category.name}>
              <div>
                <h2>{category.name}</h2>
                <span>{formatCurrency(category.amount)} de {formatCurrency(category.budget)}</span>
              </div>
              <div className="bar">
                <i style={{ width: `${percent}%`, background: category.color }} />
              </div>
            </article>
          );
        })}
      </div>

      <section className="panel">
        <div className="chart-heading">
          <AlertCircle size={19} />
          <h2>Alertas inteligentes</h2>
        </div>
        <div className="insight-list">
          <p>O gasto com delivery subiu 22% contra abril.</p>
          <p>Ha 9 dias sem compras parceladas novas.</p>
          <p><CalendarCheck size={16} /> Melhor dia para revisar contas fixas: 25/05.</p>
        </div>
      </section>
    </section>
  );
}
