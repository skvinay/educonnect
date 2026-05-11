import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { careerCategories } from "@/data/careerData";
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  Briefcase,
  GraduationCap,
  Building2,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OpportunityChart } from "@/components/OpportunityChart";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { translateText } from "@/lib/translate";
import { useTranslationLoading } from "@/components/TranslationLoadingContext";

const CareerDetail = () => {
  const { id } = useParams();
  const foundCategory = careerCategories.find((c) => c.id === id);
  const category = foundCategory ?? careerCategories[0];

  const { i18n } = useTranslation();
  const { setIsTranslating } = useTranslationLoading();

  const baseTexts = {
    back: "Back to Careers",
    about: "About This Career",
    degreePrograms: "Degree Programs",
    careerOptions: "Career Options",
    entranceExams: "Entrance Exams After 12th",
    institutes: "Recognised Institutes",
    degree: "Degree",
    duration: "Duration",
    exam: "Exam",
    programs: "Programs",
    website: "Website",
    institute: "Institute",
    location: "Location",
    admission: "Admission",
    visit: "Visit",
    india: "India",
  };

  const [texts, setTexts] = useState(baseTexts);
  const [translatedCategory, setTranslatedCategory] = useState(category);

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
      setTranslatedCategory(category);
      return;
    }

    const t = { ...category };

    t.title = await translateText(category.title, lang);
    t.description = await translateText(category.description, lang);
    t.summary = await translateText(category.summary, lang);
    t.shortTitle = await translateText(category.shortTitle, lang);

    t.degrees = await Promise.all(
      category.degrees.map(async (d) => ({
        ...d,
        name: await translateText(d.name, lang),
      }))
    );

    t.careers = await Promise.all(
      category.careers.map(async (c) => ({
        ...c,
        title: await translateText(c.title, lang),
        description: await translateText(c.description, lang),
      }))
    );

    t.entranceExams = await Promise.all(
      category.entranceExams.map(async (e) => ({
        ...e,
        name: await translateText(e.name, lang),
        programs: await translateText(e.programs, lang),
      }))
    );

    t.institutes = await Promise.all(
      category.institutes.map(async (i) => ({
        ...i,
        name: await translateText(i.name, lang),
        admission: await translateText(i.admission, lang),
      }))
    );

    setTranslatedCategory(t);
  };

  useEffect(() => {
    let active = true;

    const translateAll = async (lang: string) => {
      if (!active) return;

      if (lang === "en") {
        setTexts(baseTexts);
        setTranslatedCategory(category);
        return;
      }

      setIsTranslating(true);

      try {
        await Promise.all([
          runUiTranslation(lang),
          runCategoryTranslation(lang),
        ]);
      } catch (e) {
        console.error("Translation failed", e);
        setTexts(baseTexts);
        setTranslatedCategory(category);
      } finally {
        if (active) setIsTranslating(false);
      }
    };

    translateAll(i18n.language);

    const handleLangChange = (lng: string) => {
      translateAll(lng);
    };

    i18n.on("languageChanged", handleLangChange);

    return () => {
      active = false;
      i18n.off("languageChanged", handleLangChange);
    };
  }, [i18n.language, category]);

  const data = translatedCategory;

  if (!foundCategory) {
    return <div className="pt-32 text-center text-lg">Career not found.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        <div className={`${data.colorClass} py-16`}>
          <div className="container mx-auto px-4">
            <Link
              to="/careers"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> {texts.back}
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white"
            >
              <span className="text-5xl mb-4 block">{data.icon}</span>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
                {data.title}
              </h1>

              <p className="text-lg opacity-90 max-w-2xl">{data.description}</p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 space-y-12">
          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> {texts.about}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {data.summary}
              </p>
            </CardContent>
          </Card>

          <OpportunityChart
            shortTerm={data.opportunities.shortTerm}
            longTerm={data.opportunities.longTerm}
            title={data.shortTitle}
          />

          {/* Degrees */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" /> {texts.degreePrograms}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{texts.degree}</TableHead>
                    <TableHead>{texts.duration}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.degrees.map((deg, i) => (
                    <TableRow key={i}>
                      <TableCell>{deg.name}</TableCell>
                      <TableCell>
                        <Clock className="w-4 h-4 inline mr-1" />
                        {deg.duration}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Careers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" /> {texts.careerOptions}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {data.careers.map((career, i) => (
                  <div key={i} className="p-4 rounded-xl bg-muted">
                    <h4 className="text-blue-500 font-bold">{career.title}</h4>
                    <p>{career.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Exams */}
          <Card>
            <CardHeader>
              <CardTitle>{texts.entranceExams}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{texts.exam}</TableHead>
                    <TableHead>{texts.programs}</TableHead>
                    <TableHead>{texts.website}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.entranceExams.map((exam, i) => (
                    <TableRow key={i}>
                      <TableCell>{exam.name}</TableCell>
                      <TableCell>{exam.programs}</TableCell>
                      <TableCell>
                        <a href={exam.website} target="_blank" rel="noreferrer">
                          {texts.visit}{" "}
                          <ExternalLink className="w-3 h-3 inline" />
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Institutes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" /> {texts.institutes}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{texts.institute}</TableHead>
                    <TableHead>{texts.location}</TableHead>
                    <TableHead>{texts.admission}</TableHead>
                    <TableHead>{texts.website}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.institutes.map((inst, i) => (
                    <TableRow key={i}>
                      <TableCell>{inst.name}</TableCell>
                      <TableCell>{inst.location || texts.india}</TableCell>
                      <TableCell>{inst.admission}</TableCell>
                      <TableCell>
                        <a href={inst.website} target="_blank" rel="noreferrer">
                          {texts.visit}{" "}
                          <ExternalLink className="w-3 h-3 inline" />
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CareerDetail;
