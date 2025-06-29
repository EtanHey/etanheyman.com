# CLAUDE.md

This file provides comprehensive guidance to Claude Code (claude.ai/code) when working with the etanheyman.com portfolio website.

# SCRATCHPAD FOR COMPLEX TASKS:

- A file called `claude.scratchpad.md` exists at the repository root for tracking complex operations
- This file is git-ignored and should be used for:
  - Tracking multiple related changes (like bulk replacements)
  - Creating audit trails for complex operations
  - Storing temporary notes that need to persist across messages
  - Planning multi-step operations before execution
- The scratchpad should be cleared after each task is complete
- Always check if the scratchpad exists before writing to it (use Read first)
- If the scratchpad file does not exist, you may create it
- This is particularly useful for tasks like:
  - Bulk find/replace operations
  - Multi-file refactoring
  - Tracking test cases or validation steps
  - Storing intermediate results during debugging

# TERMINAL COMMANDS:

When outputting long terminal commands that might wrap across lines:

- Write the command to the scratchpad file for easy copying
- Explicitly mention that the command is in the scratchpad
- This prevents issues with line wrapping and copy/paste errors

## Project Overview

### What This Is
A professional portfolio website showcasing Etan Heyman's work, built with cutting-edge Next.js 15 features for optimal performance and user experience.

### Core Purpose
- Showcase professional projects and technical skills
- Provide contact mechanism for potential clients/employers
- Demonstrate modern web development capabilities
- Serve as a living example of code quality and best practices

### Key User Journeys
1. **Visitor Flow**: Landing → Browse Projects → View Project Details → Contact
2. **Admin Flow**: GitHub OAuth Login → Create/Edit Projects → Upload Assets → Publish
3. **Contact Flow**: Navigate to Contact → Fill Form → Server-side Validation → Email Sent

## Technical Stack

### Core Technologies
```yaml
framework: Next.js 15.3.0-canary.40
runtime: Node.js 20+
package_manager: npm
language: TypeScript 5.x (strict mode)
styling: Tailwind CSS v4
database: MongoDB Atlas
orm: Prisma 6.x
deployment: Vercel
```

### Key Dependencies
- **UI Components**: @radix-ui/* (primitives), shadcn/ui (component library)
- **Form Handling**: react-hook-form, zod (validation)
- **File Uploads**: uploadthing
- **Email**: resend
- **Icons**: lucide-react
- **Animations**: framer-motion (if needed)
- **Date Handling**: date-fns
- **Authentication**: next-auth (GitHub OAuth)

### Experimental Features Enabled
- Partial Prerendering (PPR)
- Dynamic IO
- Turbopack for development

## Project Architecture

### Directory Structure
```
etanheyman.com/
├── app/                          # Next.js App Router
│   ├── (routes)/                # Route groups
│   │   ├── about/              # About page
│   │   ├── contact/            # Contact with server actions
│   │   └── projects/           # Projects CRUD
│   ├── api/                    # API routes
│   │   ├── projects/           # RESTful project endpoints
│   │   └── uploadthing/        # File upload handler
│   ├── components/             # Shared components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── tech-icons/        # Technology SVG icons
│   │   ├── navigation/        # Nav components
│   │   ├── contact/           # Contact form components
│   │   └── projects/          # Project-specific components
│   └── lib/                   # Utilities
│       ├── db.ts             # Database singleton
│       ├── utils.ts          # Helper functions
│       └── types.ts          # Shared TypeScript types
├── prisma/                     # Database schema
├── public/                     # Static assets
└── styles/                     # Global styles
```

### File Naming Conventions
- **Components**: PascalCase (e.g., `ProjectCard.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **API Routes**: kebab-case folders (e.g., `api/upload-thing/`)
- **Pages**: kebab-case folders with `page.tsx`
- **Server Actions**: `actions.ts` in route folder
- **Types**: `types.ts` or inline in component files

## Database Schema & Patterns

### Prisma Schema
```prisma
model Project {
  id                String          @id @default(auto()) @map("_id") @db.ObjectId
  name              String
  slug              String          @unique
  description       String
  longDescription   String?
  technologies      String[]
  logoUrl           String?
  projectUrl        String?
  githubUrl         String?
  featured          Boolean         @default(false)
  orderIndex        Int             @default(0)
  journey           ProjectJourney?
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt
}

type ProjectJourney {
  milestones      Milestone[]
}

type Milestone {
  title           String
  description     String
  date            DateTime
}
```

### Database Operations Pattern
```typescript
// Always use the singleton connection
import { db } from '@/lib/db';

// Prefer server components for data fetching
async function getProjects() {
  return await db.project.findMany({
    orderBy: [
      { featured: 'desc' },
      { orderIndex: 'asc' },
      { createdAt: 'desc' }
    ]
  });
}

// Use try-catch with proper error handling
try {
  const result = await db.project.create({ data });
} catch (error) {
  console.error('Database operation failed:', error);
  throw new Error('Failed to create project');
}
```

## Code Patterns & Conventions

### Component Patterns

#### Server Components (Default)
```typescript
// app/projects/page.tsx
export default async function ProjectsPage() {
  const projects = await db.project.findMany();
  
  return (
    <div className="container mx-auto px-4">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

#### Client Components
```typescript
// Mark as client component only when needed
'use client';

import { useState } from 'react';

export function InteractiveComponent() {
  const [state, setState] = useState(false);
  // Component with client-side interactivity
}
```

### API Route Patterns
```typescript
// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const projects = await db.project.findMany();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validate with zod
    const validated = projectSchema.parse(body);
    const project = await db.project.create({ data: validated });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
```

### Server Actions Pattern
```typescript
// app/contact/actions.ts
'use server';

import { z } from 'zod';
import { resend } from '@/lib/resend';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10)
});

export async function sendContactEmail(formData: FormData) {
  const data = Object.fromEntries(formData);
  
  try {
    const validated = contactSchema.parse(data);
    
    await resend.emails.send({
      from: 'portfolio@etanheyman.com',
      to: 'contact@etanheyman.com',
      subject: `Contact from ${validated.name}`,
      text: validated.message,
      reply_to: validated.email
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to send message' };
  }
}
```

### Error Handling Patterns
```typescript
// Use Error Boundaries for client components
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <button onClick={reset} className="mt-4 btn-primary">
          Try again
        </button>
      </div>
    </div>
  );
}
```

### TypeScript Patterns
```typescript
// Define types close to usage
interface ProjectCardProps {
  project: Project;
  variant?: 'default' | 'featured';
}

// Use type inference where possible
const technologies = ['Next.js', 'TypeScript'] as const;
type Technology = typeof technologies[number];

// Prefer interfaces for object shapes
interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}
```

## Styling Guidelines

### Tailwind CSS v4 Patterns
```css
/* Use CSS variables for theming */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
  }
  
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
  }
}

/* Component classes */
@layer components {
  .btn-primary {
    @apply inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90;
  }
}
```

### Responsive Design Pattern
```tsx
// Mobile-first approach
<div className="px-4 md:px-6 lg:px-8">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
    {/* Content */}
  </div>
</div>
```

## Common Development Commands

```bash
# Install dependencies
npm install

# Development with Turbopack
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Build for production
npm run build

# Start production server
npm start

# Database commands
npx prisma generate    # Generate Prisma client
npx prisma db push     # Push schema to database
npx prisma studio      # Open Prisma Studio
```

## Common Workflows

### Setting Up GitHub Authentication
1. Create a GitHub OAuth App at https://github.com/settings/developers
2. Set Homepage URL to your app URL (e.g., http://localhost:3000)
3. Set Authorization callback URL to `{your-url}/api/auth/callback/github`
4. Copy Client ID and Client Secret to your .env.local
5. Generate a NEXTAUTH_SECRET using `openssl rand -base64 32`
6. Configure allowed users via ALLOWED_EMAILS or ALLOWED_GITHUB_USERNAMES
7. Test login at /admin

### Adding a New Project
1. Create project data structure
2. Upload logo via UploadThing
3. Add to database via API or Prisma Studio
4. Verify on projects page
5. Test responsive layout

### Updating Project Information
1. Navigate to project edit page (if implemented)
2. Update fields
3. Handle file uploads for new assets
4. Validate all URLs work
5. Check slug doesn't conflict

### Adding New Technologies/Icons
1. Add SVG icon to `components/tech-icons/`
2. Export from `components/tech-icons/index.ts`
3. Update type definitions if needed
4. Use in project technology arrays

### Implementing New Features
1. Plan component structure
2. Create server component by default
3. Add client interactivity only if needed
4. Implement proper error handling
5. Add loading states
6. Test on mobile and desktop
7. Verify dark mode support

## Performance Considerations

### Next.js 15 Optimizations
- **Partial Prerendering**: Static shells with dynamic content
- **Dynamic IO**: Streaming responses for better UX
- **Server Components**: Reduce client bundle size
- **Image Optimization**: Use next/image with proper sizes

### Best Practices
```typescript
// Lazy load heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'));

// Optimize images
<Image
  src={project.logoUrl}
  alt={project.name}
  width={400}
  height={300}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={index < 3} // Priority for above-fold images
/>

// Use Suspense for async components
<Suspense fallback={<ProjectCardSkeleton />}>
  <ProjectList />
</Suspense>
```

## Testing Patterns

### Component Testing
```typescript
// __tests__/components/ProjectCard.test.tsx
import { render, screen } from '@testing-library/react';
import { ProjectCard } from '@/components/projects/ProjectCard';

describe('ProjectCard', () => {
  it('renders project information', () => {
    const project = {
      name: 'Test Project',
      description: 'Test description',
      technologies: ['Next.js', 'TypeScript']
    };
    
    render(<ProjectCard project={project} />);
    
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });
});
```

### API Testing
```typescript
// __tests__/api/projects.test.ts
import { GET } from '@/app/api/projects/route';

describe('/api/projects', () => {
  it('returns projects list', async () => {
    const response = await GET();
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });
});
```

## Deployment Checklist

### Pre-deployment
- [ ] Run `npm run build` locally
- [ ] Fix any build errors
- [ ] Test production build with `npm start`
- [ ] Verify environment variables are set
- [ ] Check database connection string
- [ ] Ensure UploadThing keys are configured

### Environment Variables
```env
# .env.local
DATABASE_URL="mongodb+srv://..."

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000" # or your production URL
NEXTAUTH_SECRET="your-nextauth-secret"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Access Control (optional)
ALLOWED_EMAILS="email1@example.com,email2@example.com"
ALLOWED_GITHUB_USERNAMES="username1,username2"

# File Uploads
UPLOADTHING_TOKEN="..."
UPLOADTHING_SECRET="..."

# Email
RESEND_API_KEY="..."
```

### Post-deployment
- [ ] Verify all pages load correctly
- [ ] Test contact form submission
- [ ] Check image uploads work
- [ ] Monitor error logs
- [ ] Test on multiple devices

## Troubleshooting

### Common Issues

**Database Connection Errors**
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Ensure Prisma client is generated

**Build Failures**
- Clear `.next` directory
- Delete `node_modules` and reinstall
- Check for TypeScript errors
- Verify all imports are correct

**UploadThing Issues**
- Verify API keys are set
- Check file size limits
- Ensure CORS is configured

**Styling Issues**
- Clear browser cache
- Check Tailwind configuration
- Verify CSS variable definitions
- Test in different browsers

**Authentication Issues**
- Verify GitHub OAuth App settings match your URLs
- Check NEXTAUTH_SECRET is set in production
- Ensure callback URL is exactly: `{your-url}/api/auth/callback/github`
- Verify allowed users are configured correctly
- Clear cookies if experiencing redirect loops

## NextAuth.js Integration

### Important NextAuth.js Configuration Notes

#### Setup Requirements
1. **Environment Variables**:
   ```env
   NEXTAUTH_SECRET=your-secret-key  # Required in production
   NEXTAUTH_URL=http://localhost:3000  # Your app URL
   GITHUB_CLIENT_ID=your-github-client-id  # GitHub OAuth App ID
   GITHUB_CLIENT_SECRET=your-github-client-secret  # GitHub OAuth Secret
   ALLOWED_EMAILS=email1@example.com,email2@example.com  # Optional: Restrict access
   ALLOWED_GITHUB_USERNAMES=username1,username2  # Optional: Restrict by username
   ```

2. **API Route**: NextAuth requires `/app/api/auth/[...nextauth]/route.ts`

3. **Session Provider**: Wrap app in `SessionProvider` from `next-auth/react`

#### Key Concepts
- **Providers**: We use GitHubProvider for OAuth authentication
- **JWT Strategy**: Using JWT for stateless sessions
- **Callbacks**: 
  - `signIn()`: Controls who can authenticate (checks allowed emails/usernames)
  - `jwt()`: Adds GitHub username to token
  - `session()`: Includes GitHub username in session
- **Custom Sign-in Page**: Set to `/admin` in our configuration

#### Usage Patterns
```typescript
// Check authentication in Client Components
import { useSession } from 'next-auth/react';

function Component() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Not authenticated</p>;
  
  return <p>Welcome {session.user?.name}</p>;
}

// Sign in/out
import { signIn, signOut } from 'next-auth/react';

// GitHub OAuth sign in
await signIn('github', { callbackUrl: '/' });

// Sign out
await signOut();
```

#### GitHub OAuth Setup
1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - Application name: Your app name
   - Homepage URL: http://localhost:3000 (or production URL)
   - Authorization callback URL: http://localhost:3000/api/auth/callback/github
4. Save Client ID and Client Secret to .env.local

#### Security Considerations
- Always set `NEXTAUTH_SECRET` in production
- Use environment variables for all secrets
- Restrict access using ALLOWED_EMAILS or ALLOWED_GITHUB_USERNAMES
- Consider implementing audit logs for admin actions

#### Common Issues
- Missing `NEXTAUTH_SECRET` causes session errors
- Incorrect `NEXTAUTH_URL` breaks redirects
- Session not persisting: Check cookie settings
- TypeScript errors: Extend next-auth types if needed
- GitHub auth fails: Verify callback URL matches exactly
- Access denied: Check ALLOWED_EMAILS or ALLOWED_GITHUB_USERNAMES

## Design References

- **Mobile Design**: https://www.figma.com/design/diT3h36O3UG2x9KwbSuPR3/Etan-Heyman-Portfolio?node-id=1-3
- **Desktop Design**: https://www.figma.com/design/diT3h36O3UG2x9KwbSuPR3/Etan-Heyman-Portfolio?node-id=1-7

## Important Notes

1. **Always prefer server components** unless client interactivity is needed
2. **Handle errors gracefully** with proper user feedback
3. **Optimize for Core Web Vitals** - LCP, FID, CLS
4. **Follow accessibility guidelines** - ARIA labels, semantic HTML
5. **Test on real devices** not just browser DevTools
6. **Keep bundle size minimal** by lazy loading when appropriate
7. **Use TypeScript strictly** for better code quality
8. **Document complex logic** with clear comments

## Quick Reference

### Project Structure Commands
```bash
# Find all client components
grep -r "use client" app/

# List all API routes
find app/api -name "route.ts"

# Check bundle size
npm run analyze
```

### Database Queries
```typescript
// Get featured projects
db.project.findMany({ where: { featured: true } })

// Get project by slug
db.project.findUnique({ where: { slug } })

// Update project order
db.project.update({ 
  where: { id }, 
  data: { orderIndex: newIndex } 
})
```

This guide should be your primary reference when working with the etanheyman.com codebase. When in doubt, follow the existing patterns in the codebase.