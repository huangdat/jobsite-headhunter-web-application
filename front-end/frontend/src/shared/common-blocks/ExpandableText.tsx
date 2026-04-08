import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/shared/ui-primitives/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { useJobsTranslation } from "@/shared/hooks";

interface ExpandableTextProps {
  content: string;
  maxLines?: 2 | 3 | 4 | 5;
  className?: string;
}

const lineClampClasses: Record<number, string> = {
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
  5: "line-clamp-5",
};

export function ExpandableText({
  content,
  maxLines = 2,
  className = "",
}: ExpandableTextProps) {
  const { t } = useJobsTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!content) return null;

  const lines = content.split("\n");
  const shouldTruncate = lines.length > maxLines;

  return (
    <div>
      <div
        className={`whitespace-pre-line text-slate-600 dark:text-slate-300 transition-all ${
          isExpanded ? "" : lineClampClasses[maxLines] || "line-clamp-2"
        } ${className}`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSanitize]}
        >
          {content}
        </ReactMarkdown>
      </div>
      {shouldTruncate && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-2 text-brand-primary hover:text-brand-primary hover:bg-brand-primary/10 dark:hover:bg-brand-primary/10 font-semibold flex items-center gap-1 px-0"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <ChevronUp size={16} />
              {t("detail.viewLess")}
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              {t("detail.viewMore")}
            </>
          )}
        </Button>
      )}
    </div>
  );
}
