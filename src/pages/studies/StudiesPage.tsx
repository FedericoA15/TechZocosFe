import React from "react";
import { StudySection } from "../profile/StudySection";
import { useAuth } from "../../core/context";

export const StudiesPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <StudySection globalView={isAdmin} />
    </div>
  );
};
