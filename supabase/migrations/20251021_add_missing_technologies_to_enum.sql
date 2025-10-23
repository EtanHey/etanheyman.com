-- Migration: Add missing technologies to the technology ENUM
-- Created: 2025-10-21
-- Description: Adds 60+ technologies discovered during project research

-- Core Frameworks & Tools
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Express';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Express.js';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Create React App';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Vite';

-- Databases & ORMs
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Prisma';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'PostgreSQL';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Postgres';

-- Authentication & Security
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'NextAuth';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'bcrypt';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'JWT';

-- State Management & Forms
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Redux Toolkit';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'React Hook Form';

-- UI Libraries
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Radix UI';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'shadcn/ui';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Material-UI';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'MUI';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Headless UI';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Framer Motion';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Lucide';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Lucide React';

-- Email Services
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Nodemailer';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Mailgun';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Resend';

-- File Storage & Processing
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'UploadThing';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'next-cloudinary';

-- Maps & Location
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Google Maps';
ALTER TYPE technology ADD VALUE IF NOT EXISTS '@react-google-maps/api';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Leaflet';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'React-Leaflet';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Proj4';

-- APIs & Integrations
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Vapi';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Retell';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Nylas';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Twilio';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'PostHog';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Calendly';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Crisp SDK';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Merge API';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Unified API';

-- Internationalization
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'i18n';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'next-intl';
ALTER TYPE technology ADD VALUE IF NOT EXISTS '@formatjs/intl-localematcher';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'negotiator';

-- Utilities & Validation
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'class-variance-authority';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'react-scroll';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'react-idle-timer';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'react-dropzone';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'react-syntax-highlighter';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'react-hot-toast';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'react-tooltip';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'date-fns';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Dayjs';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Canvas Confetti';

-- Email & PDFs
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'React Email';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'React PDF';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'PDF Lib';

-- Charts & Visualization
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Recharts';

-- CMS
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Wisp CMS';

-- Deployment & Analytics
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Vercel Speed Insights';

-- Other
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'embla-carousel';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'next-themes';
