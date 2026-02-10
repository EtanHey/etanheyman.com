import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import { notFound } from 'next/navigation';
import { useMDXComponents } from '@/mdx-components';
import MermaidDiagram from '../../components/MermaidDiagram';
import CopyButton from '../../components/CopyButton';

const CONTENT_DIR = join(process.cwd(), 'content', 'golems');

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
  const filePath = join(CONTENT_DIR, ...slug) + '.md';
  if (!existsSync(filePath)) notFound();

  const raw = readFileSync(filePath, 'utf-8');
  const { content } = matter(raw);

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
    <div className="max-w-3xl mx-auto px-6 py-12">
      <article>
        <MDXRemote
          source={content}
          components={components}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                [rehypePrettyCode, {
                  theme: 'github-dark-dimmed',
                  keepBackground: false,
                }],
              ],
            },
          }}
        />
      </article>
    </div>
  );
}
