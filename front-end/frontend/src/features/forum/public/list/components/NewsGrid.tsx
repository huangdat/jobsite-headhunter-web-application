/**
 * NewsGrid Component
 * FOR-10: Display news posts in grid layout
 */

import { useEffect, useState } from "react";
import type { ForumPostResp } from "../../../services/forumApi";
import { forumApi } from "../../../services/forumApi";
import { useSearchParams } from "react-router-dom";

export function NewsGrid() {
  const [posts, setPosts] = useState<ForumPostResp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "0");
  const keyword = searchParams.get("keyword") || undefined;
  const category = searchParams.get("category")
    ? parseInt(searchParams.get("category")!)
    : undefined;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await forumApi.searchPosts(page, 6, keyword, category);
        setPosts(data.content || []);
      } catch (err) {
        setError("Failed to load posts");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, keyword, category]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="border rounded-lg p-4 animate-pulse bg-gray-100 h-48"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No posts found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {posts.map((post) => (
        <div
          key={post.id}
          className="border rounded-lg overflow-hidden hover:shadow-lg transition bg-white"
        >
          <div className="p-4">
            <div className="text-xs text-gray-500 mb-2">
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
            <h3 className="font-bold text-lg mb-2 line-clamp-2">
              {post.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
              {post.content}
            </p>

            <div className="flex justify-between items-center">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {post.categoryName || "Uncategorized"}
              </span>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Read More →
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
