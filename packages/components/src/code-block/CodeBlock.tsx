'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

export interface CodeBlockProps {
  children: React.ReactNode;
  language?: string;
  showCopy?: boolean;
  showHeader?: boolean;
  className?: string;
  variant?: 'default' | 'glass';
}

// Dedent helper - removes common leading indentation
function dedentCode(code: string): string {
  const normalized = code.replace(/\t/g, '  ').replace(/[ \t]+$/gm, '');
  const lines = normalized.split('\n');
  if (lines.length <= 1) return normalized.trim();

  let start = 0;
  while (start < lines.length && lines[start].trim() === '') start++;
  let end = lines.length - 1;
  while (end >= 0 && lines[end].trim() === '') end--;

  if (start > end) return '';
  const relevantLines = lines.slice(start, end + 1);

  const nonEmpty = relevantLines.filter((l) => l.trim() !== '');
  const minIndent = nonEmpty.reduce((min, line) => {
    const m = line.match(/^\s*/)?.[0].length ?? 0;
    return Math.min(min, m);
  }, Infinity);

  return minIndent === Infinity || minIndent === 0
    ? relevantLines.join('\n')
    : relevantLines
        .map((l) =>
          l.startsWith(' '.repeat(minIndent)) ? l.slice(minIndent) : l
        )
        .join('\n');
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:bg-slate-700/50 hover:text-cyan-400 transition-all"
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span
            key="copied"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-cyan-400"
          >
            Copied!
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            Copy
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export function CodeBlock({
  children,
  language = 'typescript',
  showCopy = true,
  showHeader = true,
  className = '',
  variant = 'glass',
}: CodeBlockProps) {
  const codeString = useMemo(() => {
    if (typeof children === 'string') return dedentCode(children);
    try {
      const raw = React.Children.toArray(children)
        .map((c) =>
          typeof c === 'string' ? c : typeof c === 'number' ? String(c) : ''
        )
        .join('');
      return dedentCode(raw);
    } catch {
      return '';
    }
  }, [children]);

  return (
    <div
      className={cn(
        'group relative my-6 overflow-hidden rounded-2xl border transition-all',
        variant === 'glass'
          ? 'border-indigo-500/20 bg-slate-950/40 backdrop-blur-md shadow-2xl'
          : 'border-slate-700 bg-slate-900 shadow-lg',
        className
      )}
    >
      {showHeader && (
        <div
          className={cn(
            'flex items-center justify-between px-4 py-2 border-b',
            variant === 'glass'
              ? 'border-indigo-500/10 bg-slate-900/20'
              : 'border-slate-800 bg-slate-800/50'
          )}
        >
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
            </div>
            <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">
              {language}
            </span>
          </div>
          {showCopy && <CopyButton code={codeString} />}
        </div>
      )}

      <pre className="overflow-x-auto p-4 text-sm leading-relaxed scrollbar-thin scrollbar-thumb-slate-700">
        <code className="font-mono block whitespace-pre text-slate-300">
          {codeString}
        </code>
      </pre>
    </div>
  );
}

export function InlineCode({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <code
      className={cn(
        'rounded-md bg-slate-800/50 border border-slate-700/50 px-1.5 py-0.5 text-xs font-mono text-cyan-400',
        className
      )}
    >
      {children}
    </code>
  );
}
