import { useNavigate, useParams } from "react-router-dom";
import { useExpenses } from "../context/ExpenseContext";
import Layout from "../components/Layout";
import ExpenseForm from "../components/ExpenseForm";

export default function EditExpense() {
  const nav = useNavigate();

  const { id } = useParams();

  const { expenses } = useExpenses();

  const expense = expenses.find((e) => e.id === Number(id));

  if (!expense) {
    return (
      <Layout>
        <div className="page-header">
          <button className="btn-back" onClick={() => nav("/dashboard")}>
            ← Назад
          </button>
          <h1>Расход не найден</h1>
        </div>
        <div className="form-page-card">
          <p
            style={{
              color: "var(--color-text-secondary)",
              textAlign: "center",
              padding: "2rem 0",
            }}
          >
            Расход с ID #{id} не существует.
          </p>
          <button className="btn-primary" onClick={() => nav("/dashboard")}>
            Вернуться к списку
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <button className="btn-back" onClick={() => nav("/dashboard")}>
          ← Назад
        </button>
        <h1>Редактировать расход</h1>
      </div>

      <div className="edit-info">
        <p>
          Редактирование: <strong>{expense.desc}</strong>
        </p>
        <p style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>
          ID: {expense.id} · Создан: {expense.date}
        </p>
      </div>

      <div className="form-page-card">
        <ExpenseForm editTarget={expense} onDone={() => nav("/dashboard")} />
      </div>
    </Layout>
  );
}
