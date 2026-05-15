import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ArrowDownRight, ArrowUpRight, Coins, Target } from "lucide-react";
import type { Transaction } from "../types";
import { formatCurrency } from "../utils/format";

type SummaryScreenProps = {
  transactions: Transaction[];
  fixedIncome: number;
  savingsGoalPercent: number;
  onEditSettings: () => void;
};

export function SummaryScreen({ transactions, fixedIncome, savingsGoalPercent, onEditSettings }: SummaryScreenProps) {
  const income = transactions.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amount, 0);
  const expenses = Math.abs(transactions.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amount, 0));
  const net = income - expenses;
  const goalPercent = savingsGoalPercent;
  const goalAmount = fixedIncome * (goalPercent / 100);

  // Calculate dynamic daily budget based on remaining days in the month
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const remainingDays = Math.max(lastDayOfMonth - today.getDate(), 1);
  const spendableAmount = Math.max(fixedIncome - goalAmount - expenses, 0);
  const dailyBudget = Math.round(spendableAmount / remainingDays);

  // Expense percentage relative to fixed income (or total income if available)
  const referenceIncome = Math.max(fixedIncome, income, 1);
  const expensePercent = Math.round((expenses / referenceIncome) * 100);
  const freePercent = Math.max(0, 100 - expensePercent);

  // Dynamic distribution message
  const isHealthy = expenses <= (fixedIncome - goalAmount);
  const distributionMessage = isHealthy
    ? "O mes esta saudavel: despesas abaixo do limite e reserva projetada acima da meta."
    : "Atencao: despesas acima do ideal. Revise seus gastos para atingir sua meta.";

  const donutData = [
    { name: "Livre", value: Math.max(spendableAmount, 0), fill: "#57c99a" },
    { name: "Despesas", value: expenses, fill: "#ff8f8b" },
    { name: "Meta", value: goalAmount, fill: "#5fa8ff" },
  ];

  return (
    <section className="screen active summary-screen">
      <article className="hero-card">
        <div className="hero-icon">
          <Coins size={23} />
        </div>
        <span>Saldo liquido do mes</span>
        <strong>{formatCurrency(net)}</strong>
        <small>Base: receita fixa de {formatCurrency(fixedIncome)}</small>
      </article>

      <div className="metric-grid">
        <article className="metric-card income">
          <ArrowUpRight size={20} />
          <span>Receitas</span>
          <strong>{formatCurrency(income)}</strong>
          <small>Salario + extras</small>
        </article>
        <article className="metric-card expense">
          <ArrowDownRight size={20} />
          <span>Despesas</span>
          <strong>{formatCurrency(expenses)}</strong>
          <small>{expensePercent}% do total</small>
        </article>
      </div>

      <section className="panel">
        <div className="panel-header">
          <h2>Plano do mes</h2>
          <button className="soft-button" onClick={onEditSettings} type="button">Editar renda</button>
        </div>
        <div className="salary-box">
          <div>
            <span>Receita fixa</span>
            <strong>{formatCurrency(fixedIncome)}</strong>
          </div>
          <div>
            <span>Meta guardar</span>
            <strong>{goalPercent}%</strong>
          </div>
        </div>
        <p className="daily-budget">
          Você pode gastar até <strong>{formatCurrency(dailyBudget)}/dia</strong> no restante do mês ({remainingDays} dias) para
          guardar {formatCurrency(goalAmount)}.
        </p>
      </section>

      <section className="panel chart-panel">
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={132}>
            <PieChart>
              <Pie data={donutData} innerRadius={39} outerRadius={58} paddingAngle={3} dataKey="value">
                {donutData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
          <span className="donut-center">{freePercent}%</span>
        </div>
        <div className="chart-copy">
          <div className="chart-heading">
            <Target size={19} />
            <h2>Distribuicao</h2>
          </div>
          <p>{distributionMessage}</p>
          <ul>
            <li><span className="dot blue" />Meta {goalPercent}%</li>
            <li><span className="dot coral" />Despesas {expensePercent}%</li>
            <li><span className="dot green" />Livre {freePercent}%</li>
          </ul>
        </div>
      </section>
    </section>
  );
}
