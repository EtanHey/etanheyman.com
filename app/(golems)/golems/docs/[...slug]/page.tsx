import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useMDXComponents } from '@/mdx-components';
import MermaidDiagram from '../../components/MermaidDiagram';
import CopyButton from '../../components/CopyButton';
import TableOfContents from '../../components/TableOfContents';

const CONTENT_DIR = join(process.cwd(), 'content', 'golems');

// Flat ordered list of all docs for prev/next navigation (matches sidebar order)
const DOC_ORDER = [
  'getting-started',
  'architecture',
  'golems/email',
  'golems/recruiter',
  'golems/claude',
  'golems/teller',
  'golems/job-golem',
  'cloud-worker',
  'mcp-tools',
  'llm',
  'per-repo-sessions',
  'configuration/env-vars',
  'configuration/secrets',
  'deployment/railway',
  'journey',
];

function getDocTitle(slug: string): string {
  const filePath = join(CONTENT_DIR, slug) + '.md';
  if (!existsSync(filePath)) return slug;
  const raw = readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return data.title || content.match(/^#\s+(.+)/m)?.[1] || slug.split('/').pop() || slug;
}

function getAllDocPaths(dir: string, prefix = ''): string[] {
  const paths: string[] = [];
  if (!existsSync(dir)) return paths;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = prefix ? `${prefix}/${entry}` : entry;
    if (statSync(full).isDirectory()) {
      paths.push(...getAllDocPaths(full, rel));
    } else if (entry.endsWith('.md')) {
      paths.push(rel.replace(/\.md$/, ''));
    }
  }
  return paths;
}

function extractHeadings(content: string): { id: string; text: string; level: number }[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const headings: { id: string; text: string; level: number }[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/\*\*/g, '').replace(/`/g, '').trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    headings.push({ id, text, level });
  }
  return headings;
}

export async function generateStaticParams() {
  const paths = getAllDocPaths(CONTENT_DIR);
  return paths.map((p) => ({ slug: p.split('/') }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const filePath = join(CONTENT_DIR, ...slug) + '.md';
  if (!existsSync(filePath)) return { title: 'Not Found' };
  const raw = readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const title = data.title || content.match(/^#\s+(.+)/m)?.[1] || slug[slug.length - 1];
  return {
    title,
    description: data.description || `Golems documentation — ${title}`,
  };
}

function extractTextContent(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (!node) return '';
  if (Array.isArray(node)) return node.map(extractTextContent).join('');
  if (typeof node === 'object' && 'props' in node) {
    const el = node as React.ReactElement<{ children?: React.ReactNode }>;
    return extractTextContent(el.props.children);
  }
  return '';
}

export default async function DocsPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const slugStr = slug.join('/');
  const filePath = join(CONTENT_DIR, ...slug) + '.md';
  if (!existsSync(filePath)) notFound();

  const raw = readFileSync(filePath, 'utf-8');
  const { content } = matter(raw);

  // Extract headings for TOC
  const headings = extractHeadings(content);

  // Prev/next navigation
  const currentIndex = DOC_ORDER.indexOf(slugStr);
  const prevDoc = currentIndex > 0 ? DOC_ORDER[currentIndex - 1] : null;
  const nextDoc = currentIndex >= 0 && currentIndex < DOC_ORDER.length - 1 ? DOC_ORDER[currentIndex + 1] : null;

  const baseComponents = useMDXComponents({});
  const components = {
    ...baseComponents,
    pre: ({ children, ...props }: React.ComponentPropsWithoutRef<'pre'> & { children?: React.ReactNode; 'data-language'?: string }) => {
      const child = children as React.ReactElement<{ className?: string; children?: React.ReactNode }> | undefined;
      const lang = props['data-language'] || child?.props?.className?.replace('language-', '');
      // Mermaid blocks → render as diagram
      if (lang === 'mermaid') {
        const chart = extractTextContent(children);
        return <MermaidDiagram chart={chart} />;
      }
      // Regular code blocks → styled with copy button
      const codeText = extractTextContent(children);
      return (
        <div className="relative group mb-4">
          <pre
            className="bg-[#0d0d0d] border border-[#e5950026] rounded-lg p-4 overflow-x-auto text-sm scrollbar-none [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[inherit]"
            style={{ fontFamily: "var(--font-golems-mono), 'JetBrains Mono', 'Fira Code', monospace" }}
            {...props}
          >
            {children}
          </pre>
          {codeText.trim() && <CopyButton text={codeText} />}
        </div>
      );
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-0">
      {/* Doc header with logo — visible on all pages */}
      <div className="flex items-center gap-3 mb-8 pl-0 md:hidden">
        <Image
          src="/images/golems-logo.svg"
          alt="Golems logo"
          width={32}
          height={32}
          className="shrink-0 drop-shadow-[0_0_12px_rgba(229,149,0,0.3)]"
        />
        <Link
          href="/golems"
          className="text-lg font-bold bg-gradient-to-br from-[#f0ebe0] to-[#e59500] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
        >
          Golems
        </Link>
      </div>
      <div className="flex gap-8">
      <article className="flex-1 min-w-0 max-w-3xl">
        <MDXRemote
          source={content}
          components={components}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                rehypeSlug,
                [rehypePrettyCode, {
                  theme: 'github-dark-dimmed',
                  keepBackground: false,
                }],
              ],
            },
          }}
        />

        {/* Prev/Next Navigation */}
        {(prevDoc || nextDoc) && (
          <nav className="flex justify-between items-center mt-12 pt-6 border-t border-[#e5950026]">
            {prevDoc ? (
              <Link
                href={`/golems/docs/${prevDoc}`}
                className="flex flex-col gap-1 text-left group"
              >
                <span className="text-xs text-[#8b7355]">Previous</span>
                <span className="text-[#c0b8a8] group-hover:text-[#e59500] transition-colors">
                  &larr; {getDocTitle(prevDoc)}
                </span>
              </Link>
            ) : <div />}
            {nextDoc ? (
              <Link
                href={`/golems/docs/${nextDoc}`}
                className="flex flex-col gap-1 text-right group"
              >
                <span className="text-xs text-[#8b7355]">Next</span>
                <span className="text-[#c0b8a8] group-hover:text-[#e59500] transition-colors">
                  {getDocTitle(nextDoc)} &rarr;
                </span>
              </Link>
            ) : <div />}
          </nav>
        )}
      </article>

      {/* Table of Contents — only shows on xl screens for pages with 3+ headings */}
      {headings.length >= 3 && <TableOfContents headings={headings} />}
      </div>
    </div>
  );
}
