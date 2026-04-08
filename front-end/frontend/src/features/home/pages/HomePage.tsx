import { useEffect } from "react";
import { HeroSection } from "../components/HeroSection";
import { RecommendedJobs } from "../components/RecommendedJobs";
import { TopCompanies } from "../components/TopCompanies";
import { FeaturedJobs } from "../components/FeaturedJobs";
import { ErrorBoundary } from "@/shared/common-blocks/ErrorBoundary";
import { useAuth } from "@/features/auth/context/useAuth";

export function HomePage() {
  const { user } = useAuth();

  const isCandidate = user?.role?.toString().toLowerCase() === "candidate";

  // Scroll to section when hash changes
  useEffect(() => {
    const hash = window.location.hash.substring(1); // remove '#'
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        // Wait for layout to settle, then scroll
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, []);

  return (
    <ErrorBoundary>
      <HeroSection />

      {isCandidate && <RecommendedJobs />}

      <TopCompanies />
      <FeaturedJobs />
    </ErrorBoundary>
  );
}
