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
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setError("Не удалось загрузить категории"));
  }, []);

  useEffect(() => {
    if (!user) {
      setExpenses([]);
      return;
    }
    setLoading(true);
    setError(null);
    fetchExpenses(user.id)
      .then(setExpenses)
      .catch(() => setError("Не удалось загрузить расходы"))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const addExpense = async (data) => {
    const created = await createExpense({ ...data, userId: user.id });
    setExpenses((prev) => [created, ...prev]);
  };

  const editExpense = async (id, data) => {
    const updated = await updateExpense(id, { ...data, userId: user.id });
    setExpenses((prev) => prev.map((e) => (e.id === id ? updated : e)));
  };

  const removeExpense = async (id) => {
    await deleteExpense(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
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
        getCategoryById,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  return useContext(ExpenseContext);
}
