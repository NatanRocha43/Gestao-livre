"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface PrivacyContextType {
  isVisible: boolean;
  toggleVisibility: () => void;
}

const PrivacyContext = createContext<PrivacyContextType>({
  isVisible: true,
  toggleVisibility: () => {},
});

export const PrivacyProvider = ({ children }: { children: ReactNode }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Lê a preferência do usuário do cache do navegador (LocalStorage)
  useEffect(() => {
    const saved = localStorage.getItem("gestao-ai-privacy");
    if (saved !== null) {
      setIsVisible(JSON.parse(saved));
    }
  }, []);

  // Altera a visibilidade e salva no navegador
  const toggleVisibility = () => {
    setIsVisible((prev) => {
      const newValue = !prev;
      localStorage.setItem("gestao-ai-privacy", JSON.stringify(newValue));
      return newValue;
    });
  };

  return (
    <PrivacyContext.Provider value={{ isVisible, toggleVisibility }}>
      {children}
    </PrivacyContext.Provider>
  );
};

export const usePrivacy = () => useContext(PrivacyContext);
