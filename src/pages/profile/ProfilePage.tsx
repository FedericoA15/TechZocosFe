import React from "react";
import { useLanguage } from "../../core/context";
import { PersonalSection } from "./PersonalSection";
import { StudySection } from "./StudySection";
import { AddressSection } from "./AddressSection";

export const ProfilePage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
          {t("profileTitle")}
        </h2>
        <p className="text-slate-500 dark:text-white/40 font-medium max-w-2xl">
          {t("profileSubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Personal Info & Studies */}
        <div className="space-y-8">
          <PersonalSection />
          <StudySection />
        </div>

        {/* Right Column: Addresses & potentially more */}
        <div className="space-y-8">
          <AddressSection />
        </div>
      </div>
    </div>
  );
};
