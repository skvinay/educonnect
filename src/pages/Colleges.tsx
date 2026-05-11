import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import {
  Activity,
  BriefcaseBusiness,
  Building2,
  Calculator,
  Cog,
  Cross,
  Dumbbell,
  FlaskConical,
  HeartPulse,
  HelpCircle,
  Hotel,
  IndianRupee,
  Laptop,
  Leaf,
  LineChart,
  Mic,
  Palette,
  PawPrint,
  Plane,
  Scale,
  Shield,
  Stethoscope,
  VenetianMask,
} from "lucide-react";
import { ComponentType, useEffect, useMemo, useState } from "react";
import { CareerCategory } from "@/data/dataClass";
import { fetchCareerCategories } from "@/service/services";
import { useTranslation } from "react-i18next";
import { translateText } from "@/lib/translate";
import { useTranslationLoading } from "@/components/TranslationLoadingContext";
import { CategoryCard } from "@/components/exams/CategoryCard";
import {
  categoryCardGradients,
  categoryCardHoverGradients,
} from "@/components/exams/categoryCardGradients";

const streamIcons: Record<string, ComponentType<{ className?: string }>> = {
  Nursing: HeartPulse,
  "CA & CS": Calculator,
  Aviation: Plane,
  "Sports & Yoga": Dumbbell,
  "Defence/NDA": Shield,
  Law: Scale,
  "Hotel & Tourism": Hotel,
  "Pure Sciences": FlaskConical,
  Therapeutic: Activity,
  "Design & Fashion": Palette,
  Paramedical: Cross,
  Medical: Stethoscope,
  Engineering: Cog,
  Veterinary: PawPrint,
  Architecture: Building2,
  "Computer/IT": Laptop,
  Agriculture: Leaf,
  "Business Mgmt": BriefcaseBusiness,
  "Commerce & Finance": IndianRupee,
  "Mass Comm": Mic,
  Economics: LineChart,
  "Arts & Humanities": VenetianMask,
};

const Colleges = () => {
  const [careerCategories, setCareerCategories] = useState<CareerCategory[]>(
    []
  );
  const [translatedCategories, setTranslatedCategories] = useState<
    CareerCategory[]
  >([]);
  const [loading, setLoading] = useState(true);

  const { i18n } = useTranslation();
  const { setIsTranslating } = useTranslationLoading();

  const baseTexts = {
    badge: "Colleges Directory",
    titleMain: "Find Your",
    titleHighlight: "College",
    subtitle: "Browse all colleges grouped dynamically by stream.",
    allStreams: "All Streams",
    streamCardButton: "View Colleges",
    loadingText: "Loading colleges...",
  };

  const [texts, setTexts] = useState(baseTexts);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCareerCategories();
        setCareerCategories(data);
        setTranslatedCategories(data);
      } catch (err) {
        console.error("Failed to load colleges", err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const runUiTranslation = async (lang: string) => {
    if (lang === "en") {
      setTexts(baseTexts);
      return;
    }

    const t = {} as Record<keyof typeof baseTexts, string>;
    for (const key of Object.keys(baseTexts)) {
      t[key] = await translateText(
        baseTexts[key as keyof typeof baseTexts],
        lang
      );
    }

    setTexts(t);
  };

  const runCategoryTranslation = async (lang: string) => {
    if (lang === "en") {
      setTranslatedCategories(careerCategories);
      return;
    }

    const translated = await Promise.all(
      careerCategories.map(async (cat) => {
        const tCat = { ...cat };

        tCat.shortTitle = await translateText(cat.shortTitle, lang);

        tCat.institutes = await Promise.all(
          cat.institutes.map(async (i) => ({
            ...i,
            name: await translateText(i.name, lang),
            admission: await translateText(i.admission, lang),
            location: i.location
              ? await translateText(i.location, lang)
              : i.location,
          }))
        );

        return tCat;
      })
    );

    setTranslatedCategories(translated);
  };

  useEffect(() => {
    let active = true;

    const translateAll = async (lang: string) => {
      if (!active) return;

      if (lang === "en") {
        setTexts(baseTexts);
        setTranslatedCategories(careerCategories);
        return;
      }

      setIsTranslating(true);

      try {
        await Promise.all([
          runUiTranslation(lang),
          runCategoryTranslation(lang),
        ]);
      } catch (e) {
        console.error("Colleges translation failed", e);
        setTexts(baseTexts);
        setTranslatedCategories(careerCategories);
      } finally {
        if (active) setIsTranslating(false);
      }
    };

    if (careerCategories.length > 0) {
      translateAll(i18n.language);
    }

    const handleLangChange = (lng: string) => {
      translateAll(lng);
    };

    i18n.on("languageChanged", handleLangChange);

    return () => {
      active = false;
      i18n.off("languageChanged", handleLangChange);
    };
  }, [i18n.language, careerCategories]);

  const allColleges = translatedCategories.flatMap((cat) =>
    cat.institutes.map((inst) => ({
      ...inst,
      stream: cat.shortTitle,
    }))
  );

  const collegesByStream = useMemo(
    () =>
      allColleges.reduce<Record<string, typeof allColleges>>((acc, college) => {
        const stream = college.stream?.trim() || "Uncategorized";
        if (!acc[stream]) acc[stream] = [];
        acc[stream].push(college);
        return acc;
      }, {}),
    [allColleges]
  );

  const streamEntries = useMemo(
    () => Object.entries(collegesByStream),
    [collegesByStream]
  );

  const totalColleges = allColleges.length;
  const totalFromGroups = useMemo(
    () => streamEntries.reduce((sum, [, colleges]) => sum + colleges.length, 0),
    [streamEntries]
  );

  useEffect(() => {
    if (loading) return;

    if (totalColleges !== totalFromGroups) {
      console.error(
        `Colleges grouping mismatch: total=${totalColleges}, grouped=${totalFromGroups}`
      );
    }
  }, [loading, totalColleges, totalFromGroups]);

  if (loading) {
    return (
      <div className="text-center py-32 text-muted-foreground">
        {texts.loadingText}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-4">
              <Building2 className="w-4 h-4" />
              <span className="text-sm font-medium">{texts.badge}</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              {texts.titleMain}{" "}
              <span className="text-secondary">{texts.titleHighlight}</span>
            </h1>

            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              {texts.subtitle}
            </p>

            <p className="text-sm text-muted-foreground">
              {streamEntries.length} {texts.allStreams} • {totalColleges} Colleges
            </p>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {streamEntries.map(([streamName, colleges]) => {
              const Icon = streamIcons[streamName] || HelpCircle;

              return (
                <CategoryCard
                  key={streamName}
                  title={streamName}
                  description={`${colleges.length} Colleges`}
                  icon={Icon}
                  bgColor={categoryCardGradients[streamName] || "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)"}
                  hoverGradient={categoryCardHoverGradients[streamName] || "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)"}
                  link={`/colleges/${encodeURIComponent(streamName)}`}
                  linkText="View colleges"
                />
              );
            })}
          </motion.section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Colleges;