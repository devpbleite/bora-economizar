import { X } from "lucide-react";
import { useState } from "react";

type SettingsModalProps = {
  fixedIncome: number;
  savingsGoalPercent: number;
  onClose: () => void;
  onSave: (settings: { fixedIncome: number; savingsGoalPercent: number }) => void;
};

export function SettingsModal({ fixedIncome, savingsGoalPercent, onClose, onSave }: SettingsModalProps) {
  const [income, setIncome] = useState(String(fixedIncome));
  const [goal, setGoal] = useState(String(savingsGoalPercent));

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({
      fixedIncome: Number(income),
      savingsGoalPercent: Number(goal),
    });
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <form className="modal" onSubmit={handleSubmit}>
        <div className="modal-header">
          <div>
            <span className="eyebrow">Planejamento</span>
            <h2>Renda e meta</h2>
          </div>
          <button className="ghost-icon" onClick={onClose} type="button" aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <label className="field">
          <span>Renda fixa do mes</span>
          <input min="0" step="0.01" type="number" value={income} onChange={(event) => setIncome(event.target.value)} />
        </label>

        <label className="field">
          <span>Meta para guardar (%)</span>
          <input max="100" min="0" step="1" type="number" value={goal} onChange={(event) => setGoal(event.target.value)} />
        </label>

        <div className="modal-actions">
          <button className="secondary-button" onClick={onClose} type="button">Cancelar</button>
          <button className="primary-button" type="submit">Salvar</button>
        </div>
      </form>
    </div>
  );
}
