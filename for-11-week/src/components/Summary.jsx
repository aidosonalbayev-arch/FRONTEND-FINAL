// src/components/Summary.jsx
// Карточки с общей статистикой
export function Summary({ expenses }) {
  const fmt = (n) =>
    n.toLocaleString("ru-RU", { maximumFractionDigits: 0 }) + " ₸";
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const maxExp = expenses.length
    ? Math.max(...expenses.map((e) => e.amount))
    : 0;
  const avgExp = expenses.length ? total / expenses.length : 0;

  return (
    <div className="summary-grid">
      <div className="metric">
        <p className="metric-label">Всего потрачено</p>
        <p className="metric-value">{fmt(total)}</p>
      </div>
      <div className="metric">
        <p className="metric-label">Макс. расход</p>
        <p className="metric-value">{fmt(maxExp)}</p>
      </div>
      <div className="metric">
        <p className="metric-label">Средний расход</p>
        <p className="metric-value">{fmt(avgExp)}</p>
      </div>
    </div>
  );
}
