# CLAUDE.md

Quick reference guide for Claude Code when working with the etanheyman.com portfolio website.

---

## 🧠 THINKING BEFORE DOING (MOST IMPORTANT SECTION)

This section overrides all tendencies toward premature solutions. When presented with any task or question:

### 1. **Understand First, Solve Second**
- What's the actual problem being solved? The stated problem often isn't the real problem
- What's the broader context? How does this fit into the larger system?
- What constraints exist? Technical, business, time, or user constraints all matter
- What has been tried before? Check the codebase for existing patterns and previous attempts
- **It's okay to say**: "Before I suggest a solution, can you help me understand..."

### 2. **Explore the Problem Space**
- Think about multiple approaches before choosing one
- Consider what could go wrong with each approach
- Look for existing patterns in THIS codebase (not just general best practices)
- Ask yourself: Is there a simpler solution I'm missing?
- **Avoid**: Immediately suggesting npm packages or external dependencies without checking what's already in use

### 3. **Practice Intellectual Honesty**
- If something seems off or risky, say so and explore why
- If you're unsure, admit it and investigate rather than guessing
- If the request might have unintended consequences, discuss them
- Share your thought process - the reasoning is often more valuable than the conclusion
- **Remember**: It's better to ask a clarifying question than to build the wrong thing

### 4. **Stay Curious and Iterative**
- Why does this particular solution matter to the user?
- What can you learn about the domain from this problem?
- What edge cases should we consider?
- How might this connect to other parts of the system?
- **It's natural to**: Need multiple rounds of questions to fully understand complex requirements

### Common Anti-Patterns to Avoid:
- ❌ Jumping straight to code without understanding requirements
- ❌ Suggesting the first solution that comes to mind
- ❌ Adding dependencies without checking what's already available
- ❌ Assuming you understand the full context from a brief description
- ❌ Optimizing for brevity over thoroughness in your thinking

---

## Scratchpad Usage

- File: `claude.scratchpad.md` (git-ignored)
- Use for: bulk operations, complex tasks, planning, temporary notes, long terminal commands
- Always check existence before writing (use Read first)
- Clear after task completion
- **Important**: After each session compacting/context reset, check the scratchpad for ongoing work context

### When to Use Scratchpad:
- Tracking multiple related changes (like bulk replacements)
- Creating audit trails for complex operations
- Storing temporary notes that need to persist across messages
- Planning multi-step operations before execution
- **Long terminal commands**: Write to scratchpad to avoid line wrapping issues during copy/paste

---

## Project Overview

Professional portfolio website showcasing Etan Heyman's work with Next.js 15.

### Technical Stack
```yaml
framework: Next.js 15.3.0-canary.40
language: TypeScript 5.x (strict mode)
styling: Tailwind CSS v4
database: Supabase (PostgreSQL)
auth: NextAuth (GitHub OAuth)
deployment: Vercel
```

### Key Dependencies
- UI: @radix-ui/*, shadcn/ui
- Forms: react-hook-form, zod
- Files: uploadthing
- Email: resend
- Icons: lucide-react
- Database: @supabase/supabase-js, @supabase/ssr

### Directory Structure
```
app/
├── (routes)/         # Pages: about/, contact/, projects/
├── api/              # API routes
├── components/       # ui/, tech-icons/, navigation/, etc.
└── lib/              # supabase/, utils.ts, types.ts
types/                # database.types.ts (generated)
```

---

## Database Schema (Supabase/PostgreSQL)

### Technology ENUM
```sql
CREATE TYPE technology AS ENUM (
  'AWS', 'Axios', 'Docker', 'FastAPI', 'HuggingFace',
  'Next.js', 'NextJS', 'Python', 'PyTorch', 'React',
  'YOLOv8', ... -- see full list in migration
);
```

### Tables
```sql
-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT NOT NULL,
  logo_path TEXT NOT NULL,
  logo_url TEXT,
  preview_image TEXT,
  technologies technology[] DEFAULT '{}',  -- Array of ENUM
  git_url TEXT NOT NULL,
  live_url TEXT,
  framework TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Journey Steps
CREATE TABLE project_journey_steps (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  img_url TEXT,
  step_order INTEGER NOT NULL,
  UNIQUE(project_id, step_order)
);
```

---

## Database Migration Guidelines

**Always use proper migration files** - Never modify database directly via tools

### Migration Workflow:
1. **Create migration file** in `/supabase/migrations/` (if using local migrations)
2. **Test the migration** thoroughly before applying
3. **Apply migration** using `mcp__supabase__apply_migration` tool
4. **Commit the migration file** to git for version control

### Important Rules:
- ✅ Always review migration SQL before applying
- ✅ Test migrations on a branch/local first if possible
- ✅ Use descriptive migration names: `create_projects_table`, `add_featured_column`
- ❌ Never use `mcp__supabase__execute_sql` for schema changes (read-only queries only)
- ❌ Never skip migrations or modify database manually

### Adding New Technology:
```sql
-- Migration to add new tech to enum
ALTER TYPE technology ADD VALUE 'NewTech';
```
Then update `TechIconWrapper` with corresponding icon component.

---

## Type Management Guidelines

**Database Types are the Source of Truth**

### Workflow:
1. **Make schema changes** via migration
2. **Generate TypeScript types**:
   ```bash
   npx supabase gen types typescript --project-id mkijzwkuubtfjqcemorx > types/database.types.ts
   ```
3. **Import types** throughout the project:
   ```typescript
   import { Database } from '@/types/database.types';

   type Project = Database['public']['Tables']['projects']['Row'];
   type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
   type ProjectUpdate = Database['public']['Tables']['projects']['Update'];
   ```

### Important Rules:
- ✅ Never create duplicate type definitions - always reference database types
- ✅ All type helpers and constants go in `/types/helpers.ts`
- ✅ Re-generate types after every schema change
- ❌ Never manually edit `database.types.ts` - it's auto-generated

---

## Supabase Client Usage

### Server Components
```typescript
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('featured', true);

  return <div>{/* render */}</div>;
}
```

### Client Components
```typescript
'use client';

import { createClient } from '@/lib/supabase/client';

export default function Component() {
  const supabase = createClient();

  // Use in useEffect or event handlers
  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*');
  };
}
```

### Important Rules:
- ✅ Always use `@/lib/supabase/server` for server components
- ✅ Always use `@/lib/supabase/client` for client components
- ❌ Never recreate Supabase client instances - import from existing files
- ❌ Never use server client in client components or vice versa

---

## Core Patterns

### API Routes
```typescript
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('projects').select('*');

    if (error) throw error;
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

### Server Actions
```typescript
'use server';

import { createClient } from '@/lib/supabase/server';

export async function createProject(formData: FormData) {
  const supabase = await createClient();
  // Validate with zod, perform action
}
```

---

## AIDEV-NOTE Guidelines

Use `AIDEV-NOTE:`, `AIDEV-TODO:`, or `AIDEV-QUESTION:` for AI and developer comments.

### When to Add AIDEV Notes:
- Code that is too complex
- Very important functionality
- Confusing logic
- Potential bugs or edge cases
- Workarounds or temporary solutions

### Best Practices:
- **Before scanning files**: Grep for existing `AIDEV-*` anchors in relevant subdirectories
- **Update relevant anchors** when modifying associated code
- **Never remove** AIDEV-NOTEs without explicit human instruction
- Keep notes concise and specific

Example:
```typescript
// AIDEV-NOTE: Technology enum must match TechIconWrapper icon map exactly
// AIDEV-TODO: Add validation to ensure all enum values have corresponding icons
// AIDEV-QUESTION: Should we auto-generate this from icon components?
```

---

## Documentation Fetching Rules

**Always fetch real documentation - never rely on memory or approximations**

### When to Fetch Docs:
- Before using any function/method you're not 100% certain about
- When implementing features with external dependencies
- When debugging issues that might involve library behavior
- When the user mentions a specific library version
- Before implementing authentication flows or API integrations

### How to Fetch:
1. Use WebSearch to find official docs
2. Use WebFetch on specific pages for details
3. Look for exact function signatures and type definitions
4. Check for version-specific behavior

### Important:
- Always fetch docs for the specific version in package.json
- Never synthesize or guess API signatures
- Check GitHub repo for recent releases if docs seem outdated

---

## Common Commands

```bash
npm run dev          # Development
npm run build        # Production build
npm run lint         # Linting
npm run type-check   # Type checking

# Supabase (if using local dev)
npx supabase gen types typescript --project-id mkijzwkuubtfjqcemorx > types/database.types.ts
```

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://mkijzwkuubtfjqcemorx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
ALLOWED_EMAILS="..."

# Services
UPLOADTHING_TOKEN="..."
RESEND_API_KEY="..."
```

### Important Rules:
- All env variables should exist in `.env.local`
- Never assume a variable exists that is not defined
- Use `NEXT_PUBLIC_` prefix for client-accessible variables

---

## NextAuth Setup

1. Create GitHub OAuth App
2. Set callback URL: `{url}/api/auth/callback/github`
3. Add env variables
4. Wrap app in SessionProvider

### Usage
```typescript
// Client
import { useSession, signIn, signOut } from 'next-auth/react';

const { data: session } = useSession();
await signIn('github', { callbackUrl: '/' });
```

---

## Design System

### Typography
- **Headers**: Nutmeg font (custom font)
- **Body**: Roboto (system font)
- Desktop: H1=64px, H2=48px, H3=40px, H4=32px, H5=24px, H6=20px, P=18px
- Mobile: H1=34px, H2=26px, H3=22px, H4=20px, H5=16px, H6=15px, P=14px

### Colors (Tailwind Classes)
```
bg-background    (#00003F) - Main background
bg-primary       (#0F82EB) - Primary blue
bg-blue-700      (#0053A4) - Dark blue (icons)
bg-blue-50       (#E7F5FE) - Lightest blue
bg-white         (#FFFFFF) - White
bg-red           (#E70E0E) - Red/errors
```

### Responsive Examples
```typescript
<h1 className="text-[34px] md:text-[64px] font-bold font-[Nutmeg]">
<p className="text-sm md:text-lg">
```

---

## Design References

- Mobile: https://www.figma.com/design/diT3h36O3UG2x9KwbSuPR3/Etan-Heyman-Portfolio?node-id=1-3
- Desktop: https://www.figma.com/design/diT3h36O3UG2x9KwbSuPR3/Etan-Heyman-Portfolio?node-id=1-7
- Style Guide: https://www.figma.com/design/diT3h36O3UG2x9KwbSuPR3/Etan-Heyman-Portfolio?node-id=1-2

---

## Key Principles

1. **Think before doing** - Understand the problem first
2. Server components by default
3. Mobile-first responsive design
4. Proper error handling
5. TypeScript strict mode
6. Follow existing patterns
7. Database types as source of truth
8. Never guess - fetch documentation
9. Use AIDEV notes for complex code
10. Test migrations before applying

---

## Important Notes

- Navigation header/footer are in layout (don't modify)
- Background handled by layout
- Always test on mobile and desktop
- Use existing components when possible
- **NEVER use SVGs** - use lucide-react icons UNLESS 100% necessary
- **NEVER format the whole project** unless explicitly asked
- Present migrations in detail before applying
