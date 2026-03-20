import { createContext, useContext } from "react";
import type { AuthState, User } from "../types/user";

export interface AuthContextType extends AuthState {
  login: (user: User, token: string, expiresAt: string) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
