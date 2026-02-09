# Phase 2: Jobs Overhaul

> [Back to main plan](../README.md)

## Goal
Rework job page: bad match modal, hide archived, date sort default, warning badges.

## Tools
- **Code:** cursor for component generation, Opus for wiring

## Steps
1. Create BadMatchModal component (tag chips + optional note + confirm)
2. Wire bad match flow: thumbs down → modal → save tags + auto-archive
3. Default view excludes archived; add Archive tab
4. Default sort = date
5. Warning badge on jobs with no description or generic "Job #" titles
6. Remove "Reject" button, replace with bad match in RelevanceButtons
7. Server action: saveJobRejection(jobId, tags, note) → sets archived + tags

## Depends On
- Phase 1 (constants + server actions)

## Status
- [ ] BadMatchModal component
- [ ] Bad match flow wiring
- [ ] Hide archived from default
- [ ] Default sort = date
- [ ] Warning badges
- [ ] Replace reject button
- [ ] Server action for rejection
