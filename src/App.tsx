import { useState, useEffect } from "react";
import { PiggyBank } from "lucide-react";
import { AppShell } from "./components/AppShell";
import { DetailsScreen } from "./components/DetailsScreen";
import { InsightsScreen } from "./components/InsightsScreen";
import { SettingsModal } from "./components/SettingsModal";
import { SummaryScreen } from "./components/SummaryScreen";
import { TransactionModal } from "./components/TransactionModal";
import type { Transaction } from "./types";

type TabKey = "home" | "details" | "insights";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
  const [profileId, setProfileId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [fixedIncome, setFixedIncome] = useState(7800);
  const [savingsGoalPercent, setSavingsGoalPercent] = useState(30);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic current month
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

  const loadData = async () => {
    try {
      setIsLoading(true);
      const profRes = await fetch("/api/profile");
      if (!profRes.ok) throw new Error("Failed to load profile");
      const profData = await profRes.json();
      
      if (profData.profile?.id) {
        const pId = profData.profile.id;
        setProfileId(pId);
        
        const [transRes, setRes] = await Promise.all([
           fetch("/api/transactions"),
           fetch(`/api/settings?profileId=${pId}&month=${currentMonth}`)
        ]);
        
        const transData = await transRes.json();
        if (transData.transactions) {
          setTransactions(transData.transactions.map((t: any) => ({
            id: t.id,
            date: t.transaction_date.split('T')[0],
            title: t.title,
            category: t.category_name || "Outros",
            category_color: t.category_color,
            amount: Number(t.amount),
            type: t.type,
            icon: t.category_icon || "circle",
            isRecurring: t.is_recurring
          })));
        }

        const setData = await setRes.json();
        if (setData.settings) {
          setFixedIncome(Number(setData.settings.fixed_income));
          setSavingsGoalPercent(Number(setData.settings.savings_goal_percent));
        }
      }
    } catch (err) {
       console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  async function handleSaveTransaction(transaction: Transaction) {
    if (!profileId) return;
    
    // We don't have full category mapping in UI yet, so we send null or default
    const isEditing = !!editingTransaction;
    const method = isEditing ? "PUT" : "POST";
    
    try {
      await fetch("/api/transactions", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: isEditing ? transaction.id : undefined,
          profileId,
          type: transaction.type,
          title: transaction.title,
          categoryName: transaction.category,
          amount: transaction.amount,
          transactionDate: transaction.date,
          isRecurring: transaction.isRecurring
        })
      });
      await loadData();
    } catch (err) {
      console.error(err);
    }
    
    setEditingTransaction(null);
    setIsTransactionOpen(false);
  }

  function handleEditTransaction(transaction: Transaction) {
    setEditingTransaction(transaction);
    setIsTransactionOpen(true);
  }

  async function handleDeleteTransaction(transactionId: string) {
    try {
      await fetch(`/api/transactions?id=${transactionId}`, { method: "DELETE" });
      await loadData();
    } catch (err) {
      console.error(err);
    }
  }

  function handleAddTransaction() {
    setEditingTransaction(null);
    setIsTransactionOpen(true);
  }

  async function handleSaveSettings(settings: { fixedIncome: number, savingsGoalPercent: number }) {
    if (!profileId) return;
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId,
          month: currentMonth,
          fixedIncome: settings.fixedIncome,
          savingsGoalPercent: settings.savingsGoalPercent
        })
      });
      setFixedIncome(settings.fixedIncome);
      setSavingsGoalPercent(settings.savingsGoalPercent);
      setIsSettingsOpen(false);
    } catch (err) {
      console.error(err);
    }
  }

  if (isLoading) {
    return (
      <div className="splash-screen">
        <div className="splash-logo">
          <PiggyBank size={40} />
        </div>
        <h1 className="splash-title">Bora Economizar</h1>
        <div className="splash-dots">
          <span /><span /><span />
        </div>
      </div>
    );
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
      {activeTab === "insights" && (
        <InsightsScreen 
          transactions={transactions} 
          fixedIncome={fixedIncome}
          savingsGoalPercent={savingsGoalPercent}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          fixedIncome={fixedIncome}
          savingsGoalPercent={savingsGoalPercent}
          onClose={() => setIsSettingsOpen(false)}
          onSave={handleSaveSettings}
        />
      )}

      {isTransactionOpen && (
        <TransactionModal
          transaction={editingTransaction}
          defaultDate={selectedDay ? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}` : `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`}
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
