/**
 * Lazy-loaded RichTextEditor Wrapper
 * Improves initial page load by code splitting heavy markdown editor
 */

import { lazy, Suspense } from "react";
import { ComponentLoader } from "@/shared/common-blocks/PageLoader";

const RichTextEditorLazy = lazy(() => import("@/shared/common-blocks/RichTextEditor").then(m => ({ default: m.RichTextEditor })));

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function RichTextEditor(props: RichTextEditorProps) {
  return (
    <Suspense fallback={<ComponentLoader />}>
      <RichTextEditorLazy {...props} />
    </Suspense>
  );
}


