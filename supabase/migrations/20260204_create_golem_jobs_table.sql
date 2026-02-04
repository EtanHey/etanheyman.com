-- ClaudeGolem Dashboard: Jobs Table
-- Syncs with golems job-golem scraper

-- Job status enum
CREATE TYPE job_status AS ENUM ('new', 'viewed', 'saved', 'applied', 'rejected', 'archived');

-- Main jobs table
CREATE TABLE golem_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Core job data (from scraper)
  external_id TEXT NOT NULL UNIQUE,  -- scraper's job.id
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  experience TEXT,
  description TEXT,
  url TEXT NOT NULL,
  source TEXT NOT NULL,  -- secretTLV, drushim, indeed, goozali
  language TEXT DEFAULT 'en',

  -- Dashboard tracking
  status job_status DEFAULT 'new',
  match_score INTEGER,  -- 1-10 quality score
  notes TEXT,
  tags TEXT[],  -- ['react', 'remote', 'startup']

  -- Timestamps
  scraped_at TIMESTAMPTZ NOT NULL,
  viewed_at TIMESTAMPTZ,
  applied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_golem_jobs_status ON golem_jobs(status);
CREATE INDEX idx_golem_jobs_source ON golem_jobs(source);
CREATE INDEX idx_golem_jobs_company ON golem_jobs(company);
CREATE INDEX idx_golem_jobs_scraped_at ON golem_jobs(scraped_at DESC);
CREATE INDEX idx_golem_jobs_match_score ON golem_jobs(match_score DESC) WHERE match_score IS NOT NULL;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_golem_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER golem_jobs_updated_at
  BEFORE UPDATE ON golem_jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_golem_jobs_updated_at();

-- RLS policies (admin only)
ALTER TABLE golem_jobs ENABLE ROW LEVEL SECURITY;

-- For now, allow all operations (frontend uses anon key, protected by NextAuth)
-- In production, you'd want service_role key for writes
CREATE POLICY "Allow all for authenticated" ON golem_jobs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Comments
COMMENT ON TABLE golem_jobs IS 'Job listings synced from ClaudeGolem job-golem scraper';
COMMENT ON COLUMN golem_jobs.external_id IS 'Original ID from scraper (company-slug or source-specific)';
COMMENT ON COLUMN golem_jobs.match_score IS 'AI-assigned quality score 1-10';
COMMENT ON COLUMN golem_jobs.tags IS 'User/AI assigned tags for filtering';
