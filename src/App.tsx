import { useState } from "react";
import { AppShell } from "./components/AppShell";
import { DetailsScreen } from "./components/DetailsScreen";
import { InsightsScreen } from "./components/InsightsScreen";
import { SettingsModal } from "./components/SettingsModal";
import { SummaryScreen } from "./components/SummaryScreen";
import { TransactionModal } from "./components/TransactionModal";
import { transactions as demoTransactions } from "./data/demoData";
import type { Transaction } from "./types";

type TabKey = "home" | "details" | "insights";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(demoTransactions);
  const [fixedIncome, setFixedIncome] = useState(7800);
  const [savingsGoalPercent, setSavingsGoalPercent] = useState(30);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  function handleSaveTransaction(transaction: Transaction) {
    setTransactions((current) => {
      const exists = current.some((item) => item.id === transaction.id);
      const next = exists
        ? current.map((item) => (item.id === transaction.id ? transaction : item))
        : [transaction, ...current];

      return [...next].sort((a, b) => a.date.localeCompare(b.date));
    });
    setEditingTransaction(null);
    setIsTransactionOpen(false);
  }

  function handleEditTransaction(transaction: Transaction) {
    setEditingTransaction(transaction);
    setIsTransactionOpen(true);
  }

  function handleDeleteTransaction(transactionId: string) {
    setTransactions((current) => current.filter((transaction) => transaction.id !== transactionId));
  }

  function handleAddTransaction() {
    setEditingTransaction(null);
    setIsTransactionOpen(true);
  }

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab} onAddTransaction={handleAddTransaction}>
      {activeTab === "home" && (
        <SummaryScreen
          transactions={transactions}
          fixedIncome={fixedIncome}
          savingsGoalPercent={savingsGoalPercent}
          onEditSettings={() => setIsSettingsOpen(true)}
        />
      )}
      {activeTab === "details" && (
        <DetailsScreen
          transactions={transactions}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          onEditTransaction={handleEditTransaction}
          onDeleteTransaction={handleDeleteTransaction}
        />
      )}
      {activeTab === "insights" && <InsightsScreen transactions={transactions} />}

      {isSettingsOpen && (
        <SettingsModal
          fixedIncome={fixedIncome}
          savingsGoalPercent={savingsGoalPercent}
          onClose={() => setIsSettingsOpen(false)}
          onSave={(settings) => {
            setFixedIncome(settings.fixedIncome);
            setSavingsGoalPercent(settings.savingsGoalPercent);
            setIsSettingsOpen(false);
          }}
        />
      )}

      {isTransactionOpen && (
        <TransactionModal
          transaction={editingTransaction}
          defaultDate={selectedDay ? `2026-05-${String(selectedDay).padStart(2, "0")}` : "2026-05-13"}
          onClose={() => {
            setEditingTransaction(null);
            setIsTransactionOpen(false);
          }}
          onSave={handleSaveTransaction}
        />
      )}
    </AppShell>
  );
}
