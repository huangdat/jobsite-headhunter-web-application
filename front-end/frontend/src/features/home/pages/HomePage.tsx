import { HeroSection } from "../components/HeroSection";
import { RecommendedJobs } from "../components/RecommendedJobs";
import { TopCompanies } from "../components/TopCompanies";
import { FeaturedJobs } from "../components/FeaturedJobs";
import { useAuth } from "@/features/auth/context/useAuth";

export function HomePage() {
  const { user } = useAuth();

  const isCandidate = user?.role?.toString().toLowerCase() === "candidate";

  return (
    <>
      <HeroSection />

      {isCandidate && <RecommendedJobs />}

      <TopCompanies />
      <FeaturedJobs />
    </>
  );
}
