// pages/Categories.jsx — только для admin
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useExpenses } from "../context/ExpenseContext";
import { openModal } from "../store/modalSlice";
import { notify } from "../store/notificationSlice";
import Layout from "../components/Layout";

const ICONS = [
  "🍔",
  "🚗",
  "🛍️",
  "💊",
  "🎬",
  "📦",
  "✈️",
  "🏠",
  "📚",
  "💻",
  "🎮",
  "🏋️",
  "🐾",
  "👗",
  "💇",
  "🍕",
  "☕",
  "🎵",
  "⚽",
  "🌿",
];
const COLORS = [
  { hex: "#1D9E75" },
  { hex: "#378ADD" },
  { hex: "#D4537E" },
  { hex: "#639922" },
  { hex: "#BA7517" },
  { hex: "#888780" },
  { hex: "#7F77DD" },
  { hex: "#E24B4A" },
  { hex: "#0F6E56" },
  { hex: "#533AB7" },
];
const emptyForm = { name: "", icon: "📦", color: "#888780" };

export default function Categories() {
  const { categories, addCategory, editCategory, removeCategory } =
    useExpenses();
  const dispatch = useDispatch();

  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Слушаем подтверждение удаления из глобального модала
  useEffect(() => {
    const handler = async (e) => {
      const { itemId, itemType } = e.detail;
      if (itemType !== "category") return;
      try {
        await removeCategory(itemId);
      } catch {
        dispatch(notify.error("Не удалось удалить категорию"));
      }
    };
    window.addEventListener("confirm-delete", handler);
    return () => window.removeEventListener("confirm-delete", handler);
  }, [removeCategory, dispatch]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Введите название";
    if (form.name.trim().length > 30) e.name = "Максимум 30 символов";
    return e;
  };

  const startEdit = (cat) => {
    setEditId(cat.id);
    setForm({ name: cat.name, icon: cat.icon, color: cat.color });
    setErrors({});
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm(emptyForm);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    try {
      if (editId) {
        await editCategory(editId, form);
      } else {
        await addCategory(form);
      }
      cancelEdit();
    } catch (err) {
      dispatch(notify.error(err.message));
    } finally {
      setLoading(false);
    }
  };

  // Открываем Redux-модал
  const handleDeleteClick = (cat) => {
    dispatch(
      openModal({
        title: "Удалить категорию?",
        message: `Удалить категорию "${cat.name}"? Расходы с ней останутся без категории.`,
        itemId: cat.id,
        itemType: "category",
      }),
    );
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>Категории</h1>
        <span className="admin-badge">Admin</span>
      </div>

      <div className="cat-page-grid">
        {/* Форма */}
        <div className="card">
          <h2>{editId ? "Редактировать" : "Добавить категорию"}</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label>Название</label>
              <input
                type="text"
                value={form.name}
                maxLength={30}
                onChange={(e) => {
                  setForm((p) => ({ ...p, name: e.target.value }));
                  setErrors({});
                }}
                placeholder="Например: Кофе, Спорт..."
              />
              {errors.name && <p className="field-error">{errors.name}</p>}
            </div>
            <div className="field">
              <label>Иконка</label>
              <div className="icon-grid">
                {ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    className={`icon-btn ${form.icon === icon ? "icon-btn--active" : ""}`}
                    onClick={() => setForm((p) => ({ ...p, icon }))}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div className="field">
              <label>Цвет</label>
              <div className="color-grid">
                {COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    className={`color-btn ${form.color === c.hex ? "color-btn--active" : ""}`}
                    style={{ backgroundColor: c.hex }}
                    onClick={() => setForm((p) => ({ ...p, color: c.hex }))}
                  />
                ))}
              </div>
            </div>
            <div className="field">
              <label>Превью</label>
              <div className="cat-preview">
                <span
                  className="cat-dot"
                  style={{
                    backgroundColor: form.color,
                    width: "12px",
                    height: "12px",
                  }}
                />
                <span style={{ fontSize: "18px" }}>{form.icon}</span>
                <span style={{ fontWeight: 500 }}>
                  {form.name || "Название"}
                </span>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Сохранение..." : editId ? "Сохранить" : "Добавить"}
              </button>
              {editId && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={cancelEdit}
                >
                  Отмена
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Список */}
        <div className="expense-list-card">
          <div className="list-header">
            <h2>Все категории</h2>
            <span style={{ fontSize: "12px", color: "#888" }}>
              {categories.length} шт.
            </span>
          </div>
          {categories.length === 0 ? (
            <p className="empty-hint">Нет категорий</p>
          ) : (
            categories.map((cat) => (
              <div
                key={cat.id}
                className={`cat-item ${editId === cat.id ? "cat-item--editing" : ""}`}
              >
                <span
                  className="cat-dot"
                  style={{
                    backgroundColor: cat.color,
                    width: "10px",
                    height: "10px",
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: "20px", flexShrink: 0 }}>
                  {cat.icon}
                </span>
                <div className="expense-info">
                  <p className="expense-desc">{cat.name}</p>
                  <p
                    className="expense-meta"
                    style={{ fontFamily: "monospace" }}
                  >
                    {cat.color}
                  </p>
                </div>
                <button className="btn-icon" onClick={() => startEdit(cat)}>
                  ✎
                </button>
                <button
                  className="btn-icon btn-danger"
                  onClick={() => handleDeleteClick(cat)}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
