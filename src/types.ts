export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  date: string;
  title: string;
  category: string;
  amount: number;
  type: TransactionType;
  icon: string;
  category_color?: string;
  notes?: string;
  isRecurring?: boolean;
};

export type CategorySummary = {
  name: string;
  amount: number;
  budget: number;
  color: string;
};
