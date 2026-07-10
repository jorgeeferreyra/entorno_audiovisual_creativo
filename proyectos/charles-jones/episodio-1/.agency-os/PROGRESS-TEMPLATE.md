# {Project Name} — Build Progress

_Last updated: YYYY-MM-DD_
_Current stage: Stage N — {name}_
_Based on roadmap: /engineering/{project-name}/TECH.md § 5_

---

## 1. Stage Status

Mirror of the roadmap in TECH.md. Mark a stage `[x]` only when all its **Exit criteria** are met.

- [ ] **Stage 1 — {name}** — {one-line goal}
- [ ] **Stage 2 — {name}** — {one-line goal}
- [ ] **Stage 3 — {name}** — {one-line goal}
- [ ] **Stage N — {name}** — {one-line goal}

## 2. Feature / Scope Status

Granular checklist of the scope of the **current stage** (copied from TECH.md § 5 scope bullets). Keep only the in-flight stage here; completed stages move to the log.

### Stage N — {name}

- [ ] {Scope bullet from TECH.md}
- [ ] {Scope bullet from TECH.md}
- [ ] {Scope bullet from TECH.md}

## 3. Session Log

Append a new entry at the **top** at the end of every session. Never edit past entries — add a new one if you change your mind.

### YYYY-MM-DD — {short title}

- **Stage in flight:** {stage N}
- **Done this session:**
  - {concrete thing implemented, tie it to a scope bullet or exit criterion when possible}
  - {…}
- **Next step:**
  - {concrete next task the user or agent identified}
- **Open questions resolved:**
  - {TECH.md open question + its answer, if any were resolved}
- **New blockers / questions raised:**
  - {anything that needs a decision before progress continues}
- **Vault references consulted:**
  - {vault/{path} — what it informed, or "none"}

---

### YYYY-MM-DD — {previous session title}

_(older entries follow, newest first)_

## 4. Deferred / Parking Lot

Things explicitly pushed out of current scope but worth remembering.

- {item} — {reason it was deferred}

---

_Maintained by: the build agent at the end of every session._
_Read by: the build agent at the start of every session, before asking the user what to work on._
