/**
 * NewsListPage
 * FOR-10: Public page displaying list of news/forum posts
 */

import { FeaturedSection } from "../components/FeaturedSection";
import { NewsGrid } from "../components/NewsGrid";
import { NewsFilters } from "../components/NewsFilters";
import { NewsPagination } from "../components/NewsPagination";

export function NewsListPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">News & Updates</h1>

      <FeaturedSection />

      <NewsFilters />

      <NewsGrid />

      <NewsPagination />
    </div>
  );
}
