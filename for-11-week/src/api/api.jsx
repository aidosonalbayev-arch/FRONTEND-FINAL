// src/api/api.js
// Единый слой для всех запросов к бэкенду.
// Компоненты и контексты НЕ делают fetch() напрямую — только через эти функции.
// Это называется "service layer" — разделение ответственности.

const BASE = "http://localhost:3001";

// ─── Утилита: общий fetch с обработкой ошибок ─────────────────────────────────
// Все запросы идут через неё — не дублируем try/catch везде.
async function request(url, options = {}) {
  const res = await fetch(`${BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  // Если сервер вернул ошибку (4xx, 5xx) — парсим тело и бросаем ошибку
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Ошибка сервера: ${res.status}`);
  }

  // 204 No Content (например, после DELETE) — тела нет, возвращаем null
  if (res.status === 204) return null;

  return res.json();
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════════════════════

// POST /register → { id, email, role, createdAt }
export const registerUser = (email, password) =>
  request("/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

// POST /login → { id, email, role, createdAt }
export const loginUser = (email, password) =>
  request("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORIES — READ ONLY (справочник, не меняется пользователем)
// ═══════════════════════════════════════════════════════════════════════════════

// GET /categories → [{ id, name, color, icon }]
export const fetchCategories = () => request("/categories");

// ═══════════════════════════════════════════════════════════════════════════════
// EXPENSES — полный CRUD
// ═══════════════════════════════════════════════════════════════════════════════

// READ ALL — получить все расходы текущего пользователя
// GET /expenses?userId=X&_sort=date&_order=desc
export const fetchExpenses = (userId) =>
  request(`/expenses?userId=${userId}&_sort=date&_order=desc`);

// READ ONE — получить один расход по id
// GET /expenses/:id
export const fetchExpenseById = (id) => request(`/expenses/${id}`);

// CREATE — добавить новый расход
// POST /expenses
export const createExpense = (data) =>
  request("/expenses", {
    method: "POST",
    body: JSON.stringify(data),
  });

// UPDATE — обновить расход полностью
// PUT /expenses/:id (PUT заменяет объект целиком)
export const updateExpense = (id, data) =>
  request(`/expenses/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

// DELETE — удалить расход
// DELETE /expenses/:id
export const deleteExpense = (id) =>
  request(`/expenses/${id}`, { method: "DELETE" });

// ═══════════════════════════════════════════════════════════════════════════════
// USERS — для CRUD пользователей (критерий: delete users)
// ═══════════════════════════════════════════════════════════════════════════════

// READ ALL
export const fetchUsers = () => request("/users");

// READ ONE
export const fetchUserById = (id) => request(`/users/${id}`);

// UPDATE (например, сменить email)
export const updateUser = (id, data) =>
  request(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

// DELETE
export const deleteUser = (id) => request(`/users/${id}`, { method: "DELETE" });
