// components/ProtectedRoute.jsx
// Защита маршрутов — по авторизации И по роли
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser, selectIsAdmin } from "../store/authSlice";

// Примеры использования:
//   <ProtectedRoute>              — только для залогиненных
//   <ProtectedRoute role="admin"> — только для администраторов
export default function ProtectedRoute({ children, role }) {
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);

  // Не залогинен → на страницу входа
  if (!user) return <Navigate to="/login" replace />;

  // Нужна роль admin, а пользователь не admin → страница "нет доступа"
  if (role === "admin" && !isAdmin) {
    return <Navigate to="/no-access" replace />;
  }

  return children;
}
