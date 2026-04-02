import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useExpenses } from "../context/ExpenseContext";
import ExpenseForm from "../components/ExpenseForm";
import { ExpenseList } from "../components/ExpenseList";
import { Summary } from "../components/Summary";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { expenses } = useExpenses();
  const nav = useNavigate();
  const [editTarget, setEditTarget] = useState(null);

  const handleLogout = () => {
    logout();
    nav("/login");
  };
  const initials = user.email.slice(0, 2).toUpperCase();

  return (
    <div className="dashboard">
      <header className="dash-header">
        <p className="dash-logo">Expense Tracker</p>
        <div className="dash-user">
          <div className="avatar">{initials}</div>
          <span className="user-email">{user.email}</span>
          <button className="btn-sm" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </header>

      <main className="dash-main">
        <Summary expenses={expenses} />
        <div className="dash-grid">
          <div className="card">
            <h2>{editTarget ? "Редактировать расход" : "Добавить расход"}</h2>
            <ExpenseForm
              editTarget={editTarget}
              onDone={() => setEditTarget(null)}
            />
          </div>
          <ExpenseList onEdit={setEditTarget} />
        </div>
      </main>
    </div>
  );
}
