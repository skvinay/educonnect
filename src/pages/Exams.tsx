import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import {
  Activity,
  BookOpen,
  BriefcaseBusiness,
  Building,
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
import { useEffect, useMemo, useState } from "react";
import { CareerCategory } from "@/data/dataClass";
import { fetchCareerCategories } from "@/service/services";
import { useTranslation } from "react-i18next";
import { translateText } from "@/lib/translate";
import { useTranslationLoading } from "@/components/TranslationLoadingContext";
import { buildRawExamsData, groupExamsByStream, RawExam } from "@/data/ExamsData";
import { CategoryCard } from "@/components/exams/CategoryCard";
import {
  categoryCardGradients,
  categoryCardHoverGradients,
} from "@/components/exams/categoryCardGradients";

const streamIcons = {
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
  Architecture: Building,
  "Computer/IT": Laptop,
  Agriculture: Leaf,
  "Business Mgmt": BriefcaseBusiness,
  "Commerce & Finance": IndianRupee,
  "Mass Comm": Mic,
  Economics: LineChart,
  "Arts & Humanities": VenetianMask,
} as const;

const Exams = () => {
  const [careerCategories, setCareerCategories] = useState<CareerCategory[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const { i18n } = useTranslation();
  const { setIsTranslating } = useTranslationLoading();

  const baseTexts = {
    badge: "Entrance Exams",
    heading: "Explore Exams by Stream",
    subtitle: "Select a career stream to discover relevant entrance exams and opportunities",
    loading: "Loading entrance exams...",
  };

 
  const [texts, setTexts] = useState(baseTexts);
  const [translatedCategories, setTranslatedCategories] = useState<
    CareerCategory[]
  >([]);
  const [examsData, setExamsData] = useState<RawExam[]>([]);

  
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCareerCategories();
        setCareerCategories(data);
        setTranslatedCategories(data);

        const rawData = buildRawExamsData(data);
        console.log("Total exams:", rawData.length);
        console.log(rawData.map((e) => e.official_link));
        setExamsData(rawData);
      } catch (err) {
        console.error("Failed to load categories", err);
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

        tCat.title = await translateText(cat.title, lang);
        tCat.shortTitle = await translateText(cat.shortTitle, lang);

        tCat.entranceExams = await Promise.all(
          cat.entranceExams.map(async (e) => ({
            ...e,
            name: await translateText(e.name, lang),
            programs: await translateText(e.programs, lang),
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
        console.error("Exams translation failed", e);
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

  
  const groupedExams = useMemo(() => groupExamsByStream(examsData), [examsData]);
  const groupedEntries = useMemo(() => Object.entries(groupedExams), [groupedExams]);
  const totalFromGroups = useMemo(
    () => Object.values(groupedExams).reduce((sum, arr) => sum + arr.length, 0),
    [groupedExams]
  );

  useEffect(() => {
    if (examsData.length > 0) {
      console.log("Grouped total:", totalFromGroups);

      const brokenLinks = examsData.filter(
        (e) => !e.official_link || !e.official_link.startsWith("http")
      );
      console.warn("Broken links:", brokenLinks);
    }
  }, [examsData.length, totalFromGroups]);

  
  if (loading) {
    return (
      <div className="text-center py-32 text-muted-foreground">
        {texts.loading}
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">{texts.badge}</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Explore Exams by <span className="text-secondary">Stream</span>
            </h1>

            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              {texts.subtitle}
            </p>

            {/* <p className="text-sm text-muted-foreground">
              Showing {examsData.length} of {totalFromGroups} exams
            </p> */}
            <p className="text-sm text-muted-foreground">Total Exams: {examsData.length}</p>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {groupedEntries.map(([category, exams]) => {
              const Icon = streamIcons[category as keyof typeof streamIcons] || HelpCircle;

              return (
                <CategoryCard
                  key={category}
                  title={category}
                  description={`${exams.length} Exams`}
                  icon={Icon}
                  bgColor={categoryCardGradients[category] || "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)"}
                  hoverGradient={categoryCardHoverGradients[category] || "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)"}
                  link={`/exams/${encodeURIComponent(category)}`}
                  linkText="View exams"
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

export default Exams;
