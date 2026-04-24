// components/Layout.jsx — навигация зависит от роли
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    nav("/login");
  };
  const initials = user?.email.slice(0, 2).toUpperCase();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="app-layout">
      <header className="dash-header">
        <div className="header-left">
          <p className="dash-logo">Expense Tracker</p>
          <nav className="header-nav">
            {/* Общие ссылки */}
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

            {/* Только для admin */}
            {isAdmin() && (
              <>
                <Link
                  to="/categories"
                  className={`nav-link nav-link--admin ${isActive("/categories") ? "nav-link--active" : ""}`}
                >
                  Категории
                </Link>
                <Link
                  to="/admin/users"
                  className={`nav-link nav-link--admin ${isActive("/admin/users") ? "nav-link--active" : ""}`}
                >
                  Пользователи
                </Link>
              </>
            )}

            <Link
              to="/profile"
              className={`nav-link ${isActive("/profile") ? "nav-link--active" : ""}`}
            >
              Профиль
            </Link>
          </nav>
        </div>

        <div className="dash-user">
          {/* Бейджик роли */}
          <span className={`role-badge role-badge--${user?.role}`}>
            {user?.role}
          </span>
          <div className="avatar">{initials}</div>
          <span className="user-email">{user?.email}</span>
          <button className="btn-sm" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </header>

      <main className="page-content">{children}</main>
    </div>
  );
}
