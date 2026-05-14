import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { categories } from "../data/demoData";
import type { Transaction, TransactionType } from "../types";

type TransactionModalProps = {
  transaction?: Transaction | null;
  defaultDate: string;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
};

export function TransactionModal({ transaction, defaultDate, onClose, onSave }: TransactionModalProps) {
  const [type, setType] = useState<TransactionType>(transaction?.type ?? "expense");
  const availableCategories = useMemo(() => categories.filter((category) => category.type === type), [type]);
  const [title, setTitle] = useState(transaction?.title ?? "");
  const [category, setCategory] = useState(transaction?.category ?? availableCategories[0].name);
  const [amount, setAmount] = useState(String(Math.abs(transaction?.amount ?? 0)));
  const [date, setDate] = useState(transaction?.date ?? defaultDate);
  const [notes, setNotes] = useState(transaction?.notes ?? "");
  const [isRecurring, setIsRecurring] = useState(Boolean(transaction?.isRecurring));

  const selectedCategoryName = availableCategories.some((item) => item.name === category)
    ? category
    : availableCategories[0].name;

  function handleTypeChange(nextType: TransactionType) {
    setType(nextType);
    const nextCategory = categories.find((item) => item.type === nextType);
    if (nextCategory) {
      setCategory(nextCategory.name);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const selectedCategory = categories.find((item) => item.name === selectedCategoryName);
    const numericAmount = Number(amount);

    onSave({
      id: transaction?.id ?? crypto.randomUUID(),
      type,
      title: title.trim(),
      category: selectedCategoryName,
      amount: type === "expense" ? -Math.abs(numericAmount) : Math.abs(numericAmount),
      date,
      notes: notes.trim() || undefined,
      isRecurring,
      icon: selectedCategory?.icon ?? "wallet",
    });
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <form className="modal" onSubmit={handleSubmit}>
        <div className="modal-header">
          <div>
            <span className="eyebrow">Movimentacao</span>
            <h2>{transaction ? "Editar item" : "Novo lancamento"}</h2>
          </div>
          <button className="ghost-icon" onClick={onClose} type="button" aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <div className="segmented">
          <button className={type === "expense" ? "active" : ""} onClick={() => handleTypeChange("expense")} type="button">Despesa</button>
          <button className={type === "income" ? "active" : ""} onClick={() => handleTypeChange("income")} type="button">Receita</button>
        </div>

        <label className="field">
          <span>Nome da movimentacao</span>
          <input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex: Mercado" />
        </label>

        <div className="form-grid">
          <label className="field">
            <span>Categoria</span>
            <div className="select-shell">
              <select value={selectedCategoryName} onChange={(event) => setCategory(event.target.value)}>
                {availableCategories.map((item) => (
                  <option key={item.name} value={item.name}>{item.name}</option>
                ))}
              </select>
            </div>
          </label>

          <label className="field">
            <span>Valor</span>
            <input min="0.01" required step="0.01" type="number" value={amount} onChange={(event) => setAmount(event.target.value)} />
          </label>
        </div>

        <label className="field">
          <span>Data</span>
          <input required type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>

        <label className="field">
          <span>Observacao</span>
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Opcional" rows={3} />
        </label>

        <label className="check-row">
          <input checked={isRecurring} type="checkbox" onChange={(event) => setIsRecurring(event.target.checked)} />
          <span>Repetir todo mes</span>
        </label>

        <div className="modal-actions">
          <button className="secondary-button" onClick={onClose} type="button">Cancelar</button>
          <button className="primary-button" type="submit">Salvar</button>
        </div>
      </form>
    </div>
  );
}
