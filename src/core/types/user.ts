export type Role = "Admin" | "User";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  expiresAt: string | null;
  isAuthenticated: boolean;
}

export interface Study {
  id: string;
  userId: string;
  userFirstName?: string; // Optinal field for global views
  userLastName?: string;  // Optinal field for global views
  title: string;
  institution: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Address {
  id: string;
  userId: string;
  userFirstName?: string; // Optinal field for global views
  userLastName?: string;  // Optinal field for global views
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
