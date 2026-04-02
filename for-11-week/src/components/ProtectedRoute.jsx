// components/ProtectedRoute.jsx
// "Страж" — пускает на страницу только авторизованных пользователей

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// children — это компонент, который нужно защитить (например, <Dashboard />)
export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // Если user === null (не залогинен):
  // Navigate мгновенно перенаправляет на /login.
  // replace={true} — заменяет текущую запись в истории браузера,
  // чтобы кнопка "Назад" не возвращала на защищённую страницу.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Если user есть — просто рендерим дочерний компонент как есть.
  return children;
}

// ─── Как это работает на практике ────────────────────────────────────────────
//
// В App.jsx:
//   <Route path="/dashboard" element={
//     <ProtectedRoute>
//       <Dashboard />
//     </ProtectedRoute>
//   } />
//
// Пользователь открывает /dashboard:
//   1. React Router рендерит ProtectedRoute
//   2. ProtectedRoute проверяет useAuth().user
//   3. Если null → редирект на /login (Dashboard не рендерится вообще)
//   4. Если есть → рендерится Dashboard
