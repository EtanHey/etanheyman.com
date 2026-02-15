---
sidebar_position: 1
---

# Railway Deployment

Golems Phase 2 runs on **Railway** as the cloud "body" while the Mac remains the "brain" (Telegram bot, Night Shift, notifications).

## Railway Project

Create a new project in Railway with these settings:

- **Organization:** Your Railway org
- **Project:** golems (or any name you choose)
- **Service:** golems
- **Region:** Any region (US West, Europe, etc.)
- **Root:** `/` (repo root)
- **Builder:** Dockerfile

## Getting Started

### Install Railway CLI

```bash
brew install railway
```

### Authenticate

```bash
railway login
# Opens browser to authorize
```

### Link Project

From repo root or `packages/autonomous/`:

```bash
railway link
# Select your org
# Select your project
```

### Deploy

```bash
railway up
# Rebuilds Docker image and deploys
```

Watch logs:

```bash
railway logs -f
```

## Environment Variables

Set all 18 variables in Railway dashboard (`Settings` → `Variables`):

### Core Configuration

| Variable | Value | Notes |
|----------|-------|-------|
| `LLM_BACKEND` | `gemini` | Cloud execution (free Gemini Flash-Lite) |
| `STATE_BACKEND` | `supabase` | Cloud state |
| `TELEGRAM_MODE` | `direct` | Direct API calls |
| `TZ` | `Asia/Jerusalem` | Scheduling |

### API Keys (from 1Password)

| Variable | Source | Required |
|----------|--------|----------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google AI Studio | ✅ Yes |
| `SUPABASE_URL` | Your Supabase project (format: `https://YOUR_PROJECT.supabase.co`) | ✅ Yes |
| `SUPABASE_SERVICE_KEY` | Supabase dashboard → Settings → API | ✅ Yes |
| `GMAIL_CLIENT_ID` | Google Cloud Console → OAuth credentials | ✅ Yes |
| `GMAIL_CLIENT_SECRET` | Google Cloud Console | ✅ Yes |
| `GMAIL_REFRESH_TOKEN` | OAuth flow (see Gmail setup docs) | ✅ Yes |
| `TELEGRAM_BOT_TOKEN` | @BotFather on Telegram | ✅ Yes |
| `TELEGRAM_CHAT_ID` | Your Telegram group/chat ID | ✅ Yes |

### Telegram Topics

Two topics in the Telegram group:

| Variable | Purpose |
|----------|---------|
| `TELEGRAM_TOPIC_GENERAL` | Interactive ClaudeGolem chat |
| `TELEGRAM_TOPIC_ALERTS` | One-way notifications (jobs, email, nightshift, health) |

### Monitoring

| Variable | Value | Purpose |
|----------|-------|---------|
| `RAILWAY_URL` | Auto-populated by Railway | Health check endpoint |

## Health & Monitoring

### Health Check Endpoint

```
GET /health
```

Returns `200 OK` with:

```json
{
  "status": "ok",
  "uptime": 3600,
  "backend": "gemini",
  "stateBackend": "supabase",
  "telegramMode": "direct",
  "israelTime": "2026-02-06T12:30:00+02:00",
  "isWorkHours": true,
  "isWorkday": true
}
```

Railway automatically checks `/health` every 30 seconds.

### Usage Metrics Endpoint

```
GET /usage
```

Returns API cost stats:

```json
{
  "totalCalls": 145,
  "totalInputTokens": 28450,
  "totalOutputTokens": 12890,
  "estimatedCostUSD": 0.58,
  "recentCalls": [
    {
      "timestamp": "2026-02-06T10:30:00Z",
      "model": "gemini-2.5-flash-lite",
      "source": "email-golem",
      "inputTokens": 1250,
      "outputTokens": 342
    }
  ],
  "bySource": {
    "email-golem": { "calls": 52, "cost": 0.23 },
    "job-golem": { "calls": 93, "cost": 0.35 }
  }
}
```

### Uptime Monitoring

Configure **UptimeRobot** (free tier):

1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Add monitor: `https://your-service.up.railway.app/health`
3. Check every 5 minutes
4. Set webhook notification to Telegram (optional - configure bot webhook)
5. Receives alerts in Telegram `⏰ Uptime` topic

## Rollback Strategy

All configs are **environment-based** for quick rollback:

### Revert LLM Backend

If cloud LLM has issues:

```bash
railway variables set LLM_BACKEND=ollama
railway up
```

Then switch back:

```bash
railway variables set LLM_BACKEND=gemini
railway up
```

### Revert State Backend

If Supabase has issues:

```bash
railway variables set STATE_BACKEND=file
railway up
```

### Revert Telegram Mode

If direct notifications fail:

```bash
railway variables set TELEGRAM_MODE=local
railway up
```

## Database Migrations

Supabase migrations live in `packages/autonomous/supabase/migrations/`:

```bash
# List pending migrations
supabase migration list --linked

# Apply migration
supabase db push
```

Phase 2 migration: `003_cloud_offload.sql`

## Logs & Debugging

### View Logs

```bash
# Stream live logs
railway logs -f

# Last 100 lines
railway logs
```

### Common Issues

#### 502 Bad Gateway
- Check if service is running: `railway logs -f`
- Verify all required env vars are set
- Check SUPABASE_URL and SUPABASE_SERVICE_KEY

#### Telegram notifications not sending
- Verify TELEGRAM_BOT_TOKEN is correct
- Check TELEGRAM_CHAT_ID is negative (for groups)
- Verify topic IDs (TELEGRAM_TOPIC_*)

#### LLM calls failing
- Check GOOGLE_GENERATIVE_AI_API_KEY is set
- Verify API key is valid in Google AI Studio
- Check logs for rate limiting

### Debug Command

```bash
railway exec bash
# Now in Railway container
bun run src/cloud-worker.ts
```

## Cost Management

Monitor API costs in three places:

1. **Railway dashboard** — Compute (usually $5-10/month)
2. **Google AI Studio** — LLM calls (Gemini Flash-Lite is free tier)
3. **Supabase dashboard** — Database queries

Gemini Flash-Lite is free for personal use. Total monthly cost is mostly Railway compute: ~$5-10.

## Scaling

### Horizontal

Railway auto-scales based on CPU/memory:

```bash
# Check current plan
railway environments list

# Upgrade to Pro for auto-scaling
# (requires paid Railway account)
```

### Vertical

Increase memory in `railway.json`:

```json
{
  "services": {
    "golems": {
      "runtime": "dockerfile",
      "memory": "512",
      "cpus": "1"
    }
  }
}
```

## See Also

- [Environment Variables](../configuration/env-vars.md) — Complete variable reference
- [Secrets Management](../configuration/secrets.md) — How to store API keys
- [Golems Architecture](../architecture.md) — System design
