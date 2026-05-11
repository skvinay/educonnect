import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  CareerCategory,
  CareerSelfTest,
  OpportunityCategory,
  OpportunityCareer,
  Scholarship,
} from "@/data/dataClass";

const CAREER_CATEGORIES_COLLECTION = "careerCategories";
const SCHOLARSHIPS_COLLECTION = "nationalScholarships";
const CAREER_SELF_TEST_COLLECTION = "careerSelfTest";
const CAREER_SELF_TEST_DOC_ID = "main";
const OPPORTUNITIES_COLLECTIONS = ["career_opportunities"];

function sortByTitle<
  T extends { id: string; title?: string; name?: string; order?: number }
>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.order ?? Number.MAX_SAFE_INTEGER;

    if (orderA !== orderB) return orderA - orderB;

    const labelA = (a.title ?? a.name ?? a.id).toString().toLowerCase();
    const labelB = (b.title ?? b.name ?? b.id).toString().toLowerCase();

    return labelA.localeCompare(labelB);
  });
}

export async function fetchProdData(): Promise<CareerCategory[]> {
  return fetchCareerCategories();
}

export async function fetchNationalScholarships(): Promise<Scholarship[]> {
  const scholarshipsQuery = query(
    collection(db, SCHOLARSHIPS_COLLECTION),
    orderBy("name")
  );
  const snapshot = await getDocs(scholarshipsQuery);

  return snapshot.docs.map((item) => item.data() as Scholarship);
}

export async function fetchCareerSelfTest(): Promise<CareerSelfTest | null> {
  const snapshot = await getDoc(
    doc(db, CAREER_SELF_TEST_COLLECTION, CAREER_SELF_TEST_DOC_ID)
  );

  if (!snapshot.exists()) return null;

  return snapshot.data() as CareerSelfTest;
}

export async function fetchCareerCategories(): Promise<CareerCategory[]> {
  const categoriesQuery = query(
    collection(db, CAREER_CATEGORIES_COLLECTION),
    orderBy("title")
  );
  const snapshot = await getDocs(categoriesQuery);

  return snapshot.docs.map((item) => item.data() as CareerCategory);
}

export async function fetchOpportunityCategories(): Promise<
  OpportunityCategory[]
> {
  try {
    const snapshot = await getDocs(collection(db, "career_opportunities"));
    if (snapshot.empty) return [];

    return sortByTitle(
      snapshot.docs.map((item) => {
        const data = item.data() as Record<string, unknown>;
        return {
          id: item.id,
          title: typeof data.title === "string" ? data.title : item.id,
          ...data,
        } as OpportunityCategory;
      })
    );
  } catch (error) {
    console.error("fetchOpportunityCategories error:", error);
    throw error;
  }
}

export async function fetchOpportunityCareers(
  opportunityId: string
): Promise<OpportunityCareer[]> {
  let lastError: unknown = null;

  for (const collectionName of OPPORTUNITIES_COLLECTIONS) {
    try {
      const snapshot = await getDocs(
        collection(db, collectionName, opportunityId, "careers")
      );

      if (snapshot.empty) {
        continue;
      }

      const careers = snapshot.docs.map((item) => {
        const data = item.data() as Record<string, unknown>;

        return {
          id: item.id,
          title:
            typeof data.title === "string"
              ? data.title
              : typeof data.name === "string"
              ? data.name
              : item.id,
          ...(data as Omit<OpportunityCareer, "id" | "title">),
        } as OpportunityCareer;
      });

      return sortByTitle(careers);
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) {
    throw lastError;
  }

  return [];
}
