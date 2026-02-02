# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm run dev      # Start Vite dev server with hot reload
npm run build    # Build for production (TypeScript + Vite)
npm run preview  # Preview production build locally
```

## Architecture

This repository is an umbrella for multiple procedural SVG generators built with Paper.js and a shared schema-driven parameter UI library.

### Tech Stack
- TypeScript + Vite
- Paper.js for vector graphics and path intersections
- Deployed to GitHub Pages via GitHub Actions

### Code Structure

The codebase is organized into shared modules and per-generator modules:

| Path | Purpose |
|------|---------|
| `src/core/` | Generator types + registry. |
| `src/generators/` | Each generator has its own `schema.ts`, `render.ts`, `index.ts`. |
| `src/param-lib/` | Schema-driven parameter UI library used by all generators. |
| `src/random.ts` | Seeded PRNG (`xmur3` + `mulberry32`) and helpers. |
| `src/geometry.ts` | Shared geometry helpers used by generators. |
| `src/ui.ts` | `mountGeneratorUI()` helper for generator pages. |
| `src/main.ts` | Single entry: gallery and generator view routing. |

#### param-lib (`src/param-lib/`)

A schema-driven parameter library that generates types, UI, and coercion from a declarative schema:

| File | Purpose |
|------|---------|
| `types.ts` | Schema types (`FieldDef`, `Schema`) and `InferParams<S>` mapped type |
| `utils.ts` | `clampInt()`, `clampFloat()`, `generateSeed()`, `resolveRef()` |
| `coerce.ts` | `getDefaults(schema)`, `createCoercer(schema)` |
| `ui.ts` | `createParamUI(schema, config)` - generates complete UI from schema |
| `index.ts` | Public API re-exports |

### Pages and URLs

- `/` is the gallery index.
- Generator pages are selected via query param: `/?g=moonrise` (links are generated from the registry).

### Generator Modules

Each generator exports:
- `schema` (param-lib schema definition)
- `render(params)` (returns SVG string)
- `meta` in `index.ts` with name/description for the gallery

### Moonrise Generator Notes

Moonrise (in `src/generators/moonrise/`) renders arc-aligned circles and uses boolean intersections for its panelized output:
1. A mathematical function `f(x)` defines an arc curve.
2. Random points are generated using a seeded PRNG.
3. Curved paths are created that follow the arc function.
4. Circular panels are positioned along the arc.
5. Paper.js computes intersections between paths and circles.
6. Original shapes are removed, leaving intersected segments.

### Rendering Modes (Moonrise)

- **Preview**: All panels rendered with blue border and red panel rectangles for debugging.
- **Export**: Single selected panel rendered as a square SVG for download.
