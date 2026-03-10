-- Fix golems docs_url to point to internal /golems mini-site instead of external GitHub Pages
UPDATE public.projects SET docs_url = '/golems' WHERE slug = 'golems';
