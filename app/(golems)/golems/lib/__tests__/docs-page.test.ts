import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

vi.mock('next-mdx-remote/rsc', () => ({ MDXRemote: () => null }));
vi.mock('../../components/Breadcrumbs', () => ({ default: () => null }));
vi.mock('../../components/ArchitectureDiagram', () => ({ default: () => null }));
vi.mock('../../components/TableOfContents', () => ({ default: () => null }));

import DocsPage from '../../docs/[...slug]/page';

describe('docs page title', () => {
  it.each([
    ['architecture', 'Architecture'],
    ['getting-started', 'Getting Started'],
  ])('renders one heading for %s', async (slug, title) => {
    const page = await DocsPage({ params: Promise.resolve({ slug: [slug] }) });
    const html = renderToStaticMarkup(page);
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain(`<h1 class="sr-only">${title}</h1>`);
  });
});
