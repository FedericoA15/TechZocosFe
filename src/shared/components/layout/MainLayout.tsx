import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useAuth, useLanguage } from "../../../core/context";

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";

  const pageTitles: Record<string, string> = {
    "/dashboard":       t("navDashboard"),
    "/profile":         t("navProfile"),
    "/studies":         isAdmin ? t("manageStudiesTitle") : t("navStudies"),
    "/addresses":       isAdmin ? t("manageAddressesTitle") : t("navAddresses"),
    "/admin/users":     t("manageUsersTitle"),
  };

  const title = pageTitles[pathname] ?? t("panel");

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-zoco-navy transition-colors duration-300">
      {/* Sidebar — sticky on desktop, drawer on mobile */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* TopBar */}
        <TopBar
          onMenuOpen={() => setSidebarOpen(true)}
          title={title}
        />

        {/* Page content — injected by react-router-dom */}
        <main className="flex-1 p-5 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
