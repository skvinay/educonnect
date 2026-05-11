import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { careerCategories } from "@/data/careerData";
import { useState } from "react";
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
  Search,
  Shield,
  Stethoscope,
  VenetianMask,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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

const Careers = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = careerCategories.filter(
    (cat) =>
      cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Explore <span className="text-secondary">Career Paths</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Discover 22+ career streams across arts, science, commerce, and professional courses.
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search careers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl"
              />
            </div>
          </motion.div>

          {/* Grid */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredCategories.map((category) => (
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
          </motion.section>

          {filteredCategories.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              No careers found matching "{searchQuery}"
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
