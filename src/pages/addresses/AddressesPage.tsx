import React from "react";
import { AddressSection } from "../profile/AddressSection";
import { useAuth } from "../../core/context";

export const AddressesPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <AddressSection globalView={isAdmin} />
    </div>
  );
};
