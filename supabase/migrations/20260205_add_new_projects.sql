-- Add 4 new projects: Golems, SongScript, Real Estate Platform, Influencer Network
-- Note: Golems and SongScript are NOT featured (visible on /projects but not homepage cards)
-- IMPORTANT: Run the enum additions FIRST in a separate transaction, then run the inserts

-- Step 1: Add new technology enum values (run this first, separately)
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Bun';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'SQLite';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Claude API';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Telegram';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Convex';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'WhisperX';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Expo';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'React Native';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'TanStack';

-- Step 2: Insert projects (run after enum values are committed)

-- 1. Golems - Autonomous AI Agents
INSERT INTO projects (title, description, short_description, logo_path, technologies, git_url, framework, featured, order_index)
VALUES (
  'Golems - Autonomous AI Agents',
  'A monorepo ecosystem for autonomous AI agents. Features include: autonomous coding loops with PRD-driven development (Ralph), a memory layer with semantic search using sqlite-vec and sentence-transformers (Zikaron), Telegram bot integration for remote control and notifications, Night Shift for automated improvements while sleeping, and a multi-agent content pipeline for social media.',
  'Autonomous AI agent ecosystem with coding loops, semantic memory, and Telegram integration',
  '/projects/golems/logo.png',
  ARRAY['TypeScript', 'Bun', 'SQLite', 'Python', 'Claude API', 'Telegram']::technology[],
  'https://github.com/EtanHey/golems',
  'Bun',
  false,
  11
);

-- 2. SongScript - Song Transliteration Learning
INSERT INTO projects (title, description, short_description, logo_path, technologies, git_url, framework, featured, order_index)
VALUES (
  'SongScript',
  'A language learning app focused on song transliteration. Users can learn pronunciation of songs in foreign languages through phonetic transliteration. Features WhisperX pipeline for audio processing, real-time sync between lyrics and audio, and progressive difficulty levels.',
  'Learn song lyrics in any language through phonetic transliteration',
  '/projects/songscript/logo.png',
  ARRAY['React', 'TypeScript', 'TanStack', 'Convex', 'WhisperX', 'Python']::technology[],
  'https://github.com/EtanHey/songscript',
  'TanStack',
  false,
  12
);

-- 3. Real Estate Intelligence Platform (Private)
INSERT INTO projects (title, description, short_description, logo_path, technologies, git_url, framework, featured, order_index)
VALUES (
  'Real Estate Intelligence Platform',
  'A mobile-first platform for real estate professionals and investors. Aggregates property listings from multiple sources, provides market analysis tools, and offers AI-powered property valuations.',
  'AI-powered real estate aggregation and market analysis platform',
  '/projects/real-estate/logo.png',
  ARRAY['React Native', 'Expo', 'TypeScript', 'Convex', 'Claude API']::technology[],
  'private',
  'Expo',
  false,
  13
);

-- 4. Influencer Network Platform (Private - based on Union/Cantaloupe AI)
INSERT INTO projects (title, description, short_description, logo_path, technologies, git_url, framework, featured, order_index)
VALUES (
  'Influencer Network Platform',
  'A multi-tenant B2B SaaS platform connecting brands with influencers. Features include voice AI interviews for candidate screening (using Vapi), automated job board integrations, comprehensive analytics dashboard, and production-scale enterprise architecture.',
  'Enterprise B2B platform for influencer marketing with voice AI interviews',
  '/projects/influencer/logo.png',
  ARRAY['React', 'TypeScript', 'TanStack', 'Supabase', 'Vapi', 'Node']::technology[],
  'private',
  'TanStack',
  false,
  14
);
