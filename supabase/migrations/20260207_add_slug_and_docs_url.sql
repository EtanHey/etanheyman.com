-- Add slug for clean URLs (/projects/golems instead of /projects/uuid)
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Add docs_url for linking to external documentation
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS docs_url TEXT;

-- Set slug for golems project
UPDATE public.projects SET slug = 'golems', docs_url = 'https://etanhey.github.io/golems/' WHERE title = 'Golems';
