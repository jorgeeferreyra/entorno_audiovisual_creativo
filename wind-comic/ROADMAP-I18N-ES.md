# Roadmap — i18n `es-ES` (Wind Comic)

Detalle **específico** del proyecto. El método de trabajo (iteraciones, prompts, roles) está en `../METODO-TRABAJO.md`.

---

## Contexto

Localizar todo el texto **user-facing** al español de España (`es-ES`) en Wind Comic (Next.js 16, `lib/i18n.ts`, `useLocale`).

Infra actual: locales `zh-CN`, `zh-TW`, `en`, `ja`. ~20 pantallas ya cableadas; el workbench (create, editor, polish…) sigue con texto hardcodeado en chino.

---

## Alcance global

### Incluir

- UI: labels, botones, placeholders, tooltips, toasts, modales, empty states
- Errores de formulario (`lib/validation.ts`)
- Errores API visibles al usuario (auth, invite, upload…)
- Emails (`lib/email-sender.ts`)
- Metadata (`app/layout.tsx`)
- Labels de catálogos UI (estilos, plantillas, presets) — no `promptFragment` ni prompts LLM

### Excluir

- Tests
- Comentarios de código
- Prompts LLM / pipeline
- Logs internos
- README / docs (salvo que una fase lo pida)

### Convenciones

- Locale: `es-ES` (`es`, `es-ES`, `es-MX` → `es-ES` en `normalizeLocale`)
- Traducir desde `en`
- Patrón: `useLocale()` → `t.seccion.key`

---

## Fases

| Fase | Nombre | Criterio de hecho (resumen) | Estimación |
|------|--------|----------------------------|------------|
| **0** | Infra `es-ES` | `es-ES` en i18n, selector, `normalizeLocale` | 0.5–1 d |
| **1** | Huecos ya i18n | home-data, layout meta, auth, footer, error/loading, validation | 1–2 d |
| **2** | Flujo core | auth/invite, create, listado proyectos | 3–5 d |
| **3** | Editor proyecto | `projects/[id]`, `components/project/*`, agent-chat, cameo | 7–10 d |
| **4** | Dashboard resto | polish, characters, series, team, health, usage… | 4–6 d |
| **5** | Catálogos UI | style-presets, story-templates, short-video (solo labels) | 2–3 d |
| **6** | Capa servidor | emails, API user-facing, `tServer` | 1–2 d |
| **7** | QA manual | recorrido completo, overflow, persistencia locale | 2–3 d |

Orden: 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7.

---

## Detalle por fase

### Fase 0: Infra `es-ES`

- **Objetivo:** Español disponible en el sistema i18n existente.
- **Criterio de hecho:**
  - [x] `Locale` incluye `es-ES`
  - [x] Bloque `es-ES` completo en `lib/i18n.ts` (~230 keys desde `en`)
  - [x] `LOCALES`, `LOCALE_LABELS`, `normalizeLocale`, `resolveLocaleFromHeader`
  - [x] Selector en `locale-switcher` y settings
- **Archivos:** `lib/i18n.ts`, `components/locale-switcher.tsx`, `app/settings/page.tsx`

### Fase 1: Huecos en pantallas ya i18n

- **Objetivo:** Cerrar texto suelto en pantallas que ya usan `useLocale`.
- **Criterio de hecho:**
  - [ ] `lib/home-data.ts` → i18n o `getHomeData(locale)`
  - [ ] Metadata `app/layout.tsx`
  - [ ] `app/auth/page.tsx`, footer, skip-link, `error.tsx`, `loading.tsx`
  - [ ] `lib/validation.ts` con mensajes traducibles
- **Archivos:** los anteriores + nuevas keys en `i18n.ts`

### Fase 2: Flujo core

- **Objetivo:** Registro → crear proyecto → entrar al listado sin chino visible.
- **Criterio de hecho:**
  - [ ] Auth + invite + errores API auth
  - [ ] `dashboard/create`, `create`, componentes `create/*`, `creation/*`, `pipeline-canvas`, `nodes/*`
  - [ ] `dashboard/projects`, `projects/page`
- **Archivos:** ver grep `[\u4e00-\u9fff]` en `app/dashboard/create`, `app/create`, `components/create`, `components/creation`

### Fase 3: Editor de proyecto

- **Objetivo:** Workbench completo en español.
- **Criterio de hecho:**
  - [ ] `app/projects/[id]/page.tsx`
  - [ ] `components/project/*` (prioridad: timeline, inspector, monitor, export, lipsync)
  - [ ] `agent-chat*`, `CameoPanel`, collab restante
- **Estimación:** mayor volumen del roadmap

### Fase 4: Dashboard secundario

- **Objetivo:** Resto de rutas `app/dashboard/*` user-facing.
- **Criterio de hecho:** polish, characters, series, team, health, usage, u2v, workflow-studio, templates, assets…

### Fase 5: Catálogos UI

- **Objetivo:** Labels de pickers (estilos, plantillas, modos).
- **Criterio de hecho:** `style-presets`, `story-templates`, `short-video`, presets inline en create — sin traducir prompts a modelos.

### Fase 6: Capa servidor

- **Objetivo:** Mensajes backend y emails según locale del usuario.
- **Criterio de hecho:** `email-sender.ts`, rutas API con `{ message }` visible, helper `tServer(locale, path)`.

### Fase 7: QA manual

- **Objetivo:** Validar el recorrido end-to-end.
- **Criterio de hecho:**
  - [ ] Locale persiste al recargar
  - [ ] `<html lang="es-ES">`
  - [ ] Home → pricing → auth → create → project → export sin chino/inglés suelto
  - [ ] Overflow de texto revisado
  - [ ] Emails en español

---

## Progreso

| Fase | Estado | Fecha | Notas |
|------|--------|-------|-------|
| 0 | completada | 2026-07-08 | Locale es-ES: tipo, ~230 keys, LOCALES/LOCALE_LABELS, normalizeLocale, resolveLocaleFromHeader, selector settings |
| 1 | pendiente | | |
| 2 | pendiente | | |
| 3 | pendiente | | |
| 4 | pendiente | | |
| 5 | pendiente | | |
| 6 | pendiente | | |
| 7 | pendiente | | |

---

## Prompt orquestador (este proyecto)

```markdown
# Orquestador — Wind Comic i18n es-ES

Lee:
- `METODO-TRABAJO.md` (método)
- `wind-comic/ROADMAP-I18N-ES.md` (roadmap)

Este chat es el orquestador. No implementes salvo que lo pida.

## Estado actual
- Iteración: [N]
- Última fase completada: […]
- Fase en curso: […]

## Tu tarea
[Generar prompt Fase N | Doble chequeo Fase N]
```
