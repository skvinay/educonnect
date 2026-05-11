import { useEffect, useState } from "react";
import { fetchProdData } from "@/service/services";
import { CareerCategory } from "@/data/dataClass";
import {
  Activity,
  BriefcaseBusiness,
  Building,
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
import { CategoryCard } from "@/components/exams/CategoryCard";
import {
  categoryCardGradients,
  categoryCardHoverGradients,
} from "@/components/exams/categoryCardGradients";

const streamIcons = {
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
  Architecture: Building,
  "Computer/IT": Laptop,
  Agriculture: Leaf,
  "Business Mgmt": BriefcaseBusiness,
  "Commerce & Finance": IndianRupee,
  "Mass Comm": Mic,
  Economics: LineChart,
  "Arts & Humanities": VenetianMask,
} as const;

export const CategoriesSection = () => {
  const [categories, setCategories] = useState<CareerCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchProdData();
        setCategories(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return <div className="text-center py-20">Loading categories...</div>;
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              title={category.shortTitle}
              description={category.description}
              icon={streamIcons[category.shortTitle as keyof typeof streamIcons]}
              bgColor={categoryCardGradients[category.shortTitle]}
              hoverGradient={categoryCardHoverGradients[category.shortTitle]}
              link={`/careers/${category.id}`}
              linkText="Explore"
            />
          ))}
        </div>
      </div>
    </section>
  );
};
