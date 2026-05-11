import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { fetchCareerSelfTest, fetchCareerCategories } from "@/service/services";
import { CareerCategory, CareerSelfTest } from "@/data/dataClass";
import { useTranslation } from "react-i18next";
import { translateText } from "@/lib/translate";
import { useTranslationLoading } from "@/components/TranslationLoadingContext";

const CareerTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const [careerSelfTest, setCareerSelfTest] = useState<CareerSelfTest | null>(
    null
  );
  const [careerCategories, setCareerCategories] = useState<CareerCategory[]>(
    []
  );
  const [translatedCategories, setTranslatedCategories] = useState<
    CareerCategory[]
  >([]);
  const [translatedTest, setTranslatedTest] = useState<CareerSelfTest | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const { i18n } = useTranslation();
  const { setIsTranslating } = useTranslationLoading();

  const baseTexts = {
    mainTitle: "Career Selection Self-Test for Students",
    mainSubtitle:
      "Answer these questions to discover which career path might be right for you!",
    badge: "Career Discovery",
    questionLabel: "Question",
    of: "of",
    complete: "Complete",
    previous: "Previous",
    next: "Next",
    seeResults: "See Results",
    resultsTitle: "Your Career Matches",
    resultsSubtitle:
      "Based on your responses, here are your top career recommendations",
    matchScore: "Match Score",
    takeAgain: "Take Test Again",
  };

  const [texts, setTexts] = useState(baseTexts);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [test, categories] = await Promise.all([
          fetchCareerSelfTest(),
          fetchCareerCategories(),
        ]);

        setCareerSelfTest(test);
        setTranslatedTest(test);
        setCareerCategories(categories);
        setTranslatedCategories(categories);
      } catch (err) {
        console.error("Failed to load career test data", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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

  const runTestTranslation = async (lang: string) => {
    if (!careerSelfTest) return;

    if (lang === "en") {
      setTranslatedTest(careerSelfTest);
      return;
    }

    const tTest: CareerSelfTest = {
      ...careerSelfTest,
      questions: await Promise.all(
        careerSelfTest.questions.map(async (q) => ({
          ...q,
          question: await translateText(q.question, lang),
          options: await Promise.all(
            q.options.map(async (o) => ({
              ...o,
              text: await translateText(o.text, lang),
            }))
          ),
        }))
      ),
    };

    setTranslatedTest(tTest);
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
        tCat.description = await translateText(cat.description, lang);

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
        setTranslatedTest(careerSelfTest);
        setTranslatedCategories(careerCategories);
        return;
      }

      setIsTranslating(true);

      try {
        await Promise.all([
          runUiTranslation(lang),
          runTestTranslation(lang),
          runCategoryTranslation(lang),
        ]);
      } catch (e) {
        console.error("CareerTest translation failed", e);
        setTexts(baseTexts);
        setTranslatedTest(careerSelfTest);
        setTranslatedCategories(careerCategories);
      } finally {
        if (active) setIsTranslating(false);
      }
    };

    if (careerSelfTest && careerCategories.length > 0) {
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
  }, [i18n.language, careerSelfTest, careerCategories]);

  if (loading || !translatedTest) {
    return <div className="text-center py-32">Loading career test...</div>;
  }

  const questions = translatedTest.questions;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  const calculateResults = () => {
    const streamScores: Record<string, number> = {};

    answers.forEach((answerIndex, questionIndex) => {
      const selectedOption = questions[questionIndex].options[answerIndex];
      if (selectedOption) {
        selectedOption.streams.forEach((stream) => {
          streamScores[stream] = (streamScores[stream] || 0) + 1;
        });
      }
    });

    const sortedStreams = Object.entries(streamScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    return sortedStreams
      .map(([streamId, score]) => {
        const category = translatedCategories.find((c) => c.id === streamId);
        return { category, score };
      })
      .filter((r) => r.category);
  };

  const results = showResults ? calculateResults() : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">{texts.badge}</span>
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
              {texts.mainTitle}
            </h1>
            <p className="text-muted-foreground">{texts.mainSubtitle}</p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key="questions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="glass-card">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">
                        {texts.questionLabel} {currentQuestion + 1} {texts.of}{" "}
                        {questions.length}
                      </span>
                      <span className="text-sm font-medium text-primary">
                        {Math.round(progress)}% {texts.complete}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <CardTitle className="text-xl">
                      {questions[currentQuestion].question}
                    </CardTitle>

                    <div className="space-y-3">
                      {questions[currentQuestion].options.map(
                        (option, index) => (
                          <button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                              answers[currentQuestion] === index
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50 hover:bg-muted/50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                  answers[currentQuestion] === index
                                    ? "border-primary bg-primary"
                                    : "border-muted-foreground"
                                }`}
                              >
                                {answers[currentQuestion] === index && (
                                  <CheckCircle className="w-4 h-4 text-white" />
                                )}
                              </div>
                              <span className="font-medium">{option.text}</span>
                            </div>
                          </button>
                        )
                      )}
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button
                        variant="outline"
                        onClick={prevQuestion}
                        disabled={currentQuestion === 0}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {texts.previous}
                      </Button>

                      <Button
                        onClick={nextQuestion}
                        disabled={answers[currentQuestion] === undefined}
                        className="gradient-primary text-white"
                      >
                        {currentQuestion === questions.length - 1
                          ? texts.seeResults
                          : texts.next}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="glass-card">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-hero flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>

                    <CardTitle className="text-2xl">
                      {texts.resultsTitle}
                    </CardTitle>

                    <p className="text-muted-foreground">
                      {texts.resultsSubtitle}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {results.map((result, index) => (
                      <Link
                        key={result.category!.id}
                        to={`/careers/${result.category!.id}`}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 rounded-xl border border-border hover:border-primary/50 transition-all hover:shadow-md cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-xl ${
                                result.category!.colorClass
                              } flex items-center justify-center text-2xl`}
                            >
                              {result.category!.icon}
                            </div>

                            <div className="flex-1">
                              <h3 className="font-semibold">
                                {result.category!.title}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {result.category!.description}
                              </p>
                            </div>

                            <div className="text-right">
                              <span className="text-xs text-muted-foreground">
                                {texts.matchScore}
                              </span>
                              <p className="font-bold text-primary">
                                {result.score}/{questions.length}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    ))}

                    <div className="flex justify-center pt-4">
                      <Button onClick={resetTest} variant="outline">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        {texts.takeAgain}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CareerTest;
