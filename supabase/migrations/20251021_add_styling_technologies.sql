-- Migration: Add styling and build tool technologies
-- Created: 2025-10-21
-- Description: Adds SASS, build tools, and other styling-related technologies

ALTER TYPE technology ADD VALUE IF NOT EXISTS 'SASS';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'SCSS';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Less';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'PostCSS';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Webpack';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'ESBuild';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Rollup';
ALTER TYPE technology ADD VALUE IF NOT EXISTS 'Babel';
