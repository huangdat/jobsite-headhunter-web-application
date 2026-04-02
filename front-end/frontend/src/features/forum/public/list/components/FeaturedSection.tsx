/**
 * FeaturedSection Component
 * FOR-10 AC1/AC2: Display featured/highlighted posts
 * AC1: Hero section (main featured 2 cols) + Sidebar (3 cards, 1 col each)
 * AC2: Hide section if no featured posts; show partial if 1-3
 */

import { useNavigate } from "react-router-dom";
import { useFeaturedPosts } from "../hooks/useFeaturedPosts";
import { Loader2 } from "lucide-react";

export function FeaturedSection() {
  const navigate = useNavigate();
  const { mainFeatured, sidebarFeatured, shouldShowFeatured, isLoading } =
    useFeaturedPosts();

  // AC2: Hide if no featured posts
  if (!shouldShowFeatured && !isLoading) return null;

  if (isLoading) {
    return (
      <div className="h-96 rounded-xl bg-slate-100 flex items-center justify-center mb-8">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AC1: Main Featured Post (2 columns, large) */}
        {mainFeatured && (
          <div
            className="lg:col-span-2 cursor-pointer group"
            onClick={() => navigate(`/forum-posts/${mainFeatured.id}`)}
          >
            <div className="relative overflow-hidden rounded-xl h-96">
              <img
                src={mainFeatured.featuredImage || "/placeholder.jpg"}
                alt={mainFeatured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="inline-block bg-emerald-600 px-3 py-1 rounded-full text-sm font-medium mb-3">
                  {mainFeatured.categoryName}
                </span>
                <h2 className="text-2xl font-bold mb-2 line-clamp-2">
                  {mainFeatured.title}
                </h2>
                <p className="text-gray-200 text-sm line-clamp-2">
                  {mainFeatured.description ||
                    mainFeatured.content?.substring(0, 100)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AC1: Sidebar Featured Posts (3 cards, 1 column each) */}
        <div className="flex flex-col gap-6">
          {sidebarFeatured.map((post) => (
            <div
              key={post.id}
              className="cursor-pointer group rounded-lg overflow-hidden hover:shadow-lg transition"
              onClick={() => navigate(`/forum-posts/${post.id}`)}
            >
              <div className="relative overflow-hidden h-32">
                <img
                  src={post.featuredImage || "/placeholder.jpg"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4 bg-white border border-slate-200">
                <span className="text-xs font-medium text-emerald-600 uppercase">
                  {post.categoryName}
                </span>
                <h3 className="font-semibold text-sm mt-1 line-clamp-2 group-hover:text-emerald-600">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
