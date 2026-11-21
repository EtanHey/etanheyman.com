import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import TableOfContents from '../../components/TableOfContents';
import ArchitectureDiagram from '../../components/ArchitectureDiagram';
import Breadcrumbs from '../../components/Breadcrumbs';
import { getDocsNav, flattenNav } from '../../lib/docs-nav';
import { golemsMdxComponents } from '../../lib/golems-mdx';

const CONTENT_DIR = join(process.cwd(), 'content', 'golems');

function isArchivedSlug(slug: string[]): boolean {
  return slug.includes('_archived');
}

// Skip static generation — MDX content may contain chars that break prerendering
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  if (isArchivedSlug(slug)) return { title: 'Not Found' };
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
  if (isArchivedSlug(slug)) notFound();
  const slugStr = slug.join('/');
  const filePath = join(CONTENT_DIR, ...slug) + '.md';
  if (!existsSync(filePath)) notFound();

  const raw = readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const pageTitle = data.title || content.match(/^#\s+(.+)/m)?.[1] || slug[slug.length - 1];
  const headingTitle = content.match(/^#\s+(.+)/m)?.[1] || pageTitle;
  const description = typeof data.description === 'string' ? data.description : null;
  const badges = [
    typeof data.type === 'string' ? data.type : null,
    data.retired ? 'retired' : null,
    typeof data.status === 'string' ? data.status : null,
  ].filter((badge): badge is string => Boolean(badge));

  // Strip the first H1: the page renders its own visible title above the content.
  const strippedContent = content.replace(/^#\s+.+\n?/m, '');

  // Prev/next navigation from auto-generated nav (matches sidebar order)
  const docOrder = flattenNav(getDocsNav());
  const currentIndex = docOrder.findIndex((d) => d.slug === slugStr);
  const prevDoc = currentIndex > 0 ? docOrder[currentIndex - 1] : null;
  const nextDoc = currentIndex >= 0 && currentIndex < docOrder.length - 1 ? docOrder[currentIndex + 1] : null;

  return (
    <div className="mx-auto flex max-w-6xl gap-12 px-4 pt-8 pb-16 md:px-8 md:pt-12">
      <article data-golems-doc className="min-w-0 max-w-[72ch] flex-1">
        <header className="mb-10 border-b border-g-ink pb-6">
          <Breadcrumbs title={pageTitle} />
          <h1 className="font-g-display text-[2.2rem] leading-[1.08] text-g-ink md:text-[2.9rem]">{headingTitle}</h1>
          {description && (
            <p className="mt-3 text-[1.1rem] leading-relaxed text-g-ash">{description}</p>
          )}
          {badges.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Page status">
              {badges.map((badge) => (
                <li
                  key={badge}
                  className="rounded-sm border border-g-edge px-2 py-0.5 font-g-mono text-[0.78rem] text-g-ash"
                >
                  {badge}
                </li>
              ))}
            </ul>
          )}
        </header>
        {slugStr === 'architecture' && <ArchitectureDiagram />}
        <div className="[&>h2:first-child]:mt-0 [&>h2:first-child]:border-t-0 [&>h2:first-child]:pt-0">
        <MDXRemote
          source={strippedContent}
          components={golemsMdxComponents}
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
        </div>

        {(prevDoc || nextDoc) && (
          <nav aria-label="Previous and next page" className="mt-16 grid gap-3 border-t border-g-rule pt-6 sm:grid-cols-2">
            {prevDoc ? (
              <Link
                href={`/golems/docs/${prevDoc.slug}`}
                className="g-press group flex flex-col gap-1 rounded-lg border border-g-rule px-4 py-3 hover:border-g-ink"
              >
                <span className="text-sm text-g-ash">Previous</span>
                <span className="font-g-display text-[1.15rem] text-g-ink">{prevDoc.title}</span>
              </Link>
            ) : <div className="hidden sm:block" />}
            {nextDoc ? (
              <Link
                href={`/golems/docs/${nextDoc.slug}`}
                className="g-press group flex flex-col gap-1 rounded-lg border border-g-rule px-4 py-3 text-right hover:border-g-ink"
              >
                <span className="text-sm text-g-ash">Next</span>
                <span className="font-g-display text-[1.15rem] text-g-ink">{nextDoc.title}</span>
              </Link>
            ) : <div />}
          </nav>
        )}
      </article>

      {/* Table of Contents — discovers headings from DOM, hides itself if too few */}
      <TableOfContents />
    </div>
  );
}
