import React, { useEffect, useState } from "react";
import { 
  Users, BookOpen, MapPin, 
   UserCheck, Activity,
  Settings, Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth, useLanguage } from "../../core/context";
import { StatCard, QuickAction } from "../../shared/components/ui";

// Services (Real API calls)
import { userService } from "../../core/services/user.service";
import { studyService } from "../../core/services/study.service";
import { addressService } from "../../core/services/address.service";
import type { PaginatedResponse } from "../../core/types/api";

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isAdmin = user?.role === "Admin";

  // State with Hooks
  const [counts, setCounts] = useState({
    users: 0,
    studies: 0,
    addresses: 0,
    loading: true
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        // Explicitly typed array to handle mixed promise types
        const fetchPromises: Promise<unknown>[] = [
          studyService.getStudiesByUserId(user.id),
          addressService.getAddressesByUserId(user.id),
        ];
        
        if (isAdmin) {
          fetchPromises.push(userService.getAllUsers());
        }

        const results = await Promise.allSettled(fetchPromises);

        const studiesRes = results[0].status === 'fulfilled' ? results[0].value : [];
        const addressesRes = results[1].status === 'fulfilled' ? results[1].value : [];
        const usersRes = (isAdmin && results[2]?.status === 'fulfilled') ? results[2].value : null;

        const studies = Array.isArray(studiesRes) ? studiesRes.length : (studiesRes as PaginatedResponse<unknown>).totalItems || 0;
        const addresses = Array.isArray(addressesRes) ? addressesRes.length : (addressesRes as PaginatedResponse<unknown>).totalItems || 0;
        const usersCount = usersRes ? (usersRes as PaginatedResponse<unknown>).totalItems || 0 : 0;

        setCounts({
          users: usersCount,
          studies,
          addresses,
          loading: false
        });
      } catch (error) {
        console.error("Dashboard data error", error);
        setCounts(prev => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, [user?.id, isAdmin]);

  const stats = [
    ...(isAdmin ? [{ 
      title: t("totalUsers"), 
      value: counts.users, 
      icon: Users, 
      color: "#B8C900" 
    }] : []),
    { 
      title: t("activeStudies"), 
      value: counts.studies, 
      icon: BookOpen, 
      color: "#4285F4" 
    },
    { 
      title: t("savedAddresses"), 
      value: counts.addresses, 
      icon: MapPin, 
      color: "#34A853" 
    },
    { 
      title: isAdmin ? t("systemStatus") : t("userStatus"), 
      value: isAdmin ? t("online") : t("active"), 
      icon: isAdmin ? Activity : UserCheck, 
      color: "#EA4335" 
    },
  ];

  if (counts.loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="text-zoco-lime animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            {t("welcome")}, {user?.firstName}! 👋
          </h2>
          <p className="text-slate-500 dark:text-white/40 font-medium">
            {t("dashboardSubtitle")}
          </p>
        </div>
      
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
            {t("quickActions")}
          </h3>
          <button className="text-xs font-black text-zoco-lime hover:underline uppercase tracking-widest">
            {t("viewAll")}
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickAction 
            label={t("navProfile")} 
            icon={UserCheck} 
            onClick={() => navigate("/profile")} 
            color="#B8C900"
          />
          <QuickAction 
            label={isAdmin ? t("manageStudiesTitle") : t("navStudies")} 
            icon={BookOpen} 
            onClick={() => navigate("/studies")} 
            color="#4285F4"
          />
          <QuickAction 
            label={isAdmin ? t("manageAddressesTitle") : t("navAddresses")} 
            icon={MapPin} 
            onClick={() => navigate("/addresses")} 
            color="#34A853"
          />
          <QuickAction 
            label={isAdmin ? t("manageUsersTitle") : t("settings")} 
            icon={isAdmin ? Users : Settings} 
            onClick={() => navigate(isAdmin ? "/admin/users" : "/profile")} 
            color="#EA4335"
          />
        </div>
      </div>
    </div>
  );
};
