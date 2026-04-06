import { HeroSection } from "../components/HeroSection";
import { RecommendedJobs } from "../components/RecommendedJobs";
import { TopCompanies } from "../components/TopCompanies";
import { FeaturedJobs } from "../components/FeaturedJobs";
import { ErrorBoundary } from "@/shared/components/states/ErrorBoundary";
import { useAuth } from "@/features/auth/context/useAuth";

export function HomePage() {
  const { user } = useAuth();

  const isCandidate = user?.role?.toString().toLowerCase() === "candidate";

  return (
    <ErrorBoundary>
      <HeroSection />

      {isCandidate && <RecommendedJobs />}

      <TopCompanies />
      <FeaturedJobs />
    </ErrorBoundary>
  );
}
