import ReactMarkdown from 'react-markdown';

import { Highlight, themes } from 'prism-react-renderer';
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
          const language = match ? match[1] : '';

          return match ? (
            <Highlight
              theme={themes.oneDark}
              code={String(children).replace(/\n$/, '')}
              language={language}
            >
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  className={`my-3 overflow-auto rounded-md p-4 text-[13px] shadow-sm ${className}`}
                  style={style}
                >
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line })}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
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
