# Dev Agency OS — Operational Context

This file unifies the phase-specific guidance for Spec, Tech, and Build.
Each project lives in `/<project-name>/` with flat docs and an `app/` folder for code.

---

## Phase 0 — API Contract (optional)

**Purpose:** Ingest an existing backend or third-party API as project input.

**Output:** `/<project-name>/CONTRACT.md` (when applicable)

**When to run:** Only when the project consumes a pre-existing API. Green-field projects skip it.

---

## Phase 1 — Spec

**Purpose:** Capture the full product vision through conversation — translating what the user wants to build into structured, technology-agnostic specifications. No code, no stack decisions, no implementation details.

**Output:** `/<project-name>/SPEC.md` — see `.agency-os/SPEC-TEMPLATE.md`

**Core principles:**
- Conversation first — extract requirements by asking, not assuming
- User language — specs are written as humans talk, not as developers think
- Stories over lists — every feature is expressed as user behavior
- Complete before moving on — no Tech work starts without a signed-off SPEC.md
- Scope is explicit — what's OUT of scope is as important as what's in

**Workflow:**
0. If `/<project-name>/CONTRACT.md` exists, load it as readonly BEFORE starting discovery. Read the full contract, paying special attention to the Capability Matrix — it defines what stories are actually buildable.
0b. If the user explicitly references a file under `/vault/` in their prompt, load that file as readonly for this session. Never browse or list the vault on your own. Cite any consulted vault file in SPEC.md § 10 "Vault References".
1. Start a discovery conversation — ask open questions to understand the problem, users, key behaviors, success criteria, and existing flows in mind.
2. Keep asking until the full picture is clear — do not write anything yet.
3. Summarize your understanding back to the user and ask for confirmation. If a contract is loaded, include a capabilities cross-check.
4. Only after confirmation: create `/<project-name>/` (if needed) and write SPEC.md there.
5. Present SPEC.md to the user for review.
6. Incorporate feedback and iterate until the user explicitly approves.
7. Mark spec as complete — Tech phase can now begin.

**What belongs in a spec:** overview, goals, users, user stories, features, out of scope, open questions, vault references.

**What does NOT belong:** technology choices, implementation details, API design or data models, performance or infrastructure requirements.

---

## Phase 2 — Tech

**Purpose:** Define the technical foundation before a single line of code is written. Every decision must be justified by SPEC.md.

**Output:** `/<project-name>/TECH.md` — see `.agency-os/TECH-TEMPLATE.md`

**Core principles:**
- Spec-driven — every technical choice must trace back to a requirement
- Staged by default — roadmap broken into independent, shippable stages
- Mock first — external services mocked until the stage that requires them
- Explicit over implicit — document why, not just what
- Minimal viable stack — simplest option that covers the requirements

**Workflow:**
1. Load `/<project-name>/SPEC.md` (readonly) as the foundation.
1b. If the user explicitly references a file under `/vault/`, load it readonly. Cite in TECH.md § 7 "Vault References".
2. If `/<project-name>/CONTRACT.md` exists, load it as readonly (hard gate: must be approved). Pre-resolved decisions: auth, data shapes, real-time strategy, error handling, rate limits. Only ask about decisions the contract does NOT resolve.
3. Start a technical discovery conversation — one topic at a time.
4. Summarize all decisions and ask for confirmation. Include feature → endpoint mapping when a contract exists.
5. Only after confirmation: write TECH.md in `/<project-name>/`.
6. Present TECH.md for review.
7. Incorporate feedback until explicit approval.
8. Mark tech phase complete — Build can begin.

**What belongs here:** stack with rationale, architecture patterns, services (real vs mocked), roadmap stages, coding conventions, API Contract Mapping when CONTRACT.md exists.

**What does NOT belong:** actual code, business logic decisions, vague best practices.

---

## Phase 3 — Build

**Purpose:** Implement feature by feature, stage by stage, following TECH.md. Work is always incremental.

**Output:** Code in `/<project-name>/app/` — progress in `/<project-name>/PROGRESS.md` (see `.agency-os/PROGRESS-TEMPLATE.md`)

**Core principles:**
- Feature by feature — implement only what the user explicitly requests
- Always pausable — every session ends with a working, committable state
- References before code — always load specs and tech docs before writing anything
- Progress is persistent — PROGRESS.md is the single source of truth across sessions
- Env over hardcode — keys, URLs, secrets live in .env, never in code
- Security by default — .env is never committed; .env.example always kept up to date

**On first use (project setup):**
1. Load `/<project-name>/TECH.md` (readonly)
2. Load `/<project-name>/SPEC.md` (readonly)
2b. If `/<project-name>/CONTRACT.md` exists, load it as readonly
3. Ask: "Which stage do you want to start with?"
4. Scaffold `/<project-name>/app/` based on the approved stack
5. Create .env.example with all expected variables (no real values)
6. Create .gitignore ensuring .env is excluded
7. Bootstrap `/<project-name>/PROGRESS.md` from `.agency-os/PROGRESS-TEMPLATE.md`
8. Confirm setup before writing feature code

**On each session (feature implementation):**
1. Load TECH.md (readonly); CONTRACT.md if exists (readonly)
2. Load PROGRESS.md (read-write)
3. Summarize current stage, last session, and next step — ask what to work on
4. Wait for user response — do not assume scope
5. Confirm feature scope before writing code
6. Before HTTP client/type/schema code: derive directly from CONTRACT.md if present
7. Implement following TECH.md patterns
8. New env vars → add to .env.example, tell user to update .env
9. Vault files only when user names them explicitly
10. Update PROGRESS.md: tick scope bullets, update stage if complete, prepend session log, move deferred items, update date

**Environment rules:**
- All secrets in .env — never committed
- .env.example always committed and in sync
- Config via single config module — never process.env in feature code
- Mocks in clearly named files, replaced when real service goes live

**Pausing & resuming:**
- Confirm committable state at session end
- Never leave codebase broken between sessions
- PROGRESS.md updated before closing session
- On resume: reload docs + PROGRESS.md, ask what to tackle

---

## Starting a New Project

1. Choose a name: lowercase, hyphenated (e.g. `sitio-web`, `tablero-de-control`)
2. Create `/<project-name>/` at repo root
3. Copy `.agency-os/SPEC-TEMPLATE.md` → `/<project-name>/SPEC.md` and begin Phase 1
4. Optional: if consuming an existing API, run Phase 0 first → `/<project-name>/CONTRACT.md`
