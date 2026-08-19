-- Security-advisor hardening, 2026-08-18.
-- Source: Supabase security lints on project mkijzwkuubtfjqcemorx (Portfolio).
--
-- 1) Three SECURITY DEFINER RPCs were executable by anon AND authenticated via
--    /rest/v1/rpc/*. Caller audit (etanheyman.com + golems-dashboard, 2026-08-18)
--    found ZERO live call sites for all three, so EXECUTE is revoked outright.
--    (The dashboard's stats RPCs — get_token_stats, get_pipeline_stats, get_job_stats,
--    get_email_stats, get_linkedin_stats — are a different set and are untouched.)
REVOKE EXECUTE ON FUNCTION public.get_correction_stats() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_job_status_counts() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_email_category_stats() FROM anon, authenticated;

-- 2) Pin search_path on every flagged function (mutable-search_path lint).
--    Empty search_path forces schema-qualified references; these are all simple
--    public-schema bodies, so pin to public instead to avoid breaking them.
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.update_backlog_updated_at() SET search_path = public;
ALTER FUNCTION public.get_email_category_stats() SET search_path = public;
ALTER FUNCTION public.get_job_status_counts() SET search_path = public;
ALTER FUNCTION public.get_correction_stats() SET search_path = public;
ALTER FUNCTION public.get_email_stats() SET search_path = public;
ALTER FUNCTION public.get_job_stats() SET search_path = public;
ALTER FUNCTION public.get_pipeline_stats() SET search_path = public;
ALTER FUNCTION public.get_linkedin_stats() SET search_path = public;
ALTER FUNCTION public.get_token_stats(integer) SET search_path = public;

-- 2026-08-19 follow-up (applied live the same day): the direct revokes above are
-- insufficient — EXECUTE also flows through PUBLIC's default grant. Close it:
REVOKE EXECUTE ON FUNCTION public.get_correction_stats() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_job_status_counts() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_email_category_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_correction_stats() TO service_role;
GRANT EXECUTE ON FUNCTION public.get_job_status_counts() TO service_role;
GRANT EXECUTE ON FUNCTION public.get_email_category_stats() TO service_role;
