# {Project Name} — Technical Foundation

_Status: Draft / In Review / Approved_
_Date: YYYY-MM-DD_
_Based on: /specifications/{project-name}/SPEC.md_
_API contract (if any): /api-contracts/{project-name}/CONTRACT.md_

---

## 1. Project Context

One paragraph summarizing the project and what technical decisions this document covers.

## 2. Tech Stack

Decisions per layer. For each choice, include a brief rationale tied to project requirements.

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Language / Runtime | {e.g. Node.js / TypeScript} | {why} |
| Framework | {e.g. Express / Fastify / NestJS} | {why} |
| Database | {e.g. PostgreSQL / SQLite / Redis} | {why} |
| Auth | {e.g. JWT / OAuth2 / API keys} | {why} |
| Hosting / Deploy | {e.g. Railway / Fly.io / AWS Lambda} | {why} |
| Other | {e.g. Stripe, Resend, S3} | {why} |

## 3. Architecture & Patterns

Paradigms and patterns the codebase must follow. Each entry should say what it applies to.

- **{Pattern name}** — {where it applies and why}
- **{Pattern name}** — {where it applies and why}

_Examples: repository pattern, domain-driven modules, event-driven processing,
feature-based folder structure, hexagonal architecture, etc._

## 4. Services

Which external services are needed, whether they are mocked or real, and when they go live.

| Service | Purpose | Stage introduced | Mock until |
|---------|---------|-----------------|------------|
| {e.g. Stripe} | Payments | Stage 2 | Stage 1 uses hardcoded flow |
| {e.g. Resend} | Transactional email | Stage 3 | Stages 1–2 log to console |

## 4b. API Contract Mapping

_Fill this section only if `/api-contracts/{project-name}/CONTRACT.md` exists. Delete otherwise._

Every feature in SPEC.md § 5 maps to one or more endpoints from the contract.
This table is the hand-off to the Build phase: scaffold HTTP client, types,
schemas and mock handlers strictly following this mapping.

| Feature (SPEC § 5) | Endpoint(s) from CONTRACT | Auth | Data model(s) from CONTRACT § 5 | Notes |
|---|---|---|---|---|
| {e.g. Login} | `POST /auth/login` | public → sets token | `User`, `LoginResponse` | Token stored in HttpOnly cookie |
| {e.g. Dashboard} | `GET /me` | Bearer | `User` | |

**Capabilities referenced from CONTRACT § 6**: {list the ✅ capabilities this tech doc relies on}

**Capabilities deferred / out of scope for tech**: {list ✅ capabilities from CONTRACT that are NOT consumed in any stage, with reason}

**Blockers from CONTRACT § 10 (Open Questions)**: {list questions that must be resolved before specific stages — tie each to the stage it blocks}

## 5. Roadmap

Broken into independent, shippable stages. Each stage must be usable on its own.

### Stage 1 — {Name, e.g. "Core MVP"}

**Goal:** {What is functional at the end of this stage}

**Scope:**
- {Feature or flow from SPEC.md}
- {Feature or flow from SPEC.md}

**Out of this stage:**
- {What is explicitly deferred}

**API endpoints live this stage** _(only if § 4b applies):_
- {e.g. `POST /auth/login`, `GET /me`}

**API endpoints still mocked** _(only if § 4b applies):_
- {e.g. `POST /deposits` mocked — transition to real in Stage 2}

**Exit criteria:** {How we know this stage is done}

---

### Stage 2 — {Name, e.g. "Integrations"}

**Goal:** {What is functional at the end of this stage}

**Scope:**
- {Feature or flow}
- {Feature or flow}

**Dependencies:** Stage 1 complete

**Exit criteria:** {How we know this stage is done}

---

### Stage N — {Name}

_(repeat as needed)_

## 6. Open Questions

Technical decisions not yet resolved. Must be answered before development of the relevant stage begins.

- [ ] {Question}
- [ ] {Question}

## 7. Vault References

_Fill this section only when the user explicitly asked the agent to consult material under /vault/ during tech discovery. Delete otherwise._

- `vault/{path}` — {what it contributed to this document}

---

_Approved by: _
_Approval date: _
_Next step: /projects/{project-name}_
