'use client';

import ReactMarkdown from 'react-markdown';

/** react-markdown must run on the client to avoid Turbopack/RSC `require is not defined` errors. */
export function MarkdownBody({ children, className = '' }: { children: string; className?: string }) {
  if (!children) return null;
  return (
    <div className={className}>
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
