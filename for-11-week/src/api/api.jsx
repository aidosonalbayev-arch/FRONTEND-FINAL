// api/api.js
const BASE = "http://localhost:3001";

async function request(url, options = {}) {
  const res = await fetch(`${BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Ошибка сервера: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// AUTH
export const registerUser = (email, password) =>
  request("/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
export const loginUser = (email, password) =>
  request("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

// CATEGORIES
export const fetchCategories = () => request("/categories");
export const createCategory = (data) =>
  request("/categories", { method: "POST", body: JSON.stringify(data) });
export const updateCategory = (id, data) =>
  request(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteCategory = (id) =>
  request(`/categories/${id}`, { method: "DELETE" });

// EXPENSES
// Если userId null — admin, получаем все расходы
export const fetchExpenses = (userId) =>
  request(
    userId
      ? `/expenses?userId=${userId}&_sort=date&_order=desc`
      : `/expenses?_sort=date&_order=desc`,
  );
export const fetchExpenseById = (id) => request(`/expenses/${id}`);
export const createExpense = (data) =>
  request("/expenses", { method: "POST", body: JSON.stringify(data) });
export const updateExpense = (id, data) =>
  request(`/expenses/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteExpense = (id) =>
  request(`/expenses/${id}`, { method: "DELETE" });

// USERS
export const fetchUsers = () => request("/users");
export const fetchUserById = (id) => request(`/users/${id}`);
export const updateUser = (id, data) =>
  request(`/users/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteUser = (id) => request(`/users/${id}`, { method: "DELETE" });
