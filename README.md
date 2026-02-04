# Etan Heyman Portfolio

A modern, performant portfolio website built with Next.js 15, TypeScript, and Supabase.

![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/EtanHey/etanheyman.com?utm_source=oss&utm_medium=github&utm_campaign=EtanHey%2Fetanheyman.com&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15.3.0 (App Router) |
| **Language** | TypeScript 5.x (strict mode) |
| **Styling** | Tailwind CSS v4 |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | NextAuth.js (GitHub OAuth) |
| **UI Components** | Radix UI + shadcn/ui |
| **Forms** | react-hook-form + Zod validation |
| **File Uploads** | Uploadthing |
| **Email** | Resend |
| **Icons** | lucide-react |
| **Deployment** | Vercel |

### Key Dependencies
```json
{
  "@radix-ui/*": "Latest",
  "@shadcn/ui": "Latest",
  "@supabase/supabase-js": "Latest",
  "@supabase/ssr": "Latest",
  "react-hook-form": "Latest",
  "zod": "Latest",
  "lucide-react": "Latest",
  "next-auth": "Latest",
  "uploadthing": "Latest",
  "resend": "Latest"
}
```

---

## Project Structure

```
app/
├── (routes)/              # Main routes
│   ├── about/            # About page
│   ├── contact/          # Contact form
│   └── projects/         # Project showcase
├── api/                  # API routes & webhooks
├── components/
│   ├── ui/              # UI components (Button, Card, etc)
│   ├── tech-icons/      # Technology badges
│   ├── navigation/      # Header/footer components
│   └── forms/           # Form components
├── layout.tsx           # Root layout with nav/footer
└── lib/
    ├── supabase/       # Client & server Supabase instances
    ├── auth/           # NextAuth configuration
    └── utils.ts        # Helper functions

types/
├── database.types.ts    # Auto-generated from Supabase
└── index.ts            # Type definitions

supabase/
├── migrations/         # SQL migration files
└── functions/          # Postgres functions
```

---

## Content Structure

### Pages

**`app/(routes)/about`** - Personal bio and skills showcase
**`app/(routes)/projects`** - Dynamic project portfolio from Supabase
**`app/(routes)/contact`** - Contact form with spam protection

### Database Schema

#### `projects` Table
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT NOT NULL,
  logo_path TEXT NOT NULL,
  logo_url TEXT,
  preview_image TEXT,
  technologies technology[] DEFAULT '{}',  -- ENUM array
  git_url TEXT NOT NULL,
  live_url TEXT,
  framework TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `project_journey_steps` Table
```sql
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

#### `technology` ENUM
Includes: AWS, Axios, Docker, FastAPI, HuggingFace, Next.js, NextJS, Python, PyTorch, React, YOLOv8, and more.

---

## Local Development Setup

### Prerequisites
- Node.js 18+ (or Bun)
- Git
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/EtanHey/etanheyman.com.git
   cd etanheyman.com
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or with bun
   bun install
   ```

3. **Set up environment variables**
   Create `.env.local`:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://mkijzwkuubtfjqcemorx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=<generate-with: openssl rand -base64 32>
   GITHUB_CLIENT_ID=<your-github-oauth-id>
   GITHUB_CLIENT_SECRET=<your-github-oauth-secret>
   ALLOWED_EMAILS=<comma-separated-emails>

   # Services
   UPLOADTHING_TOKEN=<your-uploadthing-token>
   RESEND_API_KEY=<your-resend-api-key>
   ```

4. **Generate database types**
   ```bash
   npx supabase gen types typescript --project-id mkijzwkuubtfjqcemorx > types/database.types.ts
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

### Development Commands

```bash
npm run dev         # Start dev server on :3000
npm run build       # Build for production
npm run start       # Run production build
npm run lint        # Check code quality
npm run type-check  # TypeScript validation
```

---

## Database Migrations

### Creating a Migration

1. **Create migration file** in `supabase/migrations/`:
   ```bash
   # Format: YYYYMMDD_descriptive_name.sql
   touch supabase/migrations/20250202_add_featured_column.sql
   ```

2. **Write migration SQL**
   ```sql
   -- supabase/migrations/20250202_add_featured_column.sql
   ALTER TABLE projects ADD COLUMN featured BOOLEAN DEFAULT false;
   ```

3. **Apply locally and verify** before committing

4. **Commit migration file**
   ```bash
   git add supabase/migrations/
   git commit -m "chore: add featured column to projects"
   ```

### Important Rules
- ✅ Always create migration files before changes
- ✅ Use descriptive snake_case names
- ✅ Version control all migrations
- ✅ Never use raw SQL scripts in production
- ❌ Never modify database directly without migrations

---

## Authentication (NextAuth + GitHub OAuth)

### Setup Steps

1. **Create GitHub OAuth App**
   - Go to GitHub Settings → Developer settings → OAuth Apps
   - Create new OAuth App
   - Set Authorization callback URL to: `http://localhost:3000/api/auth/callback/github`

2. **Add credentials to `.env.local`**
   ```env
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   ```

3. **Configure allowed emails**
   ```env
   ALLOWED_EMAILS=your-email@example.com,other@example.com
   ```

### Usage in Components

```typescript
// Client component
'use client';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return <button onClick={() => signOut()}>Sign Out</button>;
  }

  return <button onClick={() => signIn('github')}>Sign In</button>;
}
```

---

## Design System

### Typography

**Font Stack:**
- Headers: Nutmeg (custom font)
- Body: Roboto (system font)

**Responsive Sizes:**
| Level | Desktop | Mobile |
|-------|---------|--------|
| H1 | 64px | 34px |
| H2 | 48px | 26px |
| H3 | 40px | 22px |
| H4 | 32px | 20px |
| H5 | 24px | 16px |
| H6 | 20px | 15px |
| Body | 18px | 14px |

### Color Palette

```css
/* Tailwind CSS Classes */
bg-background   /* #00003F - Main bg */
bg-primary      /* #0F82EB - Primary blue */
bg-blue-700     /* #0053A4 - Dark blue (icons) */
bg-blue-50      /* #E7F5FE - Lightest blue */
bg-white        /* #FFFFFF - White */
bg-red          /* #E70E0E - Red/errors */
```

### Responsive Patterns

```typescript
<h1 className="text-[34px] md:text-[64px] font-bold font-[Nutmeg]">
<p className="text-sm md:text-lg leading-relaxed">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

### Design References
- [Mobile Design](https://www.figma.com/design/diT3h36O3UG2x9KwbSuPR3/Etan-Heyman-Portfolio?node-id=1-3)
- [Desktop Design](https://www.figma.com/design/diT3h36O3UG2x9KwbSuPR3/Etan-Heyman-Portfolio?node-id=1-7)
- [Style Guide](https://www.figma.com/design/diT3h36O3UG2x9KwbSuPR3/Etan-Heyman-Portfolio?node-id=1-2)

---

## Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub** (automatic deployment)
   ```bash
   git push origin main
   ```

2. **Vercel auto-deploys on push**
   - Main branch → Production
   - Other branches → Preview deployments

3. **Environment variables**
   Set on Vercel dashboard (Project Settings → Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXTAUTH_URL` (set to production domain)
   - `NEXTAUTH_SECRET`
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `ALLOWED_EMAILS`
   - `UPLOADTHING_TOKEN`
   - `RESEND_API_KEY`

### Production Checklist

- [ ] All env variables set on Vercel
- [ ] GitHub OAuth callback URL updated for production domain
- [ ] NextAuth secret is strong and unique
- [ ] Supabase policies are configured for production
- [ ] Email service (Resend) is properly configured
- [ ] File uploads (Uploadthing) are configured
- [ ] Backups configured in Supabase
- [ ] Monitoring/error tracking set up (optional: Sentry, LogRocket)

---

## Code Patterns

### Server Components (Default)

```typescript
// app/page.tsx
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
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase.from('projects').select('*');
      setData(data);
    };
    fetchProjects();
  }, []);

  return <div>{/* render */}</div>;
}
```

### API Routes

```typescript
// app/api/projects/route.ts
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('projects').select('*');

    if (error) throw error;
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### Form Handling

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  message: z.string().min(10),
});

export default function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    // Handle submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* form fields */}
    </form>
  );
}
```

---

## Important Notes

- **Navigation**: Header and footer are in root layout—don't modify them directly
- **Background**: Handled by layout component
- **Testing**: Always test on both mobile (375px) and desktop (1440px+)
- **Icons**: Use `lucide-react` only—don't create custom SVGs unless absolutely necessary
- **Database Types**: Auto-generated from Supabase—never manually edit `database.types.ts`
- **RTL**: Hebrew/Arabic UI needs explicit RTL checks (flex order reversal, text alignment)

---

## Contributing

This is a personal portfolio, but contributions for improvements are welcome. Please ensure:
- Code passes TypeScript strict mode
- All tests pass (`npm run lint`)
- Components follow existing patterns
- Database changes include migrations

---

## License

Personal project. See LICENSE file for details.

---

## Support

For questions about the portfolio, visit the [GitHub repository](https://github.com/EtanHey/etanheyman.com) or check the [design files](https://www.figma.com/design/diT3h36O3UG2x9KwbSuPR3/Etan-Heyman-Portfolio).
