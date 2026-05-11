import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  ChevronRight,
  Layers3,
  Loader2,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  OpportunityCategory,
  OpportunityCareer,
  OpportunityValue,
} from "@/data/dataClass";
import {
  fetchOpportunityCareers,
  fetchOpportunityCategories,
} from "@/service/services";

const HIDDEN_CAREER_KEYS = new Set(["id", "title", "description", "order"]);
const HIDDEN_SECTION_KEYS = new Set([
  "id",
  "title",
  "description",
  "order",
  "sections",
]);

const formatLabel = (value: string) =>
  value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const isPrimitive = (
  value: OpportunityValue
): value is string | number | boolean | null =>
  value === null || ["string", "number", "boolean"].includes(typeof value);

const renderPrimitive = (value: string | number | boolean | null) => {
  if (value === null)
    return <span className="text-muted-foreground">Not available</span>;

  if (typeof value === "boolean") {
    return (
      <Badge variant={value ? "default" : "secondary"}>
        {value ? "Yes" : "No"}
      </Badge>
    );
  }

  const text = String(value);
  const isUrl = /^https?:\/\//i.test(text);

  if (isUrl) {
    return (
      <a
        href={text}
        target="_blank"
        rel="noreferrer"
        className="text-primary underline underline-offset-4 break-all"
      >
        {text}
      </a>
    );
  }

  return <span className="break-words">{text}</span>;
};

const renderOpportunityValue = (
  value: OpportunityValue,
  path: string
): JSX.Element => {
  if (isPrimitive(value)) {
    return (
      <div className="text-sm text-foreground">{renderPrimitive(value)}</div>
    );
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return (
        <p className="text-sm text-muted-foreground">No items available.</p>
      );
    }

    const allPrimitive = value.every(isPrimitive);

    if (allPrimitive) {
      return (
        <ul className="space-y-2">
          {value.map((item, index) => (
            <li
              key={`${path}-${index}`}
              className="flex items-start gap-2 text-sm text-foreground"
            >
              <ChevronRight className="mt-0.5 h-4 w-4 text-primary shrink-0" />
              <div>{renderPrimitive(item)}</div>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <div className="grid gap-3 md:grid-cols-2">
        {value.map((item, index) => (
          <div
            key={`${path}-${index}`}
            className="rounded-xl border bg-muted/30 p-4"
          >
            {renderOpportunityValue(item, `${path}-${index}`)}
          </div>
        ))}
      </div>
    );
  }

  const entries = Object.entries(value).filter(
    ([, nestedValue]) => nestedValue !== undefined
  );

  if (entries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No details available.</p>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map(([nestedKey, nestedValue]) => (
        <div
          key={`${path}-${nestedKey}`}
          className="rounded-xl border bg-background p-4"
        >
          <h4 className="mb-2 text-sm font-semibold text-foreground">
            {formatLabel(nestedKey)}
          </h4>
          {renderOpportunityValue(nestedValue, `${path}-${nestedKey}`)}
        </div>
      ))}
    </div>
  );
};

const getCareerSections = (career: OpportunityCareer) => {
  const explicitSections = career.sections;

  const derivedSections = Object.entries(career)
    .filter(
      ([key, value]) => !HIDDEN_SECTION_KEYS.has(key) && value !== undefined
    )
    .map(([key, value]) => [key, value] as const);

  if (
    explicitSections &&
    typeof explicitSections === "object" &&
    !Array.isArray(explicitSections)
  ) {
    return [
      ...Object.entries(explicitSections).filter(
        ([, value]) => value !== undefined
      ),
      ...derivedSections,
    ];
  }

  return derivedSections;
};

const Opportunities = () => {
  const [categories, setCategories] = useState<OpportunityCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [careers, setCareers] = useState<OpportunityCareer[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingCareers, setLoadingCareers] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [careersError, setCareersError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      setCategoriesError(null);

      try {
        const data = await fetchOpportunityCategories();
        setCategories(data);

        if (data.length > 0) {
          setSelectedCategoryId((current) => current || data[0].id);
        }
      } catch (error) {
        console.error("Failed to load opportunity categories", error);
        setCategoriesError("Unable to load opportunities right now.");
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategoryId) {
      setCareers([]);
      return;
    }

    const loadCareers = async () => {
      setLoadingCareers(true);
      setCareersError(null);

      try {
        const data = await fetchOpportunityCareers(selectedCategoryId);
        setCareers(data);
      } catch (error) {
        console.error("Failed to load opportunity careers", error);
        setCareersError("Unable to load careers for the selected opportunity.");
        setCareers([]);
      } finally {
        setLoadingCareers(false);
      }
    };

    loadCareers();
  }, [selectedCategoryId]);

  const selectedCategory = useMemo(
    () =>
      categories.find((category) => category.id === selectedCategoryId) ?? null,
    [categories, selectedCategoryId]
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium text-primary">
              <BriefcaseBusiness className="h-4 w-4" />
              Explore Opportunities
            </div>

            <h1 className="font-display text-4xl font-bold md:text-5xl">
              Discover <span className="text-secondary">Opportunity Paths</span>
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-muted-foreground">
              Choose an opportunity title to load its careers collection. Each
              career is rendered flexibly so different section structures from
              Firestore can be displayed cleanly.
            </p>
          </motion.div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers3 className="h-5 w-5" />
                Select Opportunity Category
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingCategories ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading opportunities...
                </div>
              ) : categoriesError ? (
                <p className="text-sm text-destructive">{categoriesError}</p>
              ) : categories.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No opportunities found.
                </p>
              ) : (
                <>
                  <Select
                    value={selectedCategoryId}
                    onValueChange={setSelectedCategoryId}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Choose an opportunity" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedCategory?.description && (
                    <p className="text-sm text-muted-foreground">
                      {selectedCategory.description}
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {loadingCareers ? (
            <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading careers...
            </div>
          ) : careersError ? (
            <Card>
              <CardContent className="py-10 text-center text-destructive">
                {careersError}
              </CardContent>
            </Card>
          ) : selectedCategoryId && careers.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No careers found for this opportunity yet.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {careers.map((career) => {
                const sections = getCareerSections(career);
                const metadata = Object.entries(career).filter(
                  ([key, value]) =>
                    !HIDDEN_CAREER_KEYS.has(key) &&
                    key !== "sections" &&
                    isPrimitive(value)
                );

                return (
                  <motion.div
                    key={career.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="overflow-hidden">
                      <CardHeader className="bg-muted/40">
                        <CardTitle className="text-2xl">
                          {career.title}
                        </CardTitle>
                        {career.description && (
                          <p className="text-sm text-muted-foreground">
                            {career.description}
                          </p>
                        )}
                      </CardHeader>

                      <CardContent className="space-y-6 pt-6">
                        {metadata.length > 0 && (
                          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {metadata.map(([key, value]) => (
                              <div
                                key={`${career.id}-${key}`}
                                className="rounded-xl border p-4"
                              >
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                  {formatLabel(key)}
                                </p>
                                {renderOpportunityValue(
                                  value,
                                  `${career.id}-${key}`
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {sections.length > 0 ? (
                          <div className="space-y-5">
                            {sections.map(([sectionKey, sectionValue]) => (
                              <div
                                key={`${career.id}-${sectionKey}`}
                                className="rounded-2xl border p-5"
                              >
                                <h3 className="mb-4 text-lg font-semibold">
                                  {formatLabel(sectionKey)}
                                </h3>
                                {renderOpportunityValue(
                                  sectionValue as OpportunityValue,
                                  `${career.id}-${sectionKey}`
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No flexible sections available for this career yet.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Opportunities;
