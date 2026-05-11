import { get, ref } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { CareerCategory, CareerSelfTest, Scholarship } from "@/data/dataClass";

export async function fetchProdData(): Promise<CareerCategory[]> {
  const snapshot = await get(ref(rtdb, "prod/careerCategories"));

  if (!snapshot.exists()) {
    return [];
  }

  const rawData = snapshot.val();

  return Object.values(rawData) as CareerCategory[];
}

export async function fetchNationalScholarships(): Promise<Scholarship[]> {
  const snapshot = await get(ref(rtdb, "prod/nationalScholarships"));

  if (!snapshot.exists()) {
    return [];
  }

  const rawData = snapshot.val();

  return Object.values(rawData) as Scholarship[];
}

export async function fetchCareerSelfTest(): Promise<CareerSelfTest | null> {
  const snapshot = await get(ref(rtdb, "prod/careerSelfTest"));

  if (!snapshot.exists()) return null;

  return snapshot.val() as CareerSelfTest;
}

export async function fetchCareerCategories(): Promise<CareerCategory[]> {
  const snapshot = await get(ref(rtdb, "prod/careerCategories"));

  if (!snapshot.exists()) return [];

  return Object.values(snapshot.val()) as CareerCategory[];
}
