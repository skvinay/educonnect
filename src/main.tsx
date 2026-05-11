import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./lib/i18n";
import { AuthProvider } from "@/service/AuthContent.tsx";
import { TranslationLoadingProvider } from "@/components/TranslationLoadingContext.tsx";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <TranslationLoadingProvider>
      <App />
    </TranslationLoadingProvider>
  </AuthProvider>
);
