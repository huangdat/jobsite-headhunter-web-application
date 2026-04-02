/**
 * PostManagementPage
 * FOR-06 to FOR-09: Admin page for managing forum posts
 */

import { PostList } from "../components/PostList";

export function PostManagementPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Post Management</h1>
      <PostList />
    </div>
  );
}
