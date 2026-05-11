import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { ExternalLink, MapPin } from "lucide-react";
import { ComponentType, useEffect, useMemo, useState } from "react";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { StreamBanner } from "@/components/StreamBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CareerCategory } from "@/data/dataClass";
import { translateText } from "@/lib/translate";
import { fetchCareerCategories } from "@/service/services";
import { useTranslation } from "react-i18next";
import { useTranslationLoading } from "@/components/TranslationLoadingContext";

// Stream icons mapping (same as Colleges.tsx)
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

// Stream gradient colors (extracted from categoryCardGradients)
const streamGradientFrom: Record<string, string> = {
  Engineering: "#2563EB",
  Medical: "#EC4899",
  Law: "#F59E0B",
  "Arts & Humanities": "#7C3AED",
  "Business Mgmt": "#10B981",
  "Pure Sciences": "#4F46E5",
  Nursing: "#F43F5E",
  "CA & CS": "#2563EB",
  Aviation: "#1D4ED8",
  "Sports & Yoga": "#F59E0B",
  "Defence/NDA": "#059669",
  "Hotel & Tourism": "#F97316",
  Therapeutic: "#6366F1",
  "Design & Fashion": "#DB2777",
  Paramedical: "#EC4899",
  Veterinary: "#D97706",
  Architecture: "#4F46E5",
  "Computer/IT": "#4338CA",
  Agriculture: "#10B981",
  "Commerce & Finance": "#0EA5E9",
  "Mass Comm": "#F43F5E",
  Economics: "#EAB308",
};

const streamGradientTo: Record<string, string> = {
  Engineering: "#06B6D4",
  Medical: "#F43F5E",
  Law: "#F97316",
  "Arts & Humanities": "#A855F7",
  "Business Mgmt": "#22C55E",
  "Pure Sciences": "#6366F1",
  Nursing: "#EC4899",
  "CA & CS": "#22C55E",
  Aviation: "#06B6D4",
  "Sports & Yoga": "#EA580C",
  "Defence/NDA": "#22C55E",
  "Hotel & Tourism": "#FB7185",
  Therapeutic: "#A855F7",
  "Design & Fashion": "#F43F5E",
  Paramedical: "#E11D48",
  Veterinary: "#F97316",
  Architecture: "#2563EB",
  "Computer/IT": "#6366F1",
  Agriculture: "#16A34A",
  "Commerce & Finance": "#2563EB",
  "Mass Comm": "#C026D3",
  Economics: "#F97316",
};

// Default gradient for unknown streams
const DEFAULT_GRADIENT_FROM = "#6366F1";
const DEFAULT_GRADIENT_TO = "#A855F7";
const DefaultIcon = Building2;

// Stream-specific subtitles for colleges
const streamCollegeSubtitles: Record<string, string> = {
  Engineering: "Explore engineering colleges across top specializations and locations",
  Medical: "Discover leading medical colleges and admission pathways",
  Law: "Find top law colleges and legal education opportunities",
  "Arts & Humanities": "Explore creative and humanities colleges across diverse fields",
  "Business Mgmt": "Browse top management colleges and MBA programs",
  "Pure Sciences": "Discover science colleges with research-focused programs",
  Nursing: "Find nursing colleges and healthcare training programs",
  "CA & CS": "Explore chartered accountancy and company secretary programs",
  Aviation: "Discover aviation academies and pilot training institutes",
  "Sports & Yoga": "Find sports and yoga certification institutes",
  "Defence/NDA": "Explore defence academies and NDA training programs",
  "Hotel & Tourism": "Browse hospitality and tourism management colleges",
  Therapeutic: "Discover therapeutic and rehabilitation science programs",
  "Design & Fashion": "Explore design and fashion institutes across specializations",
  Paramedical: "Find paramedical colleges and allied health programs",
  Veterinary: "Discover veterinary science colleges and animal care programs",
  Architecture: "Explore architecture colleges and design institutes",
  "Computer/IT": "Browse top computer science and IT colleges",
  Agriculture: "Find agriculture and farming science institutes",
  "Commerce & Finance": "Explore commerce colleges and finance programs",
  "Mass Comm": "Discover journalism and mass communication colleges",
  Economics: "Browse economics and statistics programs",
};

const CollegeStreamDetail = () => {
  const { stream = "" } = useParams();
  const selectedStream = decodeURIComponent(stream);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedAdmission, setSelectedAdmission] = useState("");

  const [careerCategories, setCareerCategories] = useState<CareerCategory[]>([]);
  const [translatedCategories, setTranslatedCategories] = useState<CareerCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const { i18n } = useTranslation();
  const { setIsTranslating } = useTranslationLoading();

  // Get icon and gradient for current stream
  const StreamIcon = streamIcons[selectedStream] || DefaultIcon;
  const gradientFrom = streamGradientFrom[selectedStream] || DEFAULT_GRADIENT_FROM;
  const gradientTo = streamGradientTo[selectedStream] || DEFAULT_GRADIENT_TO;
  const streamSubtitle = streamCollegeSubtitles[selectedStream] || `Explore ${selectedStream} colleges across top specializations and locations`;

  const baseTexts = {
    badge: "Colleges Directory",
    backToStreams: "Back to All Streams",
    collegesSuffix: "Colleges",
    subtitle: "Showing all colleges under this stream.",
    city: "City",
    allCities: "All Cities",
    loadingText: "Loading colleges...",
    location: "Location",
    admission: "Admission",
    visitWebsite: "Visit Website",
    emptyTitle: "No colleges found",
    emptySubtitle: "We couldn't find colleges for this stream.",
    browseAll: "Browse All Streams",
    india: "India",
  };

  const [texts, setTexts] = useState(baseTexts);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCareerCategories();
        setCareerCategories(data);
        setTranslatedCategories(data);
      } catch (error) {
        console.error("Failed to load colleges", error);
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
      t[key as keyof typeof baseTexts] = await translateText(
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
            location: i.location,
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

  const allColleges = useMemo(
    () =>
      translatedCategories.flatMap((cat) =>
        cat.institutes.map((inst) => ({
          ...inst,
          stream: cat.shortTitle,
        }))
      ),
    [translatedCategories]
  );

  const collegesByStream = useMemo(
    () =>
      allColleges.reduce<Record<string, typeof allColleges>>((acc, college) => {
        const streamKey = college.stream?.trim() || "Uncategorized";
        if (!acc[streamKey]) acc[streamKey] = [];
        acc[streamKey].push(college);
        return acc;
      }, {}),
    [allColleges]
  );

  const streamColleges = useMemo(
    () => collegesByStream[selectedStream] ?? [],
    [collegesByStream, selectedStream]
  );

  // Extract unique cities from dataset based on selected stream
  // Normalization: trim whitespace, lowercase for deduplication, then format for display
  const uniqueCities = useMemo(() => {
    const cities = streamColleges
      .map((college) => college.location)
      .filter((location): location is string => Boolean(location)) // Remove empty/null
      .map((location) => location.trim().toLowerCase()) // Normalize: trim and lowercase
      ;

    // Deduplicate using Set, then format for display with proper capitalization
    const uniqueNormalizedCities = [...new Set(cities)];

    // Format each city with proper capitalization (e.g., "bangalore" -> "Bangalore")
    return uniqueNormalizedCities
      .map((city) => city.charAt(0).toUpperCase() + city.slice(1))
      .sort((a, b) => a.localeCompare(b));
  }, [streamColleges]);

  // Extract unique admission types from dataset based on selected stream
  // Normalization: trim whitespace, lowercase for deduplication, then format for display
  const uniqueAdmissions = useMemo(() => {
    const admissions = streamColleges
      .map((college) => college.admission)
      .filter((admission): admission is string => Boolean(admission)) // Remove empty/null
      .map((admission) => admission.trim().toLowerCase()) // Normalize: trim and lowercase
      ;

    // Deduplicate using Set, then format for display with proper capitalization
    const uniqueNormalizedAdmissions = [...new Set(admissions)];

    // Format each admission with proper capitalization
    return uniqueNormalizedAdmissions
      .map((admission) => admission.charAt(0).toUpperCase() + admission.slice(1))
      .sort((a, b) => a.localeCompare(b));
  }, [streamColleges]);

  const filteredColleges = useMemo(() => {
    let result = streamColleges;

    // Filter by city (case-insensitive)
    if (selectedCity) {
      const normalizedSelectedCity = selectedCity.toLowerCase();
      result = result.filter((college) => {
        const normalizedLocation = college.location?.trim().toLowerCase();
        return normalizedLocation === normalizedSelectedCity;
      });
    }

    // Filter by admission (case-insensitive)
    if (selectedAdmission) {
      const normalizedSelectedAdmission = selectedAdmission.toLowerCase();
      result = result.filter((college) => {
        const normalizedAdmission = college.admission?.trim().toLowerCase();
        return normalizedAdmission === normalizedSelectedAdmission;
      });
    }

    return result;
  }, [streamColleges, selectedCity, selectedAdmission]);

  useEffect(() => {
    setSelectedCity("");
    setSelectedAdmission("");
  }, [selectedStream]);

  if (loading) {
    return (
      <div className="py-32 text-center text-muted-foreground">
        {texts.loadingText}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Full-width gradient banner */}
      <StreamBanner
        title={`${selectedStream} ${texts.collegesSuffix}`}
        subtitle={streamSubtitle}
        count={streamColleges.length}
        Icon={StreamIcon}
        gradientFrom={gradientFrom}
        gradientTo={gradientTo}
        backText={texts.backToStreams}
      />

      <main className="pb-16">
        <div className="container mx-auto px-4 relative z-10">
          {/* Filters - clean dropdowns without card wrapper */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex flex-wrap gap-4 mb-8 -mt-6"
          >
            {/* City Filter */}
            <select
              id="city-filter"
              value={selectedCity}
              onChange={(event) => setSelectedCity(event.target.value)}
              className="h-10 rounded-md border border-input bg-background px-4 text-sm min-w-[180px]"
            >
              <option value="">All City</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {/* Admission Filter */}
            <select
              id="admission-filter"
              value={selectedAdmission}
              onChange={(event) => setSelectedAdmission(event.target.value)}
              className="h-10 rounded-md border border-input bg-background px-4 text-sm min-w-[200px]"
            >
              <option value="">All Admission Type</option>
              {uniqueAdmissions.map((admission) => (
                <option key={admission} value={admission}>
                  {admission}
                </option>
              ))}
            </select>
          </motion.div>

          {filteredColleges.length === 0 ? (
            <Card className="rounded-xl border-primary/15">
              <CardContent className="space-y-4 p-6">
                <p className="font-medium">{texts.emptyTitle}</p>
                <p className="text-sm text-muted-foreground">{texts.emptySubtitle}</p>
                <Button asChild className="rounded-lg">
                  <Link to="/colleges">{texts.browseAll}</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
              className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]"
            >
              {filteredColleges.map((college, i) => {
                const collegeGradientFrom = streamGradientFrom[college.stream] || DEFAULT_GRADIENT_FROM;
                const collegeGradientTo = streamGradientTo[college.stream] || DEFAULT_GRADIENT_TO;
                return (
                <Card
                  key={`${college.name}-${college.website}-${i}`}
                  className="group h-full rounded-xl border-primary/15 transition-all duration-300 md:bg-white hover:scale-[1.02] hover:shadow-lg"
                  style={{
                    background: `linear-gradient(to bottom right, ${collegeGradientFrom}1A, ${collegeGradientTo}1A)`,
                  }}
                >
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">{college.name}</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {texts.location}: {college.location || texts.india}
                        </span>
                      </p>
                      <p>
                        {texts.admission}: {college.admission}
                      </p>
                    </div>

                    <Button asChild variant="outline" className="w-full justify-center rounded-lg">
                      <a href={college.website} target="_blank" rel="noopener noreferrer">
                        {texts.visitWebsite} <ExternalLink className="ml-1 h-3.5 w-3.5" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
                );})}
            </motion.section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CollegeStreamDetail;