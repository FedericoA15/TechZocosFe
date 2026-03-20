import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../core/context";
import type { Role } from "../../core/types/user";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  adminOnly?: boolean;
  allowedRoles?: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  // Si no está autenticado, directo al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si es adminOnly o hay roles permitidos, chequear
  const effectiveRoles = allowedRoles || (adminOnly ? ["Admin"] : null);

  if (effectiveRoles && user && !effectiveRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Si hay children, usarlos (uso como wrapper)
  if (children) return <>{children}</>;

  // Si no hay children, renderizar las rutas hijas (uso en router)
  return <Outlet />;
};

export default ProtectedRoute;
