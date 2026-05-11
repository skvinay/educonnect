import { createContext, useContext, useState, ReactNode } from "react";

type TranslationLoadingContextType = {
  isTranslating: boolean;
  setIsTranslating: (v: boolean) => void;
};

const TranslationLoadingContext =
  createContext<TranslationLoadingContextType | null>(null);

export const TranslationLoadingProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isTranslating, setIsTranslating] = useState(false);

  return (
    <TranslationLoadingContext.Provider
      value={{ isTranslating, setIsTranslating }}
    >
      {children}
    </TranslationLoadingContext.Provider>
  );
};

export const useTranslationLoading = () => {
  const ctx = useContext(TranslationLoadingContext);
  if (!ctx) {
    throw new Error(
      "useTranslationLoading must be used inside TranslationLoadingProvider"
    );
  }
  return ctx;
};
