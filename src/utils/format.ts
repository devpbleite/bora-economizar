export function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function getDayFromDate(date: string) {
  return Number(date.slice(8, 10));
}

export function formatShortDate(date: string) {
  const [year, month, day] = date.split("-");

  return `${day}/${month}/${year.slice(2)}`;
}
