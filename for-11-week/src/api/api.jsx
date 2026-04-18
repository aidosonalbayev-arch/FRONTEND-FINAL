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

  return res.json();
}

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

export const fetchCategories = () => request("/categories");

export const fetchExpenses = (userId) =>
  request(`/expenses?userId=${userId}&_sort=date&_order=desc`);

export const fetchExpenseById = (id) => request(`/expenses/${id}`);

export const createExpense = (data) =>
  request("/expenses", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateExpense = (id, data) =>
  request(`/expenses/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteExpense = (id) => {
  request(`/expenses/${id}`, { method: "DELETE" });
};

export const deleteUser = (id) => request(`/users/${id}`, { method: "DELETE" });
