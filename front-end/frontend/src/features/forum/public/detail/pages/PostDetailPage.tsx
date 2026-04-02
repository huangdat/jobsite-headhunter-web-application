/**
 * PostDetailPage
 * FOR-11 + FOR-12: Public page displaying single post with reactions
 */

import { PostContent } from "../components/PostContent";
import { PostMetadata } from "../components/PostMetadata";
import { ReactionsBar } from "../components/ReactionsBar";
import { RelatedPosts } from "../components/RelatedPosts";

export function PostDetailPage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <PostMetadata />

      <PostContent />

      <ReactionsBar />

      <RelatedPosts />
    </div>
  );
}
