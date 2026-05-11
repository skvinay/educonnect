import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchNationalScholarships } from "@/service/services";
import { Scholarship } from "@/data/dataClass";
import { useTranslation } from "react-i18next";
import { translateText } from "@/lib/translate";
import { useTranslationLoading } from "@/components/TranslationLoadingContext";

const Scholarships = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [translatedScholarships, setTranslatedScholarships] = useState<
    Scholarship[]
  >([]);
  const [loading, setLoading] = useState(true);

  const { i18n } = useTranslation();
  const { setIsTranslating } = useTranslationLoading();

  const baseTexts = {
    loadingText: "Loading scholarships...",
    badge: "Financial Aid",
    titleMain: "National",
    titleHighlight: "Scholarships",
    subtitle:
      "Explore scholarship opportunities to fund your higher education journey.",
    eligibility: "Eligibility",
    benefits: "Benefits",
    applyNow: "Apply Now",
  };

  const [texts, setTexts] = useState(baseTexts);

  useEffect(() => {
    const loadScholarships = async () => {
      try {
        const data = await fetchNationalScholarships();
        setScholarships(data);
        setTranslatedScholarships(data);
      } catch (error) {
        console.error("Failed to fetch scholarships", error);
      } finally {
        setLoading(false);
      }
    };

    loadScholarships();
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

  const runScholarshipTranslation = async (lang: string) => {
    if (lang === "en") {
      setTranslatedScholarships(scholarships);
      return;
    }

    const translated = await Promise.all(
      scholarships.map(async (s) => ({
        ...s,
        name: await translateText(s.name, lang),
        eligibility: await translateText(s.eligibility, lang),
        benefits: await translateText(s.benefits, lang),
      }))
    );

    setTranslatedScholarships(translated);
  };

  useEffect(() => {
    let active = true;

    const translateAll = async (lang: string) => {
      if (!active) return;

      if (lang === "en") {
        setTexts(baseTexts);
        setTranslatedScholarships(scholarships);
        return;
      }

      setIsTranslating(true);

      try {
        await Promise.all([
          runUiTranslation(lang),
          runScholarshipTranslation(lang),
        ]);
      } catch (e) {
        console.error("Scholarships translation failed", e);
        setTexts(baseTexts);
        setTranslatedScholarships(scholarships);
      } finally {
        if (active) setIsTranslating(false);
      }
    };

    if (scholarships.length > 0) {
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
  }, [i18n.language, scholarships]);

  if (loading) {
    return (
      <div className="text-center py-20 text-muted-foreground">
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber/10 text-amber mb-4">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">{texts.badge}</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              {texts.titleMain}{" "}
              <span className="text-secondary">{texts.titleHighlight}</span>
            </h1>

            <p className="text-muted-foreground max-w-2xl mx-auto">
              {texts.subtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {translatedScholarships.map((scholarship, index) => (
              <motion.div
                key={scholarship.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full card-hover">
                  <CardHeader>
                    <CardTitle className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl gradient-amber flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-lg">{scholarship.name}</span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-1">
                        {texts.eligibility}
                      </h4>
                      <p className="text-sm">{scholarship.eligibility}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-1">
                        {texts.benefits}
                      </h4>
                      <p className="text-sm font-medium text-primary">
                        {scholarship.benefits}
                      </p>
                    </div>

                    <a
                      href={scholarship.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                      >
                        {texts.applyNow}{" "}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Scholarships;
