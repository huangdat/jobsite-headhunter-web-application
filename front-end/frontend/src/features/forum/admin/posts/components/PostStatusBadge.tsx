/**
 * PostStatusBadge Component
 * Display post status with appropriate styling
 */

import type { PostStatus } from "../types";
import { POST_STATUS_COLORS } from "../types";

interface PostStatusBadgeProps {
  status: PostStatus;
  showIcon?: boolean;
  size?: "sm" | "md";
}

export function PostStatusBadge({
  status,
  showIcon = true,
  size = "md",
}: PostStatusBadgeProps) {
  const colors = POST_STATUS_COLORS[status];
  const sizeClass = size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm";

  const statusLabel: Record<PostStatus, string> = {
    DRAFT: "Draft",
    PUBLISHED: "Published",
    ARCHIVED: "Archived",
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full ${colors.bg} ${colors.text} font-medium ${sizeClass}`}
    >
      {showIcon && <span className="text-base">{colors.icon}</span>}
      <span>{statusLabel[status]}</span>
    </div>
  );
}

export default PostStatusBadge;
