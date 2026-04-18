export function Summary({ expenses }) {
  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="summary-grid">
      <div className="metric">
        <p className="metric-label">Всего потрачено</p>
        <p className="metric-value">{total}</p>
      </div>
    </div>
  );
}
