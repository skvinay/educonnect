import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { translateText } from "@/lib/translate";
import { useTranslationLoading } from "@/components/TranslationLoadingContext";

export const HeroSection = () => {
  const { i18n } = useTranslation();

  const baseTexts = {
    title: "EduConnect",
    subtitle: "An innovative career guidance and admissions solutions platform that empowers students to choose the right future, while enabling institutions to scale their reach and build a strong presence across India.",
    exploreCareers: "Explore Careers",
    findExams: "Find Exams",
    scholarships: "Scholarships",
    careerStreams: "Career Streams",
    entranceExams: "Entrance Exams",
    colleges: "Colleges",
  };

  const [texts, setTexts] = useState<Record<keyof typeof baseTexts, string> | null>(null);

  const { setIsTranslating } = useTranslationLoading();

  const safeTexts = texts || baseTexts;

  useEffect(() => {
    let isMounted = true;

    const runTranslation = async (lang: string) => {
      if (!isMounted) return;

      if (lang === "en") {
        setTexts(baseTexts);
        return;
      }

      try {
        const t = {} as Record<keyof typeof baseTexts, string>;

        t.title = await translateText(baseTexts.title, lang);
        t.subtitle = await translateText(baseTexts.subtitle, lang);
        t.exploreCareers = await translateText(baseTexts.exploreCareers, lang);
        t.findExams = await translateText(baseTexts.findExams, lang);
        t.scholarships = await translateText(baseTexts.scholarships, lang);
        t.careerStreams = await translateText(baseTexts.careerStreams, lang);
        t.entranceExams = await translateText(baseTexts.entranceExams, lang);
        t.colleges = await translateText(baseTexts.colleges, lang);

        if (isMounted) setTexts(t);
      } catch (e) {
        console.error("Hero translation failed", e);
        if (isMounted) setTexts(baseTexts);
      }
    };

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
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 animated-gradient opacity-90" />

      {/* Floating Elements (unchanged) */}
      <div className="absolute inset-0 overflow-hidden">
        {/* ... keep your motion divs unchanged ... */}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-2 leading-tight"
            style={{
              color: '#EA580C'
            }}
          >
            {safeTexts.title}
          </motion.h1>

          {/* Gradient Secondary Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            style={{
              background: 'linear-gradient(to right, #010545, #FC6906)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Your Journey to Success Starts Here
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl leading-relaxed text-center opacity-90 text-black px-6 md:px-20 lg:px-40 mb-8"
          >
            {safeTexts.subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/careers">
              <Button
                size="lg"
                className="bg-white text-[#14B8A6] hover:text-[#0D9488] hover:bg-white/90 shadow-lg group font-bold"
              >
                <GraduationCap className="w-5 h-5 mr-2" />
                {safeTexts.exploreCareers}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link to="/exams">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-[#14B8A6] hover:text-[#0D9488] hover:bg-white/20 font-bold"
              >
                {safeTexts.findExams}
              </Button>
            </Link>

            <Link to="/scholarships">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-[#14B8A6] hover:text-[#0D9488] hover:bg-white/20 font-bold"
              >
                <Award className="w-5 h-5 mr-2" />
                {safeTexts.scholarships}
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {[
            { value: "22+", label: safeTexts.careerStreams },
            { value: "100+", label: safeTexts.entranceExams },
            { value: "500+", label: safeTexts.colleges },
            { value: "50+", label: safeTexts.scholarships },
          ].map((stat, index) => (
            <div
              key={index}
              className="glass-card bg-white/40 backdrop-blur-md p-4 rounded-2xl text-center"
              style={{ borderColor: 'rgba(249,115,22,0.2)' }}
            >
              <div className="text-3xl md:text-4xl font-display font-bold mb-1" style={{ color: '#F97316' }}>
                {stat.value}
              </div>
              <div className="text-sm font-bold" style={{ color: '#010545' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator unchanged */}
    </section>
  );
};
