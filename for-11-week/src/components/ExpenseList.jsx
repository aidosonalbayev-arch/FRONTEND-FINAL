// src/components/ExpenseList.jsx
// Список расходов с фильтрацией по категории и удалением
import { useState } from "react";
import { useExpenses } from "../context/ExpenseContext";

export function ExpenseList({ onEdit }) {
  const {
    expenses,
    categories,
    loading,
    error,
    removeExpense,
    getCategoryById,
  } = useExpenses();
  const [filterCatId, setFilterCatId] = useState("all");
  const [deleteId, setDeleteId] = useState(null); // id расхода который удаляется

  const filtered =
    filterCatId === "all"
      ? expenses
      : expenses.filter((e) => String(e.categoryId) === String(filterCatId));

  const total = filtered.reduce((s, e) => s + e.amount, 0);

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить этот расход?")) return;
    setDeleteId(id);
    try {
      await removeExpense(id);
    } finally {
      setDeleteId(null);
    }
  };

  if (loading)
    return (
      <div className="expense-list-card">
        <p className="empty-hint">Загрузка...</p>
      </div>
    );
  if (error)
    return (
      <div className="expense-list-card">
        <p className="form-error">{error}</p>
      </div>
    );

  return (
    <div className="expense-list-card">
      <div className="list-header">
        <h2>Расходы</h2>
        <select
          className="filter-select"
          value={filterCatId}
          onChange={(e) => setFilterCatId(e.target.value)}
        >
          <option value="all">Все категории</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="empty-hint">Нет расходов. Добавьте первый!</p>
      ) : (
        <>
          {filtered.map((expense) => {
            const cat = getCategoryById(expense.categoryId);
            return (
              <div key={expense.id} className="expense-item">
                <span
                  className="cat-dot"
                  style={{ backgroundColor: cat?.color || "#888" }}
                />
                <div className="expense-info">
                  <p className="expense-desc">{expense.desc}</p>
                  <p className="expense-meta">
                    {cat?.name} · {expense.date}
                  </p>
                </div>
                <p className="expense-amount">{expense.amount} ₸</p>
                <button
                  className="btn-icon"
                  onClick={() => onEdit(expense)}
                  title="Редактировать"
                >
                  ✎
                </button>
                <button
                  className="btn-icon btn-danger"
                  onClick={() => handleDelete(expense.id)}
                  disabled={deleteId === expense.id}
                  title="Удалить"
                >
                  {deleteId === expense.id ? "..." : "✕"}
                </button>
              </div>
            );
          })}
          <p className="list-total">
            Итого ({filtered.length}): <strong>{total} ₸</strong>
          </p>
        </>
      )}
    </div>
  );
}
