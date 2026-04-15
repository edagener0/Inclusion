import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children, ...rest }) {
          const match = /language-(\w+)/.exec(className || '');

          return match ? (
            <div className="my-3 overflow-hidden rounded-md text-[13px] shadow-sm">
              <SyntaxHighlighter
                PreTag="div"
                language={match[1]}
                style={vscDarkPlus}
                customStyle={{ margin: 0, padding: '1rem', background: '#09090b' }}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code
              className="rounded-md bg-zinc-200/50 px-1.5 py-0.5 font-mono text-[13px] dark:bg-zinc-800/50"
              {...rest}
            >
              {children}
            </code>
          );
        },
        p({ children }) {
          return <p className="mb-2 last:mb-0">{children}</p>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
