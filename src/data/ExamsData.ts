import { CareerCategory } from "@/data/dataClass";

export type RawExam = {
  id: string;
  name: string;
  stream: string;
  official_link: string;
  programs: string;
};

export const buildRawExamsData = (categories: CareerCategory[]): RawExam[] => {
  return categories.flatMap((category) =>
    category.entranceExams.map((exam, index) => ({
      id: `${category.id}-${index}-${exam.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name: exam.name,
      stream: category.shortTitle || category.title,
      official_link: exam.website,
      programs: exam.programs,
    }))
  );
};

export const groupExamsByStream = (examsData: RawExam[]) => {
  return examsData.reduce<Record<string, RawExam[]>>((acc, exam) => {
    const category = exam.stream?.trim() || "Uncategorized";

    if (!acc[category]) acc[category] = [];
    acc[category].push(exam);

    return acc;
  }, {});
};
