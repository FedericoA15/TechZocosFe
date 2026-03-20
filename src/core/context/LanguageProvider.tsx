import React, { useState } from "react";
import type { Language } from "./LanguageContext";
import { LanguageContext, translations } from "./LanguageContext";

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    if (saved === "es" || saved === "en") return saved;
    return navigator.language.startsWith("es") ? "es" : "en";
  });

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

