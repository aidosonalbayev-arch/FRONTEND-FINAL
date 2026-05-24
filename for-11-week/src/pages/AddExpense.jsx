import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import ExpenseForm from "../components/ExpenseForm";

export default function AddExpense() {
  const nav = useNavigate();

  return (
    <Layout>
      <div className="page-header">
        {/* Кнопка назад */}
        <button className="btn-back" onClick={() => nav("/dashboard")}>
          ← Назад
        </button>
        <h1>Добавить расход</h1>
      </div>

      <div className="form-page-card">
        <ExpenseForm editTarget={null} onDone={() => nav("/dashboard")} />
      </div>
    </Layout>
  );
}
