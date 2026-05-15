import { AlertCircle, CalendarCheck, TrendingUp } from "lucide-react";
import type { Transaction } from "../types";
import { formatCurrency } from "../utils/format";

type InsightsScreenProps = {
  transactions: Transaction[];
  fixedIncome: number;
  savingsGoalPercent: number;
};

export function InsightsScreen({ transactions, fixedIncome, savingsGoalPercent }: InsightsScreenProps) {
  const income = transactions.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amount, 0);
  const expenses = Math.abs(transactions.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amount, 0));
  const expectedReserve = Math.max(income - expenses, 0);
  
  const goalAmount = fixedIncome * (savingsGoalPercent / 100);
  const savingsProgress = goalAmount > 0 ? Math.min(Math.round((expectedReserve / goalAmount) * 100), 100) : 0;

  const expensesList = transactions.filter(t => t.type === "expense");
  const expensesByCategory = expensesList.reduce((acc, t) => {
    // We use title as fallback if category is not present, though it should be.
    const catName = t.category || "Outros";
    if (!acc[catName]) {
      acc[catName] = { amount: 0, color: t.category_color || "#ff8f8b", name: catName };
    }
    acc[catName].amount += Math.abs(t.amount);
    return acc;
  }, {} as Record<string, {amount: number, color: string, name: string}>);

  const categorySummaries = Object.values(expensesByCategory).map(c => ({
    ...c,
    budget: Math.round(Math.max(c.amount * 1.3, 500)) // Simulated budget for visual progress
  })).sort((a, b) => b.amount - a.amount);

  const alerts = [];
  const deliverySum = expensesList.filter(t => t.title.toLowerCase().includes('delivery') || t.title.toLowerCase().includes('ifood')).reduce((s, t) => s + Math.abs(t.amount), 0);
  if (deliverySum > 100) alerts.push(`O gasto com delivery já passou de ${formatCurrency(100)} este mês.`);
  if (expectedReserve < goalAmount) alerts.push(`Atenção: sua reserva projetada está abaixo da meta de ${savingsGoalPercent}%.`);
  if (alerts.length === 0) alerts.push("Tudo sob controle! Nenhum alerta grave este mês.");

  return (
    <section className="screen active insights-screen">
      <article className="hero-card">
        <div className="hero-icon">
          <TrendingUp size={23} color="#1e4b39" />
        </div>
        <span>Previsao de fechamento</span>
        <strong>{formatCurrency(expectedReserve)}</strong>
        <small>Reserva esperada se mantiver o ritmo atual</small>
      </article>

      <div className="progress-list">
        <article className="progress-card">
          <div>
            <h2>Meta de economia</h2>
            <span>{savingsProgress}% concluida</span>
          </div>
          <div className="bar"><i style={{ width: `${savingsProgress}%`, background: '#57c99a' }} /></div>
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
          {alerts.map((alert, i) => (
             <p key={i}>{alert}</p>
          ))}
          <p><CalendarCheck size={16} /> Melhor dia para revisar contas fixas: 25/05.</p>
        </div>
      </section>
    </section>
  );
}
