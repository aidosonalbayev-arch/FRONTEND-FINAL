// src/components/ExpenseForm.jsx
import { useState, useEffect } from "react";
import { useExpenses } from "../context/ExpenseContext";

const today = () => new Date().toISOString().slice(0, 10);

export default function ExpenseForm({ editTarget = null, onDone }) {
  const { addExpense, editExpense, categories } = useExpenses();

  const getInitial = () =>
    editTarget
      ? {
          desc: editTarget.desc,
          amount: editTarget.amount,
          categoryId: editTarget.categoryId,
          date: editTarget.date,
        }
      : {
          desc: "",
          amount: "",
          categoryId: categories[0]?.id || 1,
          date: today(),
        };

  const [form, setForm] = useState(getInitial);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverErr, setServerErr] = useState("");

  useEffect(() => {
    setForm(getInitial());
    setErrors({});
    setServerErr("");
  }, [editTarget?.id]);

  const set = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.desc.trim()) {
      e.desc = "Введите описание";
    }
    if (!form.amount || Number(form.amount) <= 0) {
      e.amount = "Введите сумму больше 0";
    }
    if (!form.date) {
      e.date = "Укажите дату";
    }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerErr("");
    const errs = validate();
    if (Object.keys(errs).length) {
      return setErrors(errs);
    }
    const data = {
      desc: form.desc.trim(),
      amount: parseFloat(form.amount),
      categoryId: Number(form.categoryId),
      date: form.date,
    };
    setLoading(true);
    try {
      if (editTarget) {
        await editExpense(editTarget.id, data);
      } else {
        await addExpense(data);
        setForm({
          desc: "",
          amount: "",
          categoryId: categories[0]?.id || 1,
          date: today(),
        });
      }
      onDone?.();
    } catch (err) {
      setServerErr(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label>Описание</label>
        <input
          type="text"
          value={form.desc}
          onChange={(e) => set("desc", e.target.value)}
          placeholder="Кофе, такси..."
        />
        {errors.desc && <p className="field-error">{errors.desc}</p>}
      </div>
      <div className="field">
        <label>Сумма (₸)</label>
        <input
          type="number"
          min="0.01"
          step="any"
          value={form.amount}
          onChange={(e) => set("amount", e.target.value)}
          placeholder="0"
        />
        {errors.amount && <p className="field-error">{errors.amount}</p>}
      </div>
      <div className="field">
        <label>Категория</label>
        <select
          value={form.categoryId}
          onChange={(e) => set("categoryId", e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Дата</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => set("date", e.target.value)}
        />
        {errors.date && <p className="field-error">{errors.date}</p>}
      </div>
      {serverErr && <p className="form-error">{serverErr}</p>}
      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Сохранение..." : editTarget ? "Сохранить" : "Добавить"}
        </button>
        {editTarget && (
          <button type="button" className="btn-secondary" onClick={onDone}>
            Отмена
          </button>
        )}
      </div>
    </form>
  );
}
