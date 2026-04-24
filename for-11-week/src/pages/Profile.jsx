// pages/Profile.jsx — /profile
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { useExpenses } from "../context/ExpenseContext";
import { deleteUser } from "../api/api";
import { openModal } from "../store/modalSlice";
import { notify } from "../store/notificationSlice";
import Layout from "../components/Layout";

export default function Profile() {
  const { user, logout } = useAuth();
  const { expenses } = useExpenses();
  const nav = useNavigate();
  const dispatch = useDispatch();

  const [deleting, setDeleting] = useState(false);

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const curMonth = new Date().toISOString().slice(0, 7);
  const monthTotal = expenses
    .filter((e) => e.date.startsWith(curMonth))
    .reduce((s, e) => s + e.amount, 0);
  const fmt = (n) =>
    n.toLocaleString("ru-RU", { maximumFractionDigits: 0 }) + " ₸";

  // Клик "Удалить аккаунт" → открыть модал
  const handleDeleteAccount = () => {
    dispatch(
      openModal({
        title: "Удалить аккаунт?",
        message: "Все ваши данные будут потеряны безвозвратно!",
        itemId: user.id,
        itemType: "account",
      }),
    );
  };

  // Слушаем подтверждение из модала
  useEffect(() => {
    const handler = async (e) => {
      const { itemId, itemType } = e.detail;
      if (itemType !== "account") return;
      setDeleting(true);
      try {
        await deleteUser(itemId);
        dispatch(notify.success("Аккаунт удалён"));
        logout();
        nav("/login");
      } catch (err) {
        dispatch(notify.error(err.message));
        setDeleting(false);
      }
    };
    window.addEventListener("confirm-delete", handler);
    return () => window.removeEventListener("confirm-delete", handler);
  }, [dispatch, logout, nav]);

  const initials = user.email.slice(0, 2).toUpperCase();

  return (
    <Layout>
      <div className="page-header">
        <button className="btn-back" onClick={() => nav("/dashboard")}>
          ← Назад
        </button>
        <h1>Профиль</h1>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-info">
          <p className="profile-email">{user.email}</p>
          <p className="profile-role">Роль: {user.role}</p>
          <p className="profile-date">Зарегистрирован: {user.createdAt}</p>
        </div>
      </div>

      <div className="summary-grid" style={{ marginTop: "1rem" }}>
        <div className="metric">
          <p className="metric-label">Всего расходов</p>
          <p className="metric-value">{expenses.length}</p>
        </div>
        <div className="metric">
          <p className="metric-label">Потрачено всего</p>
          <p className="metric-value">{fmt(total)}</p>
        </div>
        <div className="metric">
          <p className="metric-label">За этот месяц</p>
          <p className="metric-value">{fmt(monthTotal)}</p>
        </div>
        <div className="metric">
          <p className="metric-label">ID аккаунта</p>
          <p className="metric-value" style={{ fontSize: "16px" }}>
            #{user.id}
          </p>
        </div>
      </div>

      <div className="danger-zone">
        <p className="danger-title">Опасная зона</p>
        <p className="danger-desc">
          Удаление аккаунта необратимо. Все расходы будут удалены.
        </p>
        <button
          className="btn-danger"
          onClick={handleDeleteAccount}
          disabled={deleting}
          style={{ marginTop: "12px" }}
        >
          {deleting ? "Удаление..." : "Удалить аккаунт"}
        </button>
      </div>
    </Layout>
  );
}
