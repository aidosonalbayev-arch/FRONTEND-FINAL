// pages/NoAccess.jsx — /no-access
// Страница "нет доступа" для неправильной роли
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

export default function NoAccess() {
  const { user } = useAuth();
  const nav = useNavigate();

  return (
    <Layout>
      <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
        <div style={{ fontSize: "48px", marginBottom: "1rem" }}>🚫</div>
        <h1 style={{ marginBottom: "0.5rem" }}>Нет доступа</h1>
        <p style={{ color: "#5f5e5a", marginBottom: "1.5rem" }}>
          Эта страница доступна только администраторам.
          <br />
          Ваша роль: <strong>{user?.role}</strong>
        </p>
        <button
          className="btn-primary"
          style={{ width: "auto", padding: "8px 24px" }}
          onClick={() => nav("/dashboard")}
        >
          На главную
        </button>
      </div>
    </Layout>
  );
}
