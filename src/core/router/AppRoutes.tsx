import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "../../shared/routes/ProtectedRoute";
import { MainLayout } from "../../shared/components/layout";
import { LoginPage } from "../../pages/auth/LoginPage";
import { DashboardPage } from "../../pages/dashboard/DashboardPage";
import { AdminUsersPage } from "../../pages/admin/AdminUsersPage";
import { ProfilePage } from "../../pages/profile/ProfilePage";
import { StudiesPage } from "../../pages/studies/StudiesPage";
import { AddressesPage } from "../../pages/addresses/AddressesPage";

export const router = createBrowserRouter([
  // ── Public routes ──────────────────────────────────
  {
    path: "/login",
    element: <LoginPage />,
  },

  // ── Protected routes (Standard User/Admin) ─────────
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "studies",
        element: <StudiesPage />,
      },
      {
        path: "addresses",
        element: <AddressesPage />,
      },
      // 🚨 Admin Only Routes
      {
        path: "admin",
        children: [
          {
            path: "users",
            element: (
              <ProtectedRoute adminOnly>
                <AdminUsersPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },

  // ── Fallback ───────────────────────────────────────
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);
