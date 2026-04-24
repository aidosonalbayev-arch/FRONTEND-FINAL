// pages/Dashboard.jsx — /dashboard
// Слушает событие "confirm-delete" от глобального ConfirmModal
// и выполняет удаление расхода.
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useExpenses } from "../context/ExpenseContext";
import { useAuth } from "../context/AuthContext";
import { notify } from "../store/notificationSlice";
import Layout from "../components/Layout";
import { Summary } from "../components/Summary";
import { ExpenseList } from "../components/ExpenseList";

export default function Dashboard() {
  const { removeExpense } = useExpenses();
  const { isAdmin } = useAuth(); // boolean
  const nav = useNavigate();
  const dispatch = useDispatch();

  // Слушаем подтверждение из модала
  useEffect(() => {
    const handler = async (e) => {
      const { itemId, itemType } = e.detail;
      if (itemType !== "expense") return;
      try {
        await removeExpense(itemId);
        // notify.success диспатчится внутри removeExpense
      } catch {
        dispatch(notify.error("Не удалось удалить расход"));
      }
    };
    window.addEventListener("confirm-delete", handler);
    return () => window.removeEventListener("confirm-delete", handler);
  }, [removeExpense, dispatch]);

  return (
    <Layout>
      <div className="page-header">
        <h1>{isAdmin ? "Все расходы (Admin)" : "Мои расходы"}</h1>
        <button
          className="btn-primary"
          style={{ width: "auto", padding: "8px 20px" }}
          onClick={() => nav("/expenses/add")}
        >
          + Добавить расход
        </button>
      </div>

      <Summary />

      <ExpenseList onEdit={(expense) => nav(`/expenses/edit/${expense.id}`)} />
    </Layout>
  );
}
