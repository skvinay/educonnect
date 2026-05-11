import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CareerCategory } from "@/data/dataClass";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { translateText } from "@/lib/translate";
import { useTranslationLoading } from "@/components/TranslationLoadingContext";

interface CareerCategoryCardProps {
  category: CareerCategory;
  index: number;
}

export const CareerCategoryCard = ({
  category,
  index,
}: CareerCategoryCardProps) => {
  const { i18n } = useTranslation();
  const { setIsTranslating } = useTranslationLoading();

  const [texts, setTexts] = useState<{
    shortTitle: string;
    description: string;
    degreesLabel: string;
  } | null>(null);

  const baseTexts = {
    shortTitle: category.shortTitle,
    description: category.description,
    degreesLabel: "Degrees",
  };

  // 🔹 Safe fallback to avoid null crash
  const safeTexts = texts || baseTexts;

  useEffect(() => {
    let isMounted = true;

    const runTranslation = async (lang: string) => {
      if (!isMounted) return;

      // English → instant
      if (lang === "en") {
        setTexts(baseTexts);
        return;
      }

      try {
        const t = {
          shortTitle: await translateText(baseTexts.shortTitle, lang),
          description: await translateText(baseTexts.description, lang),
          degreesLabel: await translateText(baseTexts.degreesLabel, lang),
        };

        if (isMounted) setTexts(t);
      } catch (e) {
        console.error("CareerCategoryCard translation failed", e);
        if (isMounted) setTexts(baseTexts);
      }
    };

    // Initial run
    runTranslation(i18n.language);

    const handleLangChange = (lng: string) => {
      setIsTranslating(true);
      setTexts(null);

      runTranslation(lng).finally(() => {
        setIsTranslating(false);
      });
    };

    i18n.on("languageChanged", handleLangChange);

    return () => {
      isMounted = false;
      i18n.off("languageChanged", handleLangChange);
    };
  }, [category.id]); // 🔹 re-run if category changes

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/careers/${category.id}`}>
        <div className="group relative h-full overflow-hidden rounded-2xl card-hover">
          {/* Gradient Background */}
          <div
            className={`absolute inset-0 ${category.colorClass} opacity-90 transition-opacity group-hover:opacity-100`}
          />

          {/* Content */}
          <div className="relative p-6 h-full flex flex-col text-white min-h-[200px]">
            {/* Icon */}
            <div className="text-4xl mb-4">{category.icon}</div>

            {/* Title */}
            <h3 className="font-display text-xl font-bold mb-2 group-hover:translate-x-1 transition-transform">
              {safeTexts.shortTitle}
            </h3>

            {/* Description */}
            <p className="text-sm text-white/80 mb-4 line-clamp-2 flex-grow">
              {safeTexts.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                {category.degrees.length} {safeTexts.degreesLabel}
              </span>
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
