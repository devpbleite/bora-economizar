import type { CategorySummary, Transaction } from "../types";

export const transactions: Transaction[] = [
  { id: "1", date: "2026-05-01", title: "Salario", category: "Receita fixa", amount: 7800, type: "income", icon: "briefcase", isRecurring: true },
  { id: "2", date: "2026-05-02", title: "Mercado", category: "Casa", amount: -286.4, type: "expense", icon: "shopping" },
  { id: "3", date: "2026-05-03", title: "Farmacia", category: "Saude", amount: -74.9, type: "expense", icon: "heart" },
  { id: "4", date: "2026-05-05", title: "Freela", category: "Extra", amount: 400, type: "income", icon: "sparkles" },
  { id: "5", date: "2026-05-07", title: "Internet", category: "Conta fixa", amount: -119.9, type: "expense", icon: "wifi", isRecurring: true },
  { id: "6", date: "2026-05-08", title: "Delivery", category: "Alimentacao", amount: -62.5, type: "expense", icon: "utensils" },
  { id: "7", date: "2026-05-11", title: "Transporte", category: "Rotina", amount: -48.8, type: "expense", icon: "car" },
  { id: "8", date: "2026-05-13", title: "Academia", category: "Saude", amount: -129.9, type: "expense", icon: "dumbbell", isRecurring: true },
  { id: "9", date: "2026-05-16", title: "Presente", category: "Lazer", amount: -180, type: "expense", icon: "gift" },
  { id: "10", date: "2026-05-18", title: "Cashback", category: "Receita", amount: 20, type: "income", icon: "wallet" },
  { id: "11", date: "2026-05-21", title: "Mercado", category: "Casa", amount: -241.2, type: "expense", icon: "shopping" },
  { id: "12", date: "2026-05-24", title: "Cinema", category: "Lazer", amount: -96, type: "expense", icon: "ticket" },
  { id: "13", date: "2026-05-27", title: "Luz", category: "Conta fixa", amount: -211.7, type: "expense", icon: "zap", isRecurring: true },
  { id: "14", date: "2026-05-29", title: "Reserva", category: "Investimento", amount: -900, type: "expense", icon: "piggy" },
];

export const categories = [
  { name: "Receita fixa", type: "income", icon: "briefcase" },
  { name: "Extra", type: "income", icon: "sparkles" },
  { name: "Receita", type: "income", icon: "wallet" },
  { name: "Casa", type: "expense", icon: "shopping" },
  { name: "Alimentacao", type: "expense", icon: "utensils" },
  { name: "Conta fixa", type: "expense", icon: "zap" },
  { name: "Saude", type: "expense", icon: "heart" },
  { name: "Rotina", type: "expense", icon: "car" },
  { name: "Lazer", type: "expense", icon: "ticket" },
  { name: "Investimento", type: "expense", icon: "piggy" },
] as const;

export const categorySummaries: CategorySummary[] = [
  { name: "Mercado", amount: 812, budget: 1050, color: "#ff8f8b" },
  { name: "Lazer", amount: 388, budget: 650, color: "#9486f2" },
  { name: "Contas", amount: 732, budget: 900, color: "#5fa8ff" },
  { name: "Saude", amount: 205, budget: 420, color: "#57c99a" },
];

export const donutData = [
  { name: "Livre", value: 3420.8, fill: "#57c99a" },
  { name: "Despesas", value: 4779.2, fill: "#ff8f8b" },
  { name: "Meta", value: 2340, fill: "#5fa8ff" },
];
