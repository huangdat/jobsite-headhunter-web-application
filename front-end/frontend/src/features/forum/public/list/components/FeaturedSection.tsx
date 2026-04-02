/**
 * FeaturedSection Component
 * FOR-10: Display featured/highlighted posts
 */

import { useEffect, useState } from "react";
import type { ForumPostResp } from "../../../services/forumApi";
import { forumApi } from "../../../services/forumApi";

export function FeaturedSection() {
  const [posts, setPosts] = useState<ForumPostResp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const data = await forumApi.getFeaturedPosts(4);
        setPosts(data);
      } catch (err) {
        setError("Failed to load featured posts");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-500 py-8">{error}</div>;
  if (posts.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">📌 Featured Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="border rounded-lg p-4 hover:shadow-lg transition"
          >
            <h3 className="font-bold text-sm mb-2 truncate">{post.title}</h3>
            <p className="text-xs text-gray-600 line-clamp-2 mb-3">
              {post.content}
            </p>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {post.categoryName || "Uncategorized"}
              </span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
