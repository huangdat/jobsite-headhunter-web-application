import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import './RichTextEditor.css';

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
      placeholder: _placeholder = 'Enter text...',
      disabled = false,
      className,
    },
    ref
  ) => {
    const editor = useEditor({
      extensions: [StarterKit],
      content: value || '',
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
      editable: !disabled,
    });

    // Update editor content when the value prop changes from outside
    useEffect(() => {
      if (editor && value && editor.getHTML() !== value) {
        editor.commands.setContent(value);
      }
    }, [value, editor]);

    if (!editor) {
      return <div className="p-4 text-center text-slate-400">Loading editor...</div>;
    }

    return (
      <div ref={ref} className={cn('border border-input rounded-lg overflow-hidden', className)}>
        <div className="bg-slate-50 dark:bg-slate-800 border-b border-input p-2 flex gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={disabled}
            className={cn(
              'px-3 py-1 text-sm font-medium rounded hover:bg-slate-200 dark:hover:bg-slate-700',
              editor.isActive('bold') && 'bg-slate-200 dark:bg-slate-700'
            )}
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={disabled}
            className={cn(
              'px-3 py-1 text-sm font-medium rounded hover:bg-slate-200 dark:hover:bg-slate-700',
              editor.isActive('italic') && 'bg-slate-200 dark:bg-slate-700'
            )}
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            disabled={disabled}
            className={cn(
              'px-3 py-1 text-sm font-medium rounded hover:bg-slate-200 dark:hover:bg-slate-700',
              editor.isActive('bulletList') && 'bg-slate-200 dark:bg-slate-700'
            )}
          >
            •
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            disabled={disabled}
            className={cn(
              'px-3 py-1 text-sm font-medium rounded hover:bg-slate-200 dark:hover:bg-slate-700',
              editor.isActive('orderedList') && 'bg-slate-200 dark:bg-slate-700'
            )}
          >
            1.
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            disabled={disabled}
            className={cn(
              'px-3 py-1 text-sm font-medium rounded hover:bg-slate-200 dark:hover:bg-slate-700',
              editor.isActive('heading') && 'bg-slate-200 dark:bg-slate-700'
            )}
          >
            H
          </button>
        </div>
        <EditorContent
          editor={editor}
          className={cn(
            'prose dark:prose-invert max-w-none p-3 min-h-[200px] focus:outline-none',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
      </div>
    );
  }
);

RichTextEditorComponent.displayName = 'RichTextEditor';

export { RichTextEditorComponent as RichTextEditor };
