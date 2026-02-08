-- Feedback Loop: Human correction columns for AI scoring
-- Enables the approve/reject pattern on emails and jobs

-- ═══════════════════════════════════════════════════════
-- Emails: Add human correction columns
-- ═══════════════════════════════════════════════════════
ALTER TABLE emails ADD COLUMN IF NOT EXISTS human_score INTEGER;
ALTER TABLE emails ADD COLUMN IF NOT EXISTS human_category TEXT;
ALTER TABLE emails ADD COLUMN IF NOT EXISTS corrected_at TIMESTAMPTZ;

COMMENT ON COLUMN emails.human_score IS 'Human-corrected score (NULL = uncorrected, use AI score)';
COMMENT ON COLUMN emails.human_category IS 'Human-corrected category (NULL = uncorrected, use AI category)';
COMMENT ON COLUMN emails.corrected_at IS 'When the human correction was made';

-- ═══════════════════════════════════════════════════════
-- Jobs: Add human correction columns
-- ═══════════════════════════════════════════════════════
ALTER TABLE golem_jobs ADD COLUMN IF NOT EXISTS human_match_score INTEGER;
ALTER TABLE golem_jobs ADD COLUMN IF NOT EXISTS human_relevant BOOLEAN;
ALTER TABLE golem_jobs ADD COLUMN IF NOT EXISTS corrected_at TIMESTAMPTZ;

COMMENT ON COLUMN golem_jobs.human_match_score IS 'Human-corrected match score (NULL = uncorrected)';
COMMENT ON COLUMN golem_jobs.human_relevant IS 'Human relevance judgment (true = good match, false = bad match)';
COMMENT ON COLUMN golem_jobs.corrected_at IS 'When the human correction was made';

-- Index for finding uncorrected items (review queue)
CREATE INDEX IF NOT EXISTS idx_emails_uncorrected ON emails(scored_at DESC) WHERE human_score IS NULL;
CREATE INDEX IF NOT EXISTS idx_golem_jobs_uncorrected ON golem_jobs(scraped_at DESC) WHERE human_match_score IS NULL;

-- RPC: Get correction stats for dashboard overview
CREATE OR REPLACE FUNCTION get_correction_stats()
RETURNS JSON AS $$
  SELECT json_build_object(
    'emails_total', (SELECT COUNT(*) FROM emails),
    'emails_corrected', (SELECT COUNT(*) FROM emails WHERE human_score IS NOT NULL),
    'emails_disagreements', (SELECT COUNT(*) FROM emails WHERE human_score IS NOT NULL AND human_score != score),
    'jobs_total', (SELECT COUNT(*) FROM golem_jobs),
    'jobs_corrected', (SELECT COUNT(*) FROM golem_jobs WHERE human_match_score IS NOT NULL OR human_relevant IS NOT NULL),
    'jobs_thumbs_up', (SELECT COUNT(*) FROM golem_jobs WHERE human_relevant = true),
    'jobs_thumbs_down', (SELECT COUNT(*) FROM golem_jobs WHERE human_relevant = false)
  );
$$ LANGUAGE sql SECURITY DEFINER;
