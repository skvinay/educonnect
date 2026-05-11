import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Info } from "lucide-react";
import { ComponentType, useEffect, useMemo, useState } from "react";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { StreamBanner } from "@/components/StreamBanner";
import { ExamCard } from "@/components/exams/ExamCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchCareerCategories } from "@/service/services";
import { buildRawExamsData, groupExamsByStream, RawExam } from "@/data/ExamsData";

// Stream icons mapping (same as Colleges.tsx and CollegeStreamDetail.tsx)
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

// Stream gradient colors (same as CollegeStreamDetail.tsx)
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

// Stream-specific subtitles for exams
const streamExamSubtitles: Record<string, string> = {
  Engineering: "Explore engineering entrance exams and related opportunities",
  Medical: "Discover medical entrance exams and admission pathways",
  Law: "Find law entrance exams and legal education opportunities",
  "Arts & Humanities": "Browse arts and humanities entrance examinations",
  "Business Mgmt": "Explore management entrance exams and MBA pathways",
  "Pure Sciences": "Discover science entrance exams and research opportunities",
  Nursing: "Find nursing entrance exams and healthcare programs",
  "CA & CS": "Explore chartered accountancy and company secretary exams",
  Aviation: "Discover aviation and pilot training entrance exams",
  "Sports & Yoga": "Find sports and yoga certification exams",
  "Defence/NDA": "Explore defence services and NDA entrance exams",
  "Hotel & Tourism": "Browse hospitality and tourism entrance exams",
  Therapeutic: "Discover therapeutic and rehabilitation entrance exams",
  "Design & Fashion": "Explore design and fashion entrance examinations",
  Paramedical: "Find paramedical entrance exams and allied health programs",
  Veterinary: "Discover veterinary science entrance exams",
  Architecture: "Explore architecture entrance examinations",
  "Computer/IT": "Browse computer and IT certification exams",
  Agriculture: "Find agriculture and farming science entrance exams",
  "Commerce & Finance": "Explore commerce and finance entrance exams",
  "Mass Comm": "Discover mass communication and journalism entrance exams",
  Economics: "Browse economics and statistics entrance exams",
};

const ExamStreamDetail = () => {
  const { stream = "" } = useParams();
  const selectedStream = decodeURIComponent(stream);
  const [examsData, setExamsData] = useState<RawExam[]>([]);
  const [loading, setLoading] = useState(true);

  // Get icon and gradient for current stream (same as college page)
  const StreamIcon = streamIcons[selectedStream] || DefaultIcon;
  const gradientFrom = streamGradientFrom[selectedStream] || DEFAULT_GRADIENT_FROM;
  const gradientTo = streamGradientTo[selectedStream] || DEFAULT_GRADIENT_TO;
  const subtitle = streamExamSubtitles[selectedStream] || `Explore ${selectedStream} entrance exams and related opportunities`;

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCareerCategories();

        const rawData = buildRawExamsData(data);
        console.log("Total exams:", rawData.length);
        console.log(rawData.map((e) => e.official_link));
        setExamsData(rawData);
      } catch (error) {
        console.error("Failed to load exam data", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const groupedExams = useMemo(() => groupExamsByStream(examsData), [examsData]);
  const filteredExams = useMemo(
    () => groupedExams[selectedStream] ?? [],
    [groupedExams, selectedStream]
  );
  const brokenLinks = useMemo(
    () => filteredExams.filter((e) => !e.official_link || !e.official_link.startsWith("http")),
    [filteredExams]
  );

  useEffect(() => {
    if (selectedStream) {
      console.log("Filtered exams:", filteredExams.length);
      console.warn("Broken links:", brokenLinks);
    }
  }, [brokenLinks, filteredExams.length, selectedStream]);

  if (loading) {
    return <div className="py-32 text-center text-muted-foreground">Loading exams...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Full-width gradient banner - SAME as college page */}
      {selectedStream && (
        <StreamBanner
          title={`${selectedStream} Exams`}
          subtitle={subtitle}
          count={filteredExams.length}
          Icon={StreamIcon}
          gradientFrom={gradientFrom}
          gradientTo={gradientTo}
          backLink="/exams"
          backText="Back to streams"
        />
      )}

      <main className={!selectedStream ? "pt-24 pb-16" : "pb-16"}>
        <div className={!selectedStream ? "container mx-auto px-4" : "container mx-auto px-4 relative z-10"}>
          {!selectedStream ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="mb-10"
              >
                <Button asChild variant="ghost" className="mb-4 rounded-lg px-0 hover:bg-transparent">
                  <Link to="/exams" className="inline-flex items-center gap-2 text-muted-foreground">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Streams
                  </Link>
                </Button>

                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm font-medium">Entrance Exams</span>
                </div>

                <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">
                  Exams
                </h1>
                <p className="mt-3 max-w-2xl text-muted-foreground">
                  We couldn't find the requested stream. Please select a valid category.
                </p>
              </motion.div>

              <Card className="rounded-xl border-primary/15">
                <CardContent className="space-y-4 p-6">
                  <p className="text-sm text-muted-foreground">
                    This category is unavailable right now. You can explore all available exam streams.
                  </p>
                  <Button asChild className="rounded-lg">
                    <Link to="/exams">Go to Exam Streams</Link>
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : filteredExams.length === 0 ? (
            <Card className="rounded-xl border-primary/15">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">
                  No exams are currently listed for this stream. Please check back later.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Broken links warning */}
              {brokenLinks.length > 0 && (
                <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-start gap-3">
                  <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      Broken links detected: {brokenLinks.length}
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      Some exams may have incomplete or incorrect website links.
                    </p>
                  </div>
                </div>
              )}

              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
                className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]"
              >
                {filteredExams.map((exam) => (
                  <div key={exam.id} className="h-full">
                    <ExamCard exam={exam} />
                  </div>
                ))}
              </motion.section>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ExamStreamDetail;