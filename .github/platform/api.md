# API Reference

> All platform APIs are Next.js App Router routes in `platform/src/app/api/`.
>
> Base URL: `https://platform.getaiready.dev` (prod) / `https://dev.platform.getaiready.dev` (dev) / `http://localhost:8888` (local).

## Authentication

AIReady Platform supports two authentication methods:

1. **Session-based (Web):** Used by the dashboard. Handled via NextAuth v5 session cookies.
2. **Token-based (CLI/API):** Used by the CLI and external integrations. Uses `Authorization: Bearer <API_KEY>` header.

Unauthenticated requests return `401 Unauthorized`.

---

## Auth Endpoints (NextAuth v5)

| Route                     | Method   | Auth | Description                                                    |
| ------------------------- | -------- | ---- | -------------------------------------------------------------- |
| `/api/auth/[...nextauth]` | GET/POST | ❌    | NextAuth catch-all (OAuth callbacks, signIn, signOut, session) |
| `/api/auth/register`      | POST     | ❌    | Create new account (email + password)                          |
| `/api/auth/magic-link`    | POST     | ❌    | Request magic link email via SES                               |
| `/api/auth/verify`        | POST     | ❌    | Verify magic link token, returns user for signIn() call        |
| `/api/auth/keys`          | GET      | ✅    | List user's API keys (Browser only)                            |
| `/api/auth/keys`          | POST     | ✅    | Create a new API key (Browser only)                            |

---

## Repository Endpoints

| Route        | Method | Auth | Description         |
| ------------ | ------ | ---- | ------------------- |
| `/api/repos` | GET    | ✅   | List user's repos   |
| `/api/repos` | POST   | ✅   | Register a new repo |
| `/api/repos` | DELETE | ✅   | Delete a repo       |

### `GET /api/repos`

Supports both session and API key auth.

```typescript
// Response 200
{
  "repos": [
    {
      "id": "r1e2p3o4",
      "name": "my-project",
      "url": "https://github.com/acme/my-project",
      "aiScore": 72,
      "lastAnalysisAt": "2026-02-22T10:30:00Z",
      "isScanning": false,
      "createdAt": "2026-02-22T10:00:00Z"
    }
  ],
  "limits": {
    "maxRepos": 3,
    "currentCount": 1,
    "remaining": 2
  }
}
```

### `POST /api/repos`

```typescript
// Request
{ "name": "my-project", "url": "https://github.com/acme/my-project" }

// Response 201
{ 
  "repo": { "id": "r1e2p3o4", "name": "my-project", ... },
  "reposRemaining": 2
}
```

---

## Analysis Endpoints

| Route                  | Method | Auth | Description                     |
| ---------------------- | ------ | ---- | ------------------------------- |
| `/api/analysis/upload` | POST   | ✅   | Upload aiready CLI JSON results |

### `POST /api/analysis/upload`

Validates repo ownership (via repoId or inferred from Git URL in payload), stores raw JSON to S3, creates Analysis record (status: processing), and triggers async processing.

```typescript
// Request
{
  "repoId": "r1e2p3o4", // optional if URL is in data
  "data": { 
    "metadata": {
      "repository": "https://github.com/acme/my-project",
      "timestamp": "2026-02-22T10:30:00.000Z"
    },
    /* ... rest of CLI output ... */ 
  }
}

// Response 201
{
  "analysis": {
    "id": "an1a2l3y4",
    "repoId": "r1e2p3o4",
    "timestamp": "2026-02-22T10:30:00.000Z",
    "status": "processing",
    "rawKey": "analyses/a1b2c3d4/r1e2p3o4/2026-02-22T10:30:00.000Z.json"
  },
  "message": "Analysis uploaded. Processing metrics...",
  "limits": {
    "runsRemaining": 9,
    "maxRunsPerMonth": 10,
    "resetDate": "2026-03-01T00:00:00Z"
  }
}
```


---

## Remediation Endpoints

| Route                   | Method | Auth | Description                                           |
| ----------------------- | ------ | ---- | ----------------------------------------------------- |
| `/api/remediation`      | GET    | ✅   | List remediations (filter by repoId or teamId/status) |
| `/api/remediation`      | POST   | ✅   | Create a remediation request                          |
| `/api/remediation/[id]` | PATCH  | ✅   | Update remediation status                             |

### `GET /api/remediation`

```typescript
// Query params: ?repoId=r1e2p3o4  OR  ?teamId=t1e2a3m4&status=pending

// Response 200
{
  "remediations": [
    {
      "id": "re1m2e3d4",
      "repoId": "r1e2p3o4",
      "type": "consolidation",
      "risk": "medium",
      "status": "pending",
      "title": "Consolidate duplicate API handlers",
      "affectedFiles": ["src/api/users.ts"],
      "estimatedSavings": 3200,
      "createdAt": "2026-02-22T10:35:00Z"
    }
  ]
}
```

### `POST /api/remediation`

```typescript
// Request
{
  "repoId": "r1e2p3o4",
  "type": "consolidation",
  "risk": "medium",
  "title": "Consolidate duplicate API handlers",
  "description": "...",
  "affectedFiles": ["src/api/users.ts", "src/api/auth.ts"],
  "estimatedSavings": 3200
}
```

### `PATCH /api/remediation/[id]`

```typescript
// Request
{ "status": "in_progress" }  // pending | in_progress | completed | dismissed
```

---

## Billing Endpoints

| Route                  | Method | Auth            | Description                  |
| ---------------------- | ------ | --------------- | ---------------------------- |
| `/api/billing/webhook` | POST   | ❌ (Stripe sig) | Stripe webhook handler       |
| `/api/billing/portal`  | POST   | ✅              | Create Stripe portal session |

### `POST /api/billing/webhook`

Verifies Stripe webhook signature (`STRIPE_WEBHOOK_SECRET`). Handles:

- `checkout.session.completed` — upgrades team plan
- `customer.subscription.updated` — syncs plan changes
- `customer.subscription.deleted` — downgrades to free
- `invoice.payment_failed` — marks subscription past due

### `POST /api/billing/portal`

> ⚠️ **Stub** — Currently returns `400 { "error": "Billing not configured for this user" }`.
> Full Stripe Customer Portal integration is pending.

---

## Error Format

```json
{ "error": "Descriptive message", "statusCode": 401 }
```

Common HTTP status codes: `400` validation error, `401` unauthenticated, `403` ownership mismatch, `404` not found, `500` server error.

---

## Not Yet Implemented

These endpoints are documented in plans but not yet built:

| Endpoint                      | Status  | Notes                             |
| ----------------------------- | ------- | --------------------------------- |
| `GET /api/repos/:id/analyses` | Planned | List analyses for a specific repo |
| `GET /api/teams`              | Planned | Multi-team management             |
| `POST /api/teams`             | Planned | Team creation flow                |
| Metrics trend endpoints       | Planned | Time-series charts for dashboard  |
| Benchmarking endpoints        | Planned | Cross-repo comparison (Pro+)      |
