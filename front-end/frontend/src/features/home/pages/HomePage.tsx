import { HeroSection } from "../components/HeroSection";
import { RecommendedJobs } from "../components/RecommendedJobs";
import { TopCompanies } from "../components/TopCompanies";
import { FeaturedJobs } from "../components/FeaturedJobs";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <RecommendedJobs />
      <TopCompanies />
      <FeaturedJobs />
    </>
  );
}
