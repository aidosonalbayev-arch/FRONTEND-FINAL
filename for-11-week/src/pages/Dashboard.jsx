// pages/Dashboard.jsx — /dashboard
// Главная страница: статистика + список расходов
import { useNavigate } from "react-router-dom";
import { useExpenses } from "../context/ExpenseContext";
import Layout from "../components/Layout";
import { Summary } from "../components/Summary";
import { ExpenseList } from "../components/ExpenseList";

export default function Dashboard() {
  const { expenses } = useExpenses();
  const nav = useNavigate();

  return (
    <Layout>
      <div className="page-header">
        <h1>Мои расходы</h1>
        {/* Кнопка ведёт на /expenses/add */}
        <button
          className="btn-primary"
          style={{ width: "auto", padding: "8px 20px" }}
          onClick={() => nav("/expenses/add")}
        >
          + Добавить расход
        </button>
      </div>

      {/* Карточки со статистикой */}
      <Summary expenses={expenses} />

      {/* Список расходов */}
      {/* onEdit теперь навигирует на /expenses/edit/:id */}
      <ExpenseList onEdit={(expense) => nav(`/expenses/edit/${expense.id}`)} />
    </Layout>
  );
}
