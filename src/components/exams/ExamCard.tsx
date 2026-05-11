import { ExternalLink } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RawExam } from "@/data/ExamsData";

type ExamCardProps = {
  exam: RawExam;
};

// Stream gradient colors (same as categoryCardGradients)
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

const DEFAULT_FROM = "#6366F1";
const DEFAULT_TO = "#A855F7";

export const ExamCard = ({ exam }: ExamCardProps) => {
  const streamKey = exam.stream || "Engineering";
  const gradientFrom = streamGradientFrom[streamKey] || DEFAULT_FROM;
  const gradientTo = streamGradientTo[streamKey] || DEFAULT_TO;

  return (
    <Card
      className="flex h-full flex-col rounded-xl border-primary/15 transition-all duration-300 md:bg-white hover:-translate-y-1 hover:shadow-lg"
      style={{
        background: `linear-gradient(to bottom right, ${gradientFrom}1A, ${gradientTo}1A)`,
      }}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-xl leading-snug">{exam.name}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        <p className="text-sm text-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">
          {exam.programs}
        </p>

        <div className="mt-auto pt-5">
          <Button asChild variant="outline" className="w-full rounded-lg text-sm font-semibold">
            <a href={exam.official_link} target="_blank" rel="noopener noreferrer">
              Learn More
              <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};