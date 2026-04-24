// App.jsx — корень приложения
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { AuthProvider } from "./context/AuthContext";
import { ExpenseProvider } from "./context/ExpenseContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ConfirmModal from "./components/ui/ConfirmModal";
import Notifications from "./components/ui/Notifications";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import EditExpense from "./pages/EditExpense";
import Categories from "./pages/Categories";
import AdminUsers from "./pages/AdminUsers";
import Profile from "./pages/Profile";
import NoAccess from "./pages/NoAccess";

export default function App() {
  return (
    // Provider — Redux доступен везде
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <ExpenseProvider>
            <Routes>
              {/* Публичные маршруты */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/no-access" element={<NoAccess />} />

              {/* Для всех залогиненных */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/expenses/add"
                element={
                  <ProtectedRoute>
                    <AddExpense />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/expenses/edit/:id"
                element={
                  <ProtectedRoute>
                    <EditExpense />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Только для admin */}
              <Route
                path="/categories"
                element={
                  <ProtectedRoute role="admin">
                    <Categories />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute role="admin">
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>

            {/* Глобальные — доступны на любой странице */}
            <ConfirmModal />
            <Notifications />
          </ExpenseProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  );
}
