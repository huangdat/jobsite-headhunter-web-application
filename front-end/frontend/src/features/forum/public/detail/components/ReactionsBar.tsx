/**
 * ReactionsBar Component
 * FOR-12 AC1-AC5: Emoji reactions with auth check and debounce
 * AC1: Check authentication before allowing reaction
 * AC2: First reaction adds emoji icon + count 0→1
 * AC3: Change reaction decreases old count, increases new count
 * AC4: Second click on same emoji removes it
 * AC5: Debounce prevents race conditions
 */

import { useReactions } from "../hooks/useReactions";
import { type ReactionType } from "../services/reactionsApi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const REACTIONS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: "LIKE", emoji: "👍", label: "Like" },
  { type: "LOVE", emoji: "❤️", label: "Love" },
  { type: "ANGRY", emoji: "😠", label: "Angry" },
  { type: "SAD", emoji: "😢", label: "Sad" },
  { type: "WOW", emoji: "😮", label: "Wow" },
  { type: "LAUGH", emoji: "😂", label: "Laugh" },
];

interface ReactionsBarProps {
  postId: number;
}

export function ReactionsBar({ postId }: ReactionsBarProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { reactionCounts, userCurrentReaction, handleReaction, isLoading } =
    useReactions(postId);

  const [, setShowPicker] = useState(false);

  const handleReactionClick = (type: ReactionType) => {
    const result = handleReaction(type);

    // AC1: Check authentication
    if (result.requiresLogin) {
      toast.info(t("forum.reactions.loginRequired") || "Yêu cầu đăng nhập", {
        action: {
          label: t("forum.actions.login") || "Đăng nhập",
          onClick: () => navigate("/login"),
        },
      });
      return;
    }

    // Provide feedback
    if (result.action === "set") {
      toast.success(
        t("forum.reactions.reactionAdded", {
          label: REACTIONS.find((r) => r.type === type)?.label,
        }) || `Bạn đã ấn ${REACTIONS.find((r) => r.type === type)?.label}`
      );
    } else if (result.action === "removed") {
      toast.success(t("forum.reactions.reactionRemoved") || "Đã xóa biểu cảm");
    }

    setShowPicker(false);
  };

  if (isLoading) return null;

  return (
    <div className="py-6 border-t border-b border-slate-200">
      <div className="flex items-center gap-4">
        {/* AC2/AC3/AC4: Reaction buttons */}
        {REACTIONS.map(({ type, emoji, label }) => {
          const count = reactionCounts[type] || 0;
          const isSelected = userCurrentReaction === type;

          return (
            <button
              key={type}
              onClick={() => handleReactionClick(type)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full transition
                ${
                  isSelected
                    ? "bg-brand-primary/20 text-brand-primary ring-2 ring-brand-primary font-bold"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }
              `}
              title={isSelected ? `${label} (Bấm lại để xóa)` : label}
            >
              <span className="text-xl">{emoji}</span>
              {count > 0 && (
                <span className="text-sm font-medium">{count}</span>
              )}
            </button>
          );
        })}

        {/* Share button */}
        <button
          className="ml-auto px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
          title={t("forum.actions.share") || "Chia sẻ"}
        >
          🔗 {t("forum.actions.share") || "Chia sẻ"}
        </button>

        {/* Bookmark button */}
        <button
          className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
          title={t("forum.actions.bookmark") || "Lưu"}
        >
          🔖 {t("forum.actions.bookmark") || "Lưu"}
        </button>
      </div>

      {/* Liked by info */}
      {reactionCounts.LIKE > 0 && (
        <div className="mt-4 text-sm text-slate-600">
          👍{" "}
          {t("forum.reactions.likedBy", { count: reactionCounts.LIKE }) ||
            `Được ${reactionCounts.LIKE} người yêu thích`}
        </div>
      )}
    </div>
  );
}
