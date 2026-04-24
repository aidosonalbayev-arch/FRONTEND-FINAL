// pages/AdminUsers.jsx — /admin/users (только admin)
// Управление пользователями — смена ролей и удаление.
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { fetchUsers, deleteUser, updateUser } from "../api/api";
import { openModal } from "../store/modalSlice";
import { notify } from "../store/notificationSlice";
import Layout from "../components/Layout";

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editRole, setEditRole] = useState("user");

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch(() => dispatch(notify.error("Не удалось загрузить пользователей")))
      .finally(() => setLoading(false));
  }, [dispatch]);

  // Слушаем подтверждение удаления
  useEffect(() => {
    const handler = async (e) => {
      const { itemId, itemType } = e.detail;
      if (itemType !== "user") return;
      try {
        await deleteUser(itemId);
        setUsers((prev) => prev.filter((u) => u.id !== itemId));
        dispatch(notify.success("Пользователь удалён"));
      } catch {
        dispatch(notify.error("Не удалось удалить пользователя"));
      }
    };
    window.addEventListener("confirm-delete", handler);
    return () => window.removeEventListener("confirm-delete", handler);
  }, [dispatch]);

  const handleDeleteClick = (u) => {
    if (u.id === currentUser.id) {
      dispatch(notify.error("Нельзя удалить себя!"));
      return;
    }
    dispatch(
      openModal({
        title: "Удалить пользователя?",
        message: `Удалить аккаунт "${u.email}"?`,
        itemId: u.id,
        itemType: "user",
      }),
    );
  };

  // Смена роли (UPDATE)
  const handleSaveRole = async (userId) => {
    try {
      const u = users.find((u) => u.id === userId);
      const updated = await updateUser(userId, { ...u, role: editRole });
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      dispatch(notify.success("Роль обновлена"));
      setEditId(null);
    } catch {
      dispatch(notify.error("Не удалось обновить роль"));
    }
  };

  if (loading)
    return (
      <Layout>
        <p className="empty-hint">Загрузка...</p>
      </Layout>
    );

  return (
    <Layout>
      <div className="page-header">
        <h1>Управление пользователями</h1>
        <span className="admin-badge">Admin</span>
      </div>

      <div className="expense-list-card">
        <div className="list-header">
          <h2>Все пользователи</h2>
          <span style={{ fontSize: "12px", color: "#888" }}>
            {users.length} чел.
          </span>
        </div>

        {users.map((u) => (
          <div key={u.id} className="expense-item">
            <div className="avatar" style={{ flexShrink: 0 }}>
              {u.email.slice(0, 2).toUpperCase()}
            </div>

            <div className="expense-info">
              <p className="expense-desc">
                {u.email}
                {u.id === currentUser.id && (
                  <span className="you-badge"> (вы)</span>
                )}
              </p>
              <p className="expense-meta">
                ID: {u.id} · Создан: {u.createdAt}
              </p>
            </div>

            {editId === u.id ? (
              <div
                style={{ display: "flex", gap: "6px", alignItems: "center" }}
              >
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  style={{
                    width: "auto",
                    fontSize: "12px",
                    padding: "4px 8px",
                  }}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
                <button
                  className="btn-icon"
                  onClick={() => handleSaveRole(u.id)}
                >
                  ✓
                </button>
                <button className="btn-icon" onClick={() => setEditId(null)}>
                  ✕
                </button>
              </div>
            ) : (
              <span className={`role-badge role-badge--${u.role}`}>
                {u.role}
              </span>
            )}

            <button
              className="btn-icon"
              onClick={() => {
                setEditId(u.id);
                setEditRole(u.role);
              }}
              title="Изменить роль"
            >
              ✎
            </button>
            <button
              className="btn-icon btn-danger"
              onClick={() => handleDeleteClick(u)}
              title="Удалить"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
}
