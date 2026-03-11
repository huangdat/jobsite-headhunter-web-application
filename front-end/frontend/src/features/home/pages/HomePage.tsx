import { Navbar } from "../components/Navbar";
import { HeroSection } from "../components/HeroSection";
import { RecommendedJobs } from "../components/RecommendedJobs";
import { TopCompanies } from "../components/TopCompanies";
import { FeaturedJobs } from "../components/FeaturedJobs";
import { Footer } from "../components/Footer";

export function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <RecommendedJobs />
      <TopCompanies />
      <FeaturedJobs />
      <Footer />
    </>
  );
}
