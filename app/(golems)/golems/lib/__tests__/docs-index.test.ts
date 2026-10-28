import { describe, expect, it, vi } from 'vitest';
import { flattenNav, getDocsNav } from '../docs-nav';

const permanentRedirect = vi.fn();
vi.mock('next/navigation', () => ({ permanentRedirect }));

describe('docs index', () => {
  it('permanently redirects to the first sidebar page', async () => {
    const { default: DocsIndex } = await import('../../docs/page');
    DocsIndex();
    expect(flattenNav(getDocsNav())[0].slug).toBe('getting-started');
    expect(permanentRedirect).toHaveBeenCalledWith('/golems/docs/getting-started');
  });
});
