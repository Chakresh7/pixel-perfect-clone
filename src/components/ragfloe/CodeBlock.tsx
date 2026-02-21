import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}

const highlightLine = (line: string): React.ReactNode => {
  // Comments
  if (line.trimStart().startsWith('#') || line.trimStart().startsWith('//')) {
    return <span className="text-[#475569]">{line}</span>;
  }

  // Simple syntax highlighting
  const parts: React.ReactNode[] = [];
  let remaining = line;
  let key = 0;

  // Strings
  const stringRegex = /(["'`])(?:(?!\1).)*\1/g;
  let match: RegExpExecArray | null;
  let lastIndex = 0;

  while ((match = stringRegex.exec(remaining)) !== null) {
    if (match.index > lastIndex) {
      const before = remaining.slice(lastIndex, match.index);
      parts.push(<span key={key++}>{highlightKeywords(before)}</span>);
    }
    parts.push(<span key={key++} className="text-[#86EFAC]">{match[0]}</span>);
    lastIndex = match.index + match[0].length;
  }

  if (parts.length === 0) return highlightKeywords(line);

  if (lastIndex < remaining.length) {
    parts.push(<span key={key++}>{highlightKeywords(remaining.slice(lastIndex))}</span>);
  }

  return <>{parts}</>;
};

const highlightKeywords = (text: string): React.ReactNode => {
  const keywords = /\b(GET|POST|PUT|DELETE|PATCH|const|let|var|function|return|import|export|from|async|await)\b/g;
  const numRegex = /\b(\d+\.?\d*)\b/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Keywords
  const combined = new RegExp(`(${keywords.source})|(${numRegex.source})`, 'g');
  while ((match = combined.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      parts.push(<span key={match.index} className="text-[#60A5FA]">{match[0]}</span>);
    } else {
      parts.push(<span key={match.index} className="text-[#FCA5A5]">{match[0]}</span>);
    }
    lastIndex = match.index + match[0].length;
  }

  if (parts.length === 0) return text;
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return <>{parts}</>;
};

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, title, className }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const lines = code.split('\n');

  return (
    <div className={cn('bg-black border border-dark-border rounded-md border-l-2 border-l-brand-blue overflow-hidden', className)}>
      {title && (
        <div className="flex items-center justify-between bg-[#0D0D14] border-b border-dark-border px-4 py-2">
          <span className="font-mono text-[11px] text-gray-500">{title}</span>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-[11px] font-mono text-gray-500 hover:text-gray-300 transition-colors"
          >
            {copied ? (
              <><Check className="w-3 h-3 text-green-500" /> <span className="text-green-500">Copied!</span></>
            ) : (
              <><Copy className="w-3 h-3" /> Copy</>
            )}
          </button>
        </div>
      )}
      <pre className="p-4 overflow-x-auto">
        <code className="font-mono text-xs leading-[1.7] text-[#94A3B8]">
          {lines.map((line, i) => (
            <div key={i}>{highlightLine(line)}</div>
          ))}
        </code>
      </pre>
    </div>
  );
};

export { CodeBlock };
