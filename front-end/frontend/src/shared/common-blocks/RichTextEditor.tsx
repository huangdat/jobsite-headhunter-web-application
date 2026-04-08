import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { forwardRef, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui-primitives/button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Undo2,
  Redo2,
} from "lucide-react";
import "./RichTextEditor.css";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const RichTextEditorComponent = forwardRef<HTMLDivElement, RichTextEditorProps>(
  (
    {
      value,
      onChange,
      placeholder = "Enter text...",
      disabled = false,
      className,
    },
    ref
  ) => {
    const contentRef = useRef<string>(value || "");

    const editor = useEditor({
      extensions: [StarterKit],
      content: value || "",
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        contentRef.current = html;
        onChange(html);
      },
      editable: !disabled,
    });

    useEffect(() => {
      if (!editor || value === undefined) return;

      if (value !== contentRef.current) {
        editor.commands.setContent(value, false);

        contentRef.current = editor.getHTML();
      }
    }, [value, editor]);

    if (!editor) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "border border-input rounded-lg overflow-hidden bg-white dark:bg-slate-900",
          className
        )}
      >
        {/* Toolbar */}
        <div className="bg-slate-50 dark:bg-slate-800 border-b border-input p-2 flex gap-1 flex-wrap">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={
              disabled || !editor.can().chain().focus().toggleBold().run()
            }
            className={cn(
              "p-2 h-8 w-8",
              editor.isActive("bold") &&
                "bg-slate-200 dark:bg-slate-600 text-brand-primary"
            )}
            title="Bold (Ctrl+B)"
          >
            <Bold size={16} />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={
              disabled || !editor.can().chain().focus().toggleItalic().run()
            }
            className={cn(
              "p-2 h-8 w-8",
              editor.isActive("italic") &&
                "bg-slate-200 dark:bg-slate-600 text-brand-primary"
            )}
            title="Italic (Ctrl+I)"
          >
            <Italic size={16} />
          </Button>

          <div className="w-px bg-slate-300 dark:bg-slate-600 mx-1" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            disabled={disabled}
            className={cn(
              "p-2 h-8 w-8",
              editor.isActive("bulletList") &&
                "bg-slate-200 dark:bg-slate-600 text-brand-primary"
            )}
            title="Bullet List"
          >
            <List size={16} />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            disabled={disabled}
            className={cn(
              "p-2 h-8 w-8",
              editor.isActive("orderedList") &&
                "bg-slate-200 dark:bg-slate-600 text-brand-primary"
            )}
            title="Ordered List"
          >
            <ListOrdered size={16} />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            disabled={disabled}
            className={cn(
              "p-2 h-8 w-8",
              editor.isActive("heading", { level: 2 }) &&
                "bg-slate-200 dark:bg-slate-600 text-brand-primary"
            )}
            title="Heading 2"
          >
            <Heading2 size={16} />
          </Button>

          <div className="w-px bg-slate-300 dark:bg-slate-600 mx-1" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={disabled || !editor.can().undo()}
            className="p-2 h-8 w-8"
            title="Undo"
          >
            <Undo2 size={16} />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={disabled || !editor.can().redo()}
            className="p-2 h-8 w-8"
            title="Redo"
          >
            <Redo2 size={16} />
          </Button>
        </div>

        {/* Editor */}
        <div
          className={cn(
            "p-3 min-h-[200px] flex flex-col",
            disabled && "opacity-50 pointer-events-none"
          )}
        >
          <EditorContent
            editor={editor}
            className="prose dark:prose-invert max-w-none focus:outline-none flex-1"
          />
        </div>
      </div>
    );
  }
);

RichTextEditorComponent.displayName = "RichTextEditor";

export { RichTextEditorComponent as RichTextEditor };
