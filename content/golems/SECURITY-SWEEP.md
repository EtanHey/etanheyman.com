# Security Sweep — Golems Docsite

> Scanned `content/golems/**/*.md` (30+ files) and `app/(golems)/**/*` on 2026-02-11.

---

## Results

| Category | Status | Details |
|----------|--------|---------|
| **1. Leaked Secrets** | **PASS** | No raw API keys, tokens, or passwords found. All secret references use `op read` with placeholder vault paths (`op://YOUR_VAULT/YOUR_ITEM/credential`). No `sk-ant-*`, `ghp_*`, `xoxb-*`, or `AKIA*` patterns. |
| **2. Personal Data** | **PASS** | No real email addresses. One fictional demo email (`hiring@linear.dev`) in page.tsx terminal mock — clearly illustrative. No phone numbers. No IP addresses. |
| **3. Internal Paths** | **PASS** | `~/.golems-zikaron/` paths appear 25+ times but only as architectural documentation (state dir, cost logs, outreach DB). No actual file contents, secrets, or sensitive state values leaked. Telegram chat IDs use placeholder `-1001234567890` (not real). |
| **4. Supabase/Railway** | **PASS** | No real project IDs (`mkijzwkuubtfjqcemorx` absent). All URLs use placeholders: `YOUR_PROJECT.supabase.co`, `your-service.up.railway.app`. Supabase keys shown as `eyJ...` (truncated, not real). No anon keys exposed. |
| **5. OAuth Tokens** | **PASS** | Gmail references are descriptive only (`GMAIL_CLIENT_ID=your_client_id`, `GMAIL_CLIENT_SECRET=GOCSPX-...`). No actual refresh tokens or client secrets. All sourced via `op read` placeholders. |
| **6. Real People** | **PASS** | No recruiter names, hiring manager names, or real company names from job search. Generic roles used ("Senior Engineer", "Tech Lead"). Only named person is Etan Heyman (the author) — intentional and public. |

---

## Flags (Low Risk)

### 1Password vault name `development` exposed (6 occurrences)

**Files:** `llm.md` (lines 1187-1191), `golems/claude.md` (lines 142-146)

```
op read op://development/TELEGRAM_BOT_TOKEN/credential
op read op://development/ANTHROPIC_GOLEMS_API_KEY/credential
```

These use the real vault name `development` and real item names (`TELEGRAM_BOT_TOKEN`, `ANTHROPIC_GOLEMS_API_KEY`). All other op:// references use `YOUR_VAULT/YOUR_ITEM` placeholders.

**Risk:** LOW. Vault/item names alone don't grant access (1Password requires authentication). But they do reveal the naming convention. Consider replacing with `YOUR_VAULT` placeholders for consistency.

### Zikaron project path format visible

`mcp-tools.md:246` shows the path format: `-Users-etanheyman-Gits-golems`

**Risk:** NEGLIGIBLE. This is a public repo path, already visible on GitHub.

---

## Summary

**All 6 categories: PASS.** No secrets, credentials, PII, or sensitive infrastructure details are exposed. The one minor flag is 6 lines using the real 1Password vault name `development` instead of `YOUR_VAULT` placeholder — cosmetic consistency issue, not a security risk.
