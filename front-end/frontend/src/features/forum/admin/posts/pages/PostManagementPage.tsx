/**
 * PostManagementPage
 * FOR-06 to FOR-09: Admin page for managing forum posts
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PostList } from "../components/PostList";
import { PostCreateForm } from "../components/PostCreateForm";
import { Button } from "@/components/ui/button";
import { BiPlus } from "react-icons/bi";

export function PostManagementPage() {
  const { t } = useTranslation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {t("forum.posts.title") || "Post Management"}
          </h1>
          <p className="text-slate-600 mt-2">
            {t("forum.posts.description") ||
              "Create, edit, and publish articles. Manage post status and organize content by categories."}
          </p>
        </div>

        {/* Create Button */}
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
        >
          <BiPlus className="w-5 h-5" />
          {t("forum.posts.actions.createNew") || "Create New Post"}
        </Button>
      </div>

      {/* Post List */}
      <PostList />

      {/* Create Modal */}
      <PostCreateForm
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
