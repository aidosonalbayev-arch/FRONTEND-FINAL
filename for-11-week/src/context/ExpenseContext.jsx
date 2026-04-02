// src/context/ExpenseContext.jsx
// Контекст расходов — полный CRUD через json-server API
// Связь один-ко-многим: categories (1) → expenses (many)

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  fetchExpenses,
  fetchCategories,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../api/api";

const ExpenseContext = createContext(null);

export function ExpenseProvider({ children }) {
  const { user } = useAuth();

  const [expenses, setExpenses] = useState([]);
  // categories — справочник категорий (одна категория → много расходов)
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ─── Загрузка категорий (один раз при монтировании) ──────────────────────
  // Категории — справочник, не зависит от пользователя
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setError("Не удалось загрузить категории"));
  }, []);

  // ─── Загрузка расходов при смене пользователя ─────────────────────────────
  // Используем user?.id как зависимость: если разлогинились — очищаем список
  useEffect(() => {
    if (!user) {
      setExpenses([]);
      return;
    }
    setLoading(true);
    fetchExpenses(user.id)
      .then(setExpenses)
      .catch(() => setError("Не удалось загрузить расходы"))
      .finally(() => setLoading(false));
  }, [user?.id]);

  // ─── CREATE ───────────────────────────────────────────────────────────────
  const addExpense = async (data) => {
    // Добавляем userId чтобы расход был привязан к пользователю
    const created = await createExpense({ ...data, userId: user.id });
    // Оптимистичное обновление: добавляем в локальный стейт без перезагрузки
    setExpenses((prev) => [created, ...prev]);
  };

  // ─── UPDATE ───────────────────────────────────────────────────────────────
  const editExpense = async (id, data) => {
    const updated = await updateExpense(id, { ...data, userId: user.id });
    setExpenses((prev) => prev.map((e) => (e.id === id ? updated : e)));
  };

  // ─── DELETE ───────────────────────────────────────────────────────────────
  const removeExpense = async (id) => {
    await deleteExpense(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // ─── Вспомогательная функция: получить категорию по id ───────────────────
  // Используется в компонентах вместо .find() каждый раз
  const getCategoryById = (id) => categories.find((c) => c.id === id);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        categories,
        loading,
        error,
        addExpense,
        editExpense,
        removeExpense,
        getCategoryById,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpenses = () => useContext(ExpenseContext);
