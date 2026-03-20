import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider, ThemeProvider, LanguageProvider } from "./core/context";
import { router } from "./core/router/AppRoutes";
import "./index.css";

import { Toaster } from "sonner";

// No usamos una App.tsx externa para mantener la estructura limpia centrada en el Router
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Toaster position="top-right" richColors closeButton />
          <RouterProvider router={router} />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
);
