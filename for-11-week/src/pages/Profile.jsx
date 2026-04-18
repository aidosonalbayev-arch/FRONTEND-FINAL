// pages/Profile.jsx — /profile
// Страница профиля пользователя
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useExpenses } from "../context/ExpenseContext";
import { deleteUser } from "../api/api";
import Layout from "../components/Layout";

export default function Profile() {
  const { user, logout } = useAuth();
  const { expenses } = useExpenses();
  const nav = useNavigate();

  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // Статистика пользователя
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const curMonth = new Date().toISOString().slice(0, 7);
  const monthTotal = expenses
    .filter((e) => e.date.startsWith(curMonth))
    .reduce((s, e) => s + e.amount, 0);
  const fmt = (n) =>
    n.toLocaleString("ru-RU", { maximumFractionDigits: 0 }) + " ₸";

  // Удаление аккаунта (DELETE /users/:id)
  const handleDeleteAccount = async () => {
    if (!window.confirm("Удалить аккаунт? Все данные будут потеряны!")) return;
    setDeleting(true);
    try {
      await deleteUser(user.id);
      logout();
      nav("/login");
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  const initials = user.email.slice(0, 2).toUpperCase();

  return (
    <Layout>
      <div className="page-header">
        <button className="btn-back" onClick={() => nav("/dashboard")}>
          ← Назад
        </button>
        <h1>Профиль</h1>
      </div>

      {/* Карточка пользователя */}
      <div className="profile-card">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-info">
          <p className="profile-email">{user.email}</p>
          <p className="profile-role">Роль: {user.role}</p>
          <p className="profile-date">Зарегистрирован: {user.createdAt}</p>
        </div>
      </div>

      {/* Статистика */}
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

      {/* Опасная зона */}
      <div className="danger-zone">
        <p className="danger-title">Опасная зона</p>
        <p className="danger-desc">
          Удаление аккаунта необратимо. Все расходы будут удалены.
        </p>
        {error && <p className="form-error">{error}</p>}
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
