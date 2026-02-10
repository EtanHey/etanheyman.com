import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold text-[#f0ebe0] mt-8 mb-4 tracking-tight">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold text-[#f0ebe0] mt-8 mb-3 tracking-tight border-b border-[#e5950026] pb-2">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold text-[#e8e2d6] mt-6 mb-2">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold text-[#e8e2d6] mt-4 mb-2">{children}</h4>
    ),
    p: ({ children }) => (
      <p className="text-[#c0b8a8] leading-relaxed mb-4">{children}</p>
    ),
    a: ({ href, children }) => {
      const isExternal = href?.startsWith('http');
      if (isExternal) {
        return <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#2dd4a8] hover:underline">{children}</a>;
      }
      return <Link href={href || '#'} className="text-[#2dd4a8] hover:underline">{children}</Link>;
    },
    ul: ({ children }) => (
      <ul className="list-disc list-inside text-[#c0b8a8] mb-4 space-y-1 ml-2">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside text-[#c0b8a8] mb-4 space-y-1 ml-2">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="text-[#c0b8a8] leading-relaxed">{children}</li>
    ),
    code: ({ children, className }) => {
      // Inline code (no className = not a code block)
      if (!className) {
        return <code className="bg-[#1a1816] text-[#e59500] px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>;
      }
      // Code blocks are handled by rehype-pretty-code
      return <code className={className}>{children}</code>;
    },
    pre: ({ children }) => (
      <pre className="bg-[#0d0d0d] border border-[#e5950026] rounded-lg p-4 mb-4 overflow-x-auto text-sm font-mono">{children}</pre>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#e59500] pl-4 my-4 text-[#908575] italic">{children}</blockquote>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm text-[#c0b8a8] border-collapse">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="border-b border-[#e5950033]">{children}</thead>
    ),
    th: ({ children }) => (
      <th className="text-left py-2 px-3 text-[#e59500] font-semibold text-xs uppercase tracking-wider">{children}</th>
    ),
    td: ({ children }) => (
      <td className="py-2 px-3 border-b border-[#ffffff0a]">{children}</td>
    ),
    hr: () => (
      <hr className="border-[#e5950026] my-8" />
    ),
    strong: ({ children }) => (
      <strong className="text-[#f0ebe0] font-semibold">{children}</strong>
    ),
    ...components,
  };
}
