import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedAdminRoute() {
  const admin = JSON.parse(localStorage.getItem("admin"));

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
