import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { notFound } from 'next/navigation';
import { useMDXComponents } from '@/mdx-components';
import MermaidDiagram from '../../components/MermaidDiagram';

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

export default async function DocsPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const filePath = join(CONTENT_DIR, ...slug) + '.md';
  if (!existsSync(filePath)) notFound();

  const raw = readFileSync(filePath, 'utf-8');
  const { content } = matter(raw);

  const baseComponents = useMDXComponents({});
  const components = {
    ...baseComponents,
    pre: ({ children, ...props }: React.ComponentPropsWithoutRef<'pre'> & { children?: React.ReactNode }) => {
      // Detect mermaid code blocks: <pre><code className="language-mermaid">...</code></pre>
      const child = children as React.ReactElement<{ className?: string; children?: React.ReactNode }> | undefined;
      if (child?.props?.className === 'language-mermaid') {
        const chart = String(child.props.children || '');
        return <MermaidDiagram chart={chart} />;
      }
      return (
        <pre className="bg-[#0d0d0d] border border-[#e5950026] rounded-lg p-4 mb-4 overflow-x-auto text-sm font-mono" {...props}>
          {children}
        </pre>
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
            },
          }}
        />
      </article>
    </div>
  );
}
