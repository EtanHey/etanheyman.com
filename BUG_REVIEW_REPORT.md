# Bug Review Report: PR feat/audit-polish-46

**Date:** 2026-03-29  
**Reviewer:** @bugbot  
**PR Title:** fix: sync golems test stats  
**Branch:** feat/audit-polish-46

## Executive Summary

✅ **PRIMARY OBJECTIVE ACHIEVED**: The PR successfully syncs the golems test stats to 1,179 passing tests across 84 files in the three main locations (golems-stats.json, faq.md, llm.md).

❌ **CRITICAL ISSUE FOUND**: Stale test counts remain in `content/golems/journey.md` that were not updated by this PR.

⚠️ **PRE-EXISTING ISSUE**: TypeScript build error in `app/components/ui/phone-input.tsx` (unrelated to this PR).

---

## Test Results

### ✅ Regression Test (New)
```bash
pnpm test:run -- 'app/(golems)/golems/__tests__/stats-sync.test.ts'
```
**Status:** PASS  
**Result:** All 11 tests pass, including the new stats-sync test that validates:
- golems-stats.json has 1,179 passing tests across 84 files
- faq.md contains "**1,179 tests** across 84 test files."
- llm.md contains "**1,179 tests** across 84 test files."

### ✅ Full Test Suite
```bash
pnpm test:run
```
**Status:** PASS  
**Result:** All 11 tests pass across 2 test files

### ❌ Production Build
```bash
pnpm build
```
**Status:** FAIL  
**Reason:** Pre-existing TypeScript error in `app/components/ui/phone-input.tsx:35`

---

## Critical Issues Found

### 🔴 Issue #1: Stale Test Counts in journey.md

**Location:** `content/golems/journey.md`

**Problem:** Three references to outdated test counts that contradict the audited numbers:

1. **Line 204:**
   ```
   (Post-Phase 8 componentization: 1,148 tests, 3,990 assertions across 14 packages.)
   ```
   Should be: `1,179 tests` and `12 packages` (not 14)

2. **Line 345 (Table):**
   ```
   | **9. Distribution** | ... | **1,148 pass** |
   ```
   Should be: `**1,179 pass**`

3. **Line 359:**
   ```
   After:   14 packages, 1,148 tests, each golem independently installable
   ```
   Should be: `12 packages, 1,179 tests`

**Impact:** HIGH - The journey.md file is a key documentation file that tells the project's story. Having inconsistent test counts undermines the credibility of the audit and creates confusion.

**Recommendation:** Update all three references in journey.md to match the audited counts.

**Note on Assertions:** The "3,990 assertions" or "4,056 assertions" mentioned in journey.md likely refers to total test assertions across all tests, not just the 496 assertions tracked in the `evals` array (which only tracks skill evaluation assertions). This distinction should be clarified or the assertion counts should be removed if not tracked consistently.

---

## Pre-Existing Issues (Not Caused by This PR)

### ⚠️ Issue #2: TypeScript Build Error in phone-input.tsx

**Location:** `app/components/ui/phone-input.tsx:35`

**Error:**
```
Type error: Type 'MemoExoticComponent<({ country, countryName }: FlagProps) => Element>' 
is not assignable to type 'Flag | undefined'.
```

**Root Cause:** The `FlagComponent` is wrapped in `React.memo()`, which returns a `MemoExoticComponent`, but the `react-phone-number-input` library expects a `Flag` type which is `(props: FlagProps) => React.JSX.Element`.

**Impact:** MEDIUM - Blocks production builds but doesn't affect development or testing.

**Recommendation:** Fix the type mismatch by either:
1. Removing `React.memo()` wrapper from `FlagComponent`
2. Type casting the memoized component
3. Creating a wrapper function that matches the expected type signature

**Status:** Not addressed in this PR (correctly, as it's unrelated to the stats sync)

---

## Positive Findings

### ✅ Well-Structured Regression Test
The new `stats-sync.test.ts` is excellent:
- Uses filesystem reads to validate actual file content
- Checks both the JSON source and the markdown documentation
- Prevents future drift between stats sources
- Clear test description and expectations

### ✅ Consistent Formatting
All three updated locations use consistent formatting:
- "**1,179 tests**" (bold, comma-separated)
- "across 84 test files"

### ✅ Correct Package Count
The PR correctly references "12 packages" in:
- `content/golems/architecture.md`
- `content/golems/faq.md`
- `content/golems/getting-started.md`
- `content/golems/llm.md`
- `app/(portfolio)/projects/[slug]/architecture-config.ts`

---

## Recommendations

### Immediate Actions Required

1. **Update journey.md** - Fix the three stale references to test counts and package counts
2. **Extend regression test** - Add `content/golems/journey.md` to the stats-sync test to prevent future drift
3. **Consider assertion tracking** - Either:
   - Add total assertion count to `golems-stats.json` and track it consistently
   - Remove assertion count references from documentation if not tracked

### Future Improvements

1. **Fix phone-input.tsx** - Address the TypeScript error in a separate PR
2. **Centralize stats** - Consider generating documentation from `golems-stats.json` to ensure single source of truth
3. **Automate stats updates** - Add a script that updates all documentation files from the stats JSON

---

## Files Changed in This PR

✅ `app/(golems)/golems/__tests__/stats-sync.test.ts` - NEW regression test  
✅ `app/(golems)/golems/lib/golems-stats.json` - Updated to 1,179 tests  
✅ `content/golems/faq.md` - Updated test count  
✅ `content/golems/llm.md` - Updated test count (multiple locations)  
❌ `content/golems/journey.md` - MISSED - Still has stale counts  

---

## Conclusion

The PR successfully achieves its stated goal of syncing the golems test stats in the three primary locations (JSON, FAQ, LLM mirror) and adds a valuable regression test. However, it misses updating `content/golems/journey.md`, which contains three references to the old test counts and package counts.

**Verdict:** ⚠️ **APPROVE WITH CHANGES REQUIRED**

The journey.md file must be updated before merge to ensure documentation consistency across the entire codebase.
