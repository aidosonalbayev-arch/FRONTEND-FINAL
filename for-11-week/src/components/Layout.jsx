// components/Layout.jsx
// Общий layout с шапкой — оборачивает все защищённые страницы
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation(); // текущий URL — для подсветки активной ссылки

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  const initials = user?.email.slice(0, 2).toUpperCase();

  // Функция проверки активного маршрута
  const isActive = (path) => location.pathname === path;

  return (
    <div className="app-layout">
      {/* ─── Шапка ─────────────────────────────────────────────────────── */}
      <header className="dash-header">
        <div className="header-left">
          <p className="dash-logo">Expense Tracker</p>

          {/* Навигационные ссылки */}
          <nav className="header-nav">
            <Link
              to="/dashboard"
              className={`nav-link ${isActive("/dashboard") ? "nav-link--active" : ""}`}
            >
              Расходы
            </Link>
            <Link
              to="/expenses/add"
              className={`nav-link ${isActive("/expenses/add") ? "nav-link--active" : ""}`}
            >
              + Добавить
            </Link>
            <Link
              to="/profile"
              className={`nav-link ${isActive("/profile") ? "nav-link--active" : ""}`}
            >
              Профиль
            </Link>
          </nav>
        </div>

        <div className="dash-user">
          <div className="avatar">{initials}</div>
          <span className="user-email">{user?.email}</span>
          <button className="btn-sm" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </header>

      {/* ─── Контент страницы ───────────────────────────────────────────── */}
      <main className="page-content">{children}</main>
    </div>
  );
}
