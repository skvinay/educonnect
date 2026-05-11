import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CategoriesSection } from "@/components/CategoriesSection";
import { HeroCarousel } from "@/components/HeroCarousel";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <HeroCarousel />
      <CategoriesSection />
      <Footer />
    </div>
  );
};

export default Index;
