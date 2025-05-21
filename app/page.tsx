import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedNews } from "@/components/home/featured-news";
import { LatestNews } from "@/components/home/latest-news";
import { CategoriesSection } from "@/components/home/categories-section";
 

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturedNews />
        <LatestNews />
        <CategoriesSection />
      </main>
      <Footer />
    </div>
  );
}