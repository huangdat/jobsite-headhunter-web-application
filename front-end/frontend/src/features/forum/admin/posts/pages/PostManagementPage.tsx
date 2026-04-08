/**
 * PostManagementPage
 * FOR-06 to FOR-09: Admin page for managing forum posts
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PostList } from "../components/PostList";
import { PostCreateForm } from "../components/PostCreateForm";
import { Button } from "@/shared/ui-primitives/button";
import { BiPlus } from "react-icons/bi";
import { PageContainer, PageHeader } from "@/shared/common-blocks/layout";
import { getSemanticClass } from "@/lib/design-tokens";

export function PostManagementPage() {
  const { t } = useTranslation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <PageContainer variant="white">
      <PageHeader
        variant="default"
        title={t("forum.posts.title") || "Post Management"}
        description={
          t("forum.posts.description") ||
          "Create, edit, and publish articles. Manage post status and organize content by categories."
        }
        actions={
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className={`flex items-center gap-2 text-white ${getSemanticClass("success", "bg", true)} hover:opacity-90`}
          >
            <BiPlus className="w-5 h-5" />
            {t("forum.posts.actions.createNew") || "Create New Post"}
          </Button>
        }
      />

      {/* Post List */}
      <PostList />

      {/* Create Modal */}
      <PostCreateForm
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </PageContainer>
  );
}

