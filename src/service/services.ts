import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CareerCategory, CareerSelfTest, Scholarship } from "@/data/dataClass";

const CAREER_CATEGORIES_COLLECTION = "careerCategories";
const SCHOLARSHIPS_COLLECTION = "nationalScholarships";
const CAREER_SELF_TEST_COLLECTION = "careerSelfTest";
const CAREER_SELF_TEST_DOC_ID = "main";

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
