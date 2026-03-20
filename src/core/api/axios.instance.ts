import axios from "axios";
import type { AxiosInstance } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el Token JWT en cada petición
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores globales (401, 429)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido: Limpiar y redirigir
      sessionStorage.clear();
      window.location.href = "/login?expired=true";
    }

    if (error.response?.status === 429) {
      // Rate Limit: Avisar al usuario (usualmente con un Toast)
      console.error("Too many requests. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export default api;
