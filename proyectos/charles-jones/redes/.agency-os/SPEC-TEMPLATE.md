# {Project Name} — Product Specification

_Status: Draft / In Review / Approved_
_Date: YYYY-MM-DD_
_Version: 1.0_

---

## 1. Overview

One paragraph. What this software does, the problem it solves, and who it's for.

## 2. Goals

What success looks like once the project is live. Focus on outcomes, not features.

- Goal 1
- Goal 2
- Goal 3

## 3. Users

Who or what will interact with this software. Describe each type in plain language.

### {User Type A}
Brief description: who they are, what they need, what they care about.

### {User Type B}
Brief description: who they are, what they need, what they care about.

## 4. User Stories

All functionality expressed as stories. Group by user type or flow.

### {User Type A}

- As a {user type}, I want to {action}, so that {outcome}.
- As a {user type}, I want to {action}, so that {outcome}.

### {User Type B}

- As a {user type}, I want to {action}, so that {outcome}.

## 5. Features

Derived from the stories above. Each feature maps to one or more stories.
Keep descriptions functional — what it does, not how it works.

| Feature | Description | Stories |
|---------|-------------|---------|
| {Feature name} | {What it does} | {Story refs e.g. A1, A2} |
| {Feature name} | {What it does} | {Story refs} |

## 6. Key Flows

Describe the most important sequences of actions in plain language.
No wireframes here — just the narrative of what happens step by step.

### {Flow name e.g. "User authenticates and performs main task"}

1. Step one
2. Step two
3. Step three
4. Outcome

### {Flow name e.g. "System processes event"}

1. Step one
2. Step two
3. Outcome

## 7. Out of Scope

What this project explicitly will NOT do in this version.

- {Thing that won't be built}
- {Thing that won't be built}

## 8. Open Questions

Decisions not yet made. Each question should be resolved before Tech begins.

- [ ] {Question or unresolved decision}
- [ ] {Question or unresolved decision}

## 9. API Constraints

_Fill this section only if `/api-contracts/{project-name}/CONTRACT.md` exists. Delete otherwise._

Cross-check of product scope against API capabilities. Every line here must trace back to the Capability Matrix in CONTRACT.md § 6.

- **Capabilities leveraged by this spec:**
  - {capability name} → used by stories {A1, A3}
  - {capability name} → used by stories {A7}
- **Capabilities deliberately unused** (available in the API but not in scope for this version):
  - {capability} — reason: {why we're not surfacing this now}
- **Missing capabilities** (needed by ideal scope but not yet supported by the API):
  - {capability} — affected stories: {list} — tracked as Out of Scope (§ 7) until backend delivers

## 10. Vault References

_Fill this section only when the user explicitly asked the agent to consult material under /vault/ during discovery. Delete otherwise._

- `vault/{path}` — {what it contributed to this spec}

---

_Approved by: _
_Approval date: _
_Next step: /engineering/{project-name}_
