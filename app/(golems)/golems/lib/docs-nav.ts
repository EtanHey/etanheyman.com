import fs from "fs";
import path from "path";
import matter from "gray-matter";

const DOCS_DIR = path.join(process.cwd(), "content", "golems");

export type DocNavItem = {
  slug: string;
  title: string;
  position?: number;
  children?: DocNavItem[];
};

/**
 * Read _category_.json for a directory if it exists.
 */
function readCategory(dir: string): { label: string; position: number } | null {
  const catFile = path.join(dir, "_category_.json");
  if (!fs.existsSync(catFile)) return null;
  try {
    return JSON.parse(fs.readFileSync(catFile, "utf-8"));
  } catch {
    return null;
  }
}

/**
 * Get all doc slugs by walking the content directory.
 */
function getAllDocSlugs(): string[][] {
  const slugs: string[][] = [];

  function walk(dir: string, prefix: string[]) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), [...prefix, entry.name]);
      } else if (entry.name.endsWith(".md")) {
        const slug = entry.name.replace(/\.md$/, "");
        slugs.push([...prefix, slug]);
      }
    }
  }

  walk(DOCS_DIR, []);
  return slugs;
}

/**
 * Load title and sidebar_position from a doc's frontmatter.
 */
function getDocMeta(parts: string[]): { title: string; sidebarPosition?: number } | null {
  const filePath = path.join(DOCS_DIR, ...parts) + ".md";
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  let title = data.title;
  if (!title) {
    const h1Match = content.match(/^#\s+(.+)/m);
    title = h1Match ? h1Match[1] : parts[parts.length - 1];
  }

  return { title, sidebarPosition: data.sidebar_position };
}

/**
 * Build the docs navigation tree from filesystem + frontmatter.
 * Mirrors packages/dashboard/src/lib/docs/index.ts getDocsNav().
 */
export function getDocsNav(): DocNavItem[] {
  const topLevel: DocNavItem[] = [];
  const categories: Record<string, { label: string; position: number; children: DocNavItem[] }> = {};

  const slugs = getAllDocSlugs();

  for (const parts of slugs) {
    const meta = getDocMeta(parts);
    if (!meta) continue;

    const item: DocNavItem = {
      slug: parts.join("/"),
      title: meta.title,
      position: meta.sidebarPosition,
    };

    if (parts.length === 1) {
      topLevel.push(item);
    } else {
      const cat = parts[0];
      if (!categories[cat]) {
        const catMeta = readCategory(path.join(DOCS_DIR, cat));
        categories[cat] = {
          label: catMeta?.label ?? cat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          position: catMeta?.position ?? 999,
          children: [],
        };
      }
      categories[cat].children.push(item);
    }
  }

  // Sort top-level by position then title
  topLevel.sort((a, b) => (a.position ?? 999) - (b.position ?? 999) || a.title.localeCompare(b.title));

  // Sort category children
  for (const cat of Object.values(categories)) {
    cat.children.sort((a, b) => (a.position ?? 999) - (b.position ?? 999) || a.title.localeCompare(b.title));
  }

  // Build final nav: top-level items first, then categories sorted by position
  const sortedCats = Object.entries(categories).sort(([, a], [, b]) => a.position - b.position);

  const navItems: DocNavItem[] = [...topLevel];
  for (const [cat, { label, children }] of sortedCats) {
    navItems.push({ slug: cat, title: label, children });
  }

  return navItems;
}

/**
 * Flatten nav items into ordered list of leaf pages (for prev/next).
 */
export function flattenNav(items: DocNavItem[]): { slug: string; title: string }[] {
  const result: { slug: string; title: string }[] = [];
  for (const item of items) {
    if (item.children) {
      result.push(...flattenNav(item.children));
    } else {
      result.push({ slug: item.slug, title: item.title });
    }
  }
  return result;
}
