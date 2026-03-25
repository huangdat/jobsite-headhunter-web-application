import { useEffect, forwardRef, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
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
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
      if (textareaRef.current && textareaRef.current.value !== (value || '')) {
        textareaRef.current.value = value || '';
      }
    }, [value]);

    const insertAroundSelection = (before: string, after = before) => {
      const ta = textareaRef.current;
      if (!ta || disabled) return;
      const start = ta.selectionStart ?? 0;
      const end = ta.selectionEnd ?? 0;
      const selected = ta.value.substring(start, end) || '';
      const newVal = ta.value.substring(0, start) + before + selected + after + ta.value.substring(end);
      onChange(newVal);
      // setTimeout to ensure DOM updates and then set selection
      setTimeout(() => {
        const pos = start + before.length + selected.length + after.length;
        ta.focus();
        ta.selectionStart = ta.selectionEnd = pos;
      }, 0);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      // Ctrl/Cmd+B -> bold, Ctrl/Cmd+I -> italic
      const isMod = e.ctrlKey || e.metaKey;
      if (!isMod) return;
      const key = (e.key || '').toLowerCase();
      if (key === 'b') {
        e.preventDefault();
        insertAroundSelection('**', '**');
      } else if (key === 'i') {
        e.preventDefault();
        insertAroundSelection('*', '*');
      }
    };

    return (
      <div ref={ref} className={cn('border border-input rounded-lg overflow-hidden', className)}>
        <div className="bg-slate-50 dark:bg-slate-800 border-b border-input p-2 flex gap-1">
          <button
            type="button"
            onClick={() => insertAroundSelection('**', '**')}
            disabled={disabled}
            className="px-3 py-1 text-sm font-medium rounded hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => insertAroundSelection('*', '*')}
            disabled={disabled}
            className="px-3 py-1 text-sm font-medium rounded hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => insertAroundSelection('\n- ', '\n')}
            disabled={disabled}
            className="px-3 py-1 text-sm font-medium rounded hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            •
          </button>
          <button
            type="button"
            onClick={() => insertAroundSelection('\n1. ', '\n')}
            disabled={disabled}
            className="px-3 py-1 text-sm font-medium rounded hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            1.
          </button>
          <button
            type="button"
            onClick={() => insertAroundSelection('\n## ', '\n')}
            disabled={disabled}
            className="px-3 py-1 text-sm font-medium rounded hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            H
          </button>
        </div>

        <div className="flex gap-4 p-3">
          <textarea
            ref={textareaRef}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={_placeholder}
            disabled={disabled}
            className={cn(
              'w-1/2 p-3 min-h-[200px] resize-y rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          />

          <div className="w-1/2 p-3 min-h-[200px] overflow-auto bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 prose dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>{value || ''}</ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }
);

RichTextEditorComponent.displayName = 'RichTextEditor';

export { RichTextEditorComponent as RichTextEditor };
