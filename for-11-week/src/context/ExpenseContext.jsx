// context/ExpenseContext.jsx — CRUD с уведомлениями через Redux
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useDispatch } from "react-redux";
import { notify } from "../store/notificationSlice";
import { recalculate } from "../store/totalSlice";
import {
  fetchExpenses,
  fetchCategories,
  createExpense,
  updateExpense,
  deleteExpense,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/api";

const ExpenseContext = createContext(null);

export function ExpenseProvider({ children }) {
  const { user, isAdmin } = useAuth(); // isAdmin — boolean
  const dispatch = useDispatch();

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Загрузка категорий
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => {
        setError("Не удалось загрузить категории");
        dispatch(notify.error("Ошибка загрузки категорий"));
      });
  }, []);

  // Загрузка расходов — admin видит ВСЕ, user — только свои
  useEffect(() => {
    if (!user) {
      setExpenses([]);
      dispatch(recalculate([]));
      return;
    }
    setLoading(true);
    setError(null);
    // admin → null → GET /expenses (все), user → user.id → GET /expenses?userId=X
    const url = isAdmin ? null : user.id;
    fetchExpenses(url)
      .then((data) => {
        setExpenses(data);
        dispatch(recalculate(data)); // пересчитать total в Redux
      })
      .catch(() => {
        setError("Не удалось загрузить расходы");
        dispatch(notify.error("Ошибка загрузки расходов"));
      })
      .finally(() => setLoading(false));
  }, [user?.id, isAdmin]);

  // Пересчитываем total при каждом изменении списка
  useEffect(() => {
    dispatch(recalculate(expenses));
  }, [expenses, dispatch]);

  // ─── EXPENSES CRUD ────────────────────────────────────────────────────────
  const addExpense = async (data) => {
    const created = await createExpense({ ...data, userId: user.id });
    setExpenses((prev) => [created, ...prev]);
    dispatch(notify.success("Расход добавлен!"));
  };

  const editExpense = async (id, data) => {
    const updated = await updateExpense(id, { ...data, userId: user.id });
    setExpenses((prev) => prev.map((e) => (e.id === id ? updated : e)));
    dispatch(notify.success("Расход обновлён!"));
  };

  const removeExpense = async (id) => {
    await deleteExpense(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    dispatch(notify.success("Расход удалён"));
  };

  // ─── CATEGORIES CRUD ──────────────────────────────────────────────────────
  const addCategory = async (data) => {
    const created = await createCategory(data);
    setCategories((prev) => [...prev, created]);
    dispatch(notify.success(`Категория "${created.name}" создана!`));
  };

  const editCategory = async (id, data) => {
    const updated = await updateCategory(id, data);
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
    dispatch(notify.success(`Категория "${updated.name}" обновлена!`));
  };

  const removeCategory = async (id) => {
    await deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    dispatch(notify.success("Категория удалена"));
  };

  const getCategoryById = (id) =>
    categories.find((c) => c.id === id || c.id === Number(id));

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
        addCategory,
        editCategory,
        removeCategory,
        getCategoryById,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpenses = () => useContext(ExpenseContext);
