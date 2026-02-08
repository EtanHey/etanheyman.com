# Phase 1: Foundation

> [Back to main plan](../README.md)

## Goal
Database migrations, typed constants, server-side job counts.

## Tools
- **Code:** Opus orchestration + cursor for server actions
- **DB:** Supabase MCP for migrations

## Steps
1. Supabase migration: normalize email categories + add rejection_tags/rejection_note columns
2. Type constants.ts: EmailCategory type, RejectionTag type, remove "rejected" JobStatus
3. Update jobs server action: add statusCounts to response, exclude archived by default
4. Update emails server action: add pagination (page/pageSize params)

## Status
- [x] Supabase migration applied
- [x] Constants typed (EmailCategory, RejectionTag, JobStatus simplified)
- [ ] Jobs server action: statusCounts + exclude archived
- [ ] Emails server action: pagination
