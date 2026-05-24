import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser, selectIsAdmin } from "../store/authSlice";

export default function ProtectedRoute({ children, role }) {
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);

  if (!user) return <Navigate to="/login" replace />;

  if (role === "admin" && !isAdmin) {
    return <Navigate to="/no-access" replace />;
  }

  return children;
}
