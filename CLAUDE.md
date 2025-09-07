# CLAUDE.md

Quick reference guide for Claude Code when working with the etanheyman.com portfolio website.

## Scratchpad Usage
- File: `claude.scratchpad.md` (git-ignored)
- Use for: bulk operations, complex tasks, planning, temporary notes
- Always check existence before writing (use Read first)
- Clear after task completion

## Project Overview
Professional portfolio website showcasing Etan Heyman's work with Next.js 15.

### Technical Stack
```yaml
framework: Next.js 15.3.0-canary.40
language: TypeScript 5.x (strict mode)
styling: Tailwind CSS v4
database: MongoDB Atlas (Prisma 6.x)
auth: NextAuth (GitHub OAuth)
deployment: Vercel
```

### Key Dependencies
- UI: @radix-ui/*, shadcn/ui
- Forms: react-hook-form, zod
- Files: uploadthing
- Email: resend
- Icons: lucide-react

### Directory Structure
```
app/
├── (routes)/         # Pages: about/, contact/, projects/
├── api/              # API routes
├── components/       # ui/, tech-icons/, navigation/, etc.
└── lib/              # db.ts, utils.ts, types.ts
prisma/               # Database schema
```

## Database Schema
```prisma
model Project {
  id               String   @id @default(auto()) @map("_id") @db.ObjectId
  title            String
  description      String
  shortDescription String
  logoPath         String
  logoUrl          String?
  previewImage     String?
  technologies     String[]
  projectJourney   ProjectJourney[]
  gitUrl           String
  liveUrl          String?
  framework        String?
}
```

## Core Patterns

### Server Components (Default)
```typescript
export default async function Page() {
  const data = await db.model.findMany();
  return <div>{/* render */}</div>;
}
```

### Client Components
```typescript
'use client';
// Only when interactivity needed
```

### API Routes
```typescript
export async function GET() {
  try {
    const data = await db.model.findMany();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
```

### Server Actions
```typescript
'use server';
export async function action(formData: FormData) {
  // Validate with zod, perform action
}
```

## Common Commands
```bash
npm run dev          # Development
npm run build        # Production build
npm run lint         # Linting
npm run type-check   # Type checking

# Prisma
npx prisma generate  # Generate client
npx prisma db push   # Push schema
npx prisma studio    # Visual editor
```

## Environment Variables
```env
DATABASE_URL="mongodb+srv://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
ALLOWED_EMAILS="email1@example.com,email2@example.com"
UPLOADTHING_TOKEN="..."
RESEND_API_KEY="..."
```

## NextAuth Setup
1. Create GitHub OAuth App
2. Set callback URL: `{url}/api/auth/callback/github`
3. Add env variables
4. Wrap app in SessionProvider

### Usage
```typescript
// Client
import { useSession, signIn, signOut } from 'next-auth/react';

// Check auth
const { data: session } = useSession();

// Sign in
await signIn('github', { callbackUrl: '/' });
```

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
bg-blue-50       (#E7F5FE) - Lightest blue
bg-blue-100      (#B8E2FB) - Light blue
bg-blue-200      (#88CFF8) - Medium light
bg-blue-300      (#59BCF5) - Medium blue
bg-blue-400      (#2AA9F2) - Medium strong
bg-blue-500      (#0F82EB) - Primary
bg-blue-600      (#0085D7) - Strong blue
bg-blue-700      (#0053A4) - Dark blue
bg-blue-800      (#002072) - Very dark
bg-blue-900      (#00003F) - Deepest/background
bg-white         (#FFFFFF) - White
bg-black         (#000000) - Black
bg-red           (#E70E0E) - Red/errors
```

### Responsive Typography Examples
```typescript
// Desktop header
<h1 className="text-[64px] font-bold font-[Nutmeg]">

// Mobile header
<h1 className="text-[34px] md:text-[64px] font-bold font-[Nutmeg]">

// Paragraph
<p className="text-sm md:text-lg">
```

## Design References
- Mobile: https://www.figma.com/design/diT3h36O3UG2x9KwbSuPR3/Etan-Heyman-Portfolio?node-id=1-3
- Desktop: https://www.figma.com/design/diT3h36O3UG2x9KwbSuPR3/Etan-Heyman-Portfolio?node-id=1-7
- Style Guide: https://www.figma.com/design/diT3h36O3UG2x9KwbSuPR3/Etan-Heyman-Portfolio?node-id=1-2

## Key Principles
1. Server components by default
2. Mobile-first responsive design
3. Proper error handling
4. TypeScript strict mode
5. Follow existing patterns

## Quick Database Queries
```typescript
// Get all projects
db.project.findMany()

// Get by ID
db.project.findUnique({ where: { id } })

// Update
db.project.update({ where: { id }, data: { ... } })
```

## Important Notes
- Navigation header/footer are in layout (don't modify)
- Background handled by layout
- Always test on mobile and desktop
- Use existing components when possible