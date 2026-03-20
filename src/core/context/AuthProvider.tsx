import React, { useState } from "react";
import type { AuthState, User } from "../types/user";
import { AuthContext } from "./AuthContext";
import { authService } from "../services/auth.service";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Restauramos sesión al recargar la página
    const storedUser = sessionStorage.getItem("user");
    const storedToken = sessionStorage.getItem("token");
    const storedExpiresAt = sessionStorage.getItem("expiresAt");

    if (storedUser && storedToken && storedExpiresAt) {
      try {
        return {
          user: JSON.parse(storedUser),
          token: storedToken,
          expiresAt: storedExpiresAt,
          isAuthenticated: true,
        };
      } catch (e) {
        console.error("Fallo al parsear el usuario del storage", e);
      }
    }
    return { user: null, token: null, expiresAt: null, isAuthenticated: false };
  });

  const login = (user: User, token: string, expiresAt: string) => {
    sessionStorage.setItem("user", JSON.stringify(user));
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("expiresAt", expiresAt);
    setAuthState({ user, token, expiresAt, isAuthenticated: true });
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.warn("API Logout failed, clearing local session anyway", e);
    } finally {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("expiresAt");
      setAuthState({
        user: null,
        token: null,
        expiresAt: null,
        isAuthenticated: false,
      });
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

