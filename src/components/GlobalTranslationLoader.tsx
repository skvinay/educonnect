import { useTranslationLoading } from "@/components/TranslationLoadingContext";

export const GlobalTranslationLoader = () => {
  const { isTranslating } = useTranslationLoading();

  if (!isTranslating) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-xl shadow-xl">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        <span className="text-sm text-muted-foreground">
          Translating content…
        </span>
      </div>
    </div>
  );
};
