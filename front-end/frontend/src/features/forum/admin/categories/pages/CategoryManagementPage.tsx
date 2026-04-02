/**
 * CategoryManagementPage
 * FOR-01 to FOR-05: Admin page for managing forum categories
 */

import { CategoryList } from "../components/CategoryList";

export function CategoryManagementPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Category Management</h1>
      <CategoryList />
    </div>
  );
}
