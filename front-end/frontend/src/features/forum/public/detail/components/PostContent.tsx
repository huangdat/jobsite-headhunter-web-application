/**
 * PostContent Component
 * FOR-11 AC1: Display main post content (title, body, images)
 * AC1: XSS protection with DOMPurify
 */

import DOMPurify from "dompurify";
import type { ForumPost } from "@/features/forum/admin/posts/types";

interface PostContentProps {
  post: ForumPost;
}

export function PostContent({ post }: PostContentProps) {
  // AC1: Sanitize HTML content to prevent XSS
  const sanitizedContent = DOMPurify.sanitize(post.content || "");

  return (
    <div className="mb-8">
      {/* Featured Image */}
      {post.featuredImage && (
        <figure className="mb-8">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full rounded-lg object-cover max-h-96"
          />
        </figure>
      )}

      {/* Post Content - XSS Protected */}
      <article
        className="prose prose-lg max-w-none
          prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-6 prose-h2:mb-4
          prose-p:text-slate-700 prose-p:leading-8 prose-p:mb-4
          prose-a:text-brand-primary prose-a:hover:text-brand-hover
          prose-blockquote:border-l-4 prose-blockquote:border-brand-primary prose-blockquote:pl-4 prose-blockquote:italic
          prose-img:rounded-lg"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </div>
  );
}
