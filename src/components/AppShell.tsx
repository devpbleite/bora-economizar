import { BarChart3, CalendarDays, Lightbulb, Plus } from "lucide-react";
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
          <div>
            <span className="eyebrow">Maio 2026</span>
            <h1>Bora Economizar</h1>
          </div>
          <button className="icon-button" onClick={onAddTransaction} aria-label="Adicionar movimentacao" type="button">
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

      <aside className="desktop-notes">
        <span className="eyebrow">Fluxo definido</span>
        <h2>Controle leve para virar rotina</h2>
        <p>
          Lancamentos diarios, metas mensais e leituras rapidas. A base ja nasce
          preparada para Vercel Functions e NeonDB quando conectarmos o banco.
        </p>
        <div className="roadmap">
          <strong>Stack fechada</strong>
          <p>React + Vite + TypeScript, Vercel Functions, NeonDB e lucide-react.</p>
        </div>
      </aside>
    </main>
  );
}
