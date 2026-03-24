import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

interface Props { content: string; }

export const MarkdownViewer: React.FC<Props> = ({ content }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    rehypePlugins={[[rehypeSanitize]]}
    className="prose prose-sm max-w-none dark:prose-invert"
  >
    {content}
  </ReactMarkdown>
);
