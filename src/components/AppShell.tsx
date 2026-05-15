import { BarChart3, CalendarDays, Lightbulb, PiggyBank, Plus } from "lucide-react";
import type { ReactNode } from "react";

type TabKey = "home" | "details" | "insights";

type AppShellProps = {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onAddTransaction: () => void;
  children: ReactNode;
};

const tabs = [
  { key: "home", label: "Resumo", icon: BarChart3 },
  { key: "details", label: "Gastos", icon: CalendarDays },
  { key: "insights", label: "Insights", icon: Lightbulb },
] as const;

export function AppShell({ activeTab, onTabChange, onAddTransaction, children }: AppShellProps) {
  return (
    <main className="app-shell">
      <section className="app-frame" aria-label="Bora Economizar">
        <header className="topbar">
          <div className="brand">
            <span className="brand-icon"><PiggyBank size={22} /></span>
            <h1>Bora Economizar</h1>
          </div>
          <button className="icon-button" onClick={onAddTransaction} aria-label="Adicionar movimentação" type="button">
            <Plus size={22} />
          </button>
        </header>

        <nav className="tabs" aria-label="Abas principais">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              className={`tab ${activeTab === key ? "active" : ""}`}
              key={key}
              onClick={() => onTabChange(key)}
              type="button"
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {children}
      </section>

    </main>
  );
}

