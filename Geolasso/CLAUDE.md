# CLAUDE.md — GeoLasso prototype

Standing context for Claude Code. Read this before editing. The goal of this file is to
stop well-meaning changes that would quietly turn a *truthful sales/verification asset*
into a misleading one.

## What this is

A single-file React prototype (`src/App.jsx`) of **GeoLasso**, a spatial
exploration-intelligence tool for the mining sector. It is a **sales / design-partner
demo and an internal verification asset** — NOT the product, and NOT a research notebook.
Beachhead: Queensland / ASX-listed explorers.

The core job it demonstrates: draw an area of interest → get the mineral exploration
tenements (EPMs) that intersect it, resolve each tenement holder to its ASX-listed parent,
and surface model-ready drill-hole collar data extracted from ASX announcement PDFs — all
with provenance back to the source document. The defensible moat is the
**extraction + entity-resolution + provenance layer**, NOT the map. Queensland's free
GeoResGlobe already does spatial queries; S&P Global owns the top-end company-data market.
Any change that makes "the map" look like the product works against the pitch.

## Stack / build

- React + Vite, single-file app in `src/App.jsx`. Libraries: `recharts`, `lucide-react`.
- No Tailwind, no CSS framework — styling is an inlined `<style>` block (Civitta palette:
  cream/navy/terracotta; Fraunces display + Geist body). No map library; the plan view is
  hand-plotted SVG.
- **3D drill view**: `public/drill3d.html` — a self-contained Three.js file embedded via
  `<iframe src="/drill3d.html">` in the "3D drill view" nav tab (AOI 1 / Mt Isa only;
  shows empty state for AOI 2). Three.js is intentionally NOT imported into the React
  bundle — it lives solely inside the standalone HTML file. Basemap defaults to "off" so
  the demo never depends on a third-party tile server at load; photo/map options remain
  available in the HUD for those who want them.
- Desktop-only layout by design.
- `npm run dev` to preview, `npm run build` to produce `dist/`.

## Deploy (do NOT auto-run account-touching steps)

- Repo: `Jurgencio99/ProtosJurgencio99` on GitHub. This app lives in the **`Geolasso/`**
  subfolder of that repo (the repo is a container for several projects).
- Git identity for this repo is **Jurgencio99** (set locally, not global). If you make
  commits, confirm the author is Jurgencio99, not `jurgencio` (a different account).
- Vercel deploys from the repo with **Root Directory = `Geolasso`**. Every push to `main`
  auto-deploys. Custom domain: a `*.protohub.io` subdomain via Zone.ee CNAME.
- Do not create repos, push force, change DNS, or alter Vercel settings without the user
  explicitly asking — these hit their accounts directly.

## DATA PROVENANCE — the rules that matter most

Both saved areas in the app are **REAL pipeline output** from `geolasso_query.py` run
against the Queensland open-data EPM shapefile (2,621 permits, CRS EPSG:28354 / GDA94 MGA
Zone 54). Treat the embedded data as ground truth. Do not "improve" it by inventing values.

- **AOI 1 — "Mt Isa"**: the original proof-of-concept run. Centre (385857, 7623831),
  5 km radius. 5 tenements, 3 listed companies (Carnaby Resources / C29 Metals /
  Hammer Metals), 18 drill collars extracted from real ASX announcement PDFs.
  `ASSAYS_MTISA` in `App.jsx` carries real per-hole assay intervals (Cu% / Au g/t),
  sourced from the same ASX announcements as the 3D view — confirmed pipeline output.
  Best intercept: CBDD017W7 4.2 m @ 8.2% Cu. All tenements carry real `approved` /
  `expiry` dates from the QLD shapefile. The **Drill view** is intercept-first: table
  is sorted by best Cu% descending; easting/northing live only in the CSV export.
  The **3D view** (`public/drill3d.html`) has the same assay intervals plus downhole
  survey traces.
- **AOI 2 — "North belt"**: a genuine *fresh* run on a new area 58 km north
  (394300, 7681000, 5 km). 7 tenements; 6 held by "MT. DOCKERELL MINING PTY LTD" all
  resolve to Hammer Metals (the holder→listed map generalising to permits never seen);
  1 holder (Mulga Minerals Pty Ltd) is **deliberately left unresolved/flagged**; **0
  collars** because the PDF corpus was not loaded for that run. The 0 is the *point* — it
  isolates extraction coverage as the frontier. Do not "fix" it by adding fake collars.
  All 7 tenements carry real `approved`/`expiry` dates from the shapefile; no assays exist.
- **Tenement polygons** are the real footprints from the QLD shapefile, reprojected to
  MGA94 metres and expressed as offsets from each AOI centre. They are blocky (sub-block
  graticule) on purpose — that is the true geometry, not a rendering bug. Do not simplify
  in degree-space (a 1.0 tolerance there = ~111 km and shreds them into triangles).
- **Entity colours**: Carnaby = teal (`--accent-cool`), C29 = marigold (`--accent-warm`),
  Hammer = terracotta (`--accent`), unresolved/unmapped = grey (`#9AA3AF`). Keep consistent.

## Things that are intentionally the way they are — do not "helpfully" change

- **Commodity (Cu/Au/Co) and date filters are marked "preview" — not active filters.** The
  toolbar filters are deliberately disabled, badged "Preview", and explained by a muted helper
  line + tooltip. Do NOT re-enable them without a real per-hole filter back-end. Note:
  `ASSAYS_MTISA` in `App.jsx` DOES have real Cu%/Au g/t intervals for AOI 1, but they power
  the intercept table and KPI — not the toolbar filters. In a verification tool a control
  that fakes interactivity is a liability.
- **Drill view is intercept-first for AOI 1.** The intercept table sorts by best Cu% descending.
  Easting/Northing are deliberately not shown in the table (they live in the CSV export). The
  Cu-grade colouring uses three thresholds matching `drill3d.html`: ≥4% #DC2626, 1–4% #F59E0B,
  <1% #14B8A6. Do not change these or add per-hole coordinates back to the table.
- **Expiry badge** is shown only when a permit's expiry is ≤ 180 days out (currently EPM 27861
  only, ~Oct 2026). For Granted permits already past their date use "renewal due" not "expired"
  — QLD EPMs stay granted through renewal; the shapefile is a snapshot.
- **Insight callouts are hand-authored narrative** grounded in the real data (e.g. the
  "Carnaby's holes straddle two other holders' permits" finding is verified by a real
  point-in-polygon test). They are flagged in code comments. If you change the data, update
  or recompute these — do not leave a caption asserting something the data no longer shows.
  A good improvement is to *derive* them from an in-app point-in-polygon test rather than
  hardcoding, but only if it stays faithful to the verified finding.
- The verification framing ("we do ~90%, you check the flagged rest") is core to the value
  prop. Keep provenance, source-PDF tags, and the "flag, don't silently drop" behaviour.

## Open improvements (good Claude Code tasks)

1. ~~Resolve the decorative commodity/date filters honestly.~~ DONE — disabled and marked
   "preview". Next: wire them to a real per-hole commodity/date source (AOI 1 now has
   `ASSAYS_MTISA` Cu%/Au g/t, so Cu/Au filters could be enabled for Mt Isa; AOI 2 has no
   assays so they stay preview there).
2. Derive the insight captions from the actual point-in-polygon computation instead of
   hardcoded strings, so they survive data changes.
3. OPTIONAL geographic basemap: add a MapLibre GL JS view (no API token, vector tiles) as a
   *toggle alongside* the existing clean SVG schematic — NOT a replacement. The controlled
   schematic is what makes the verification view trustworthy; keep it.
4. Responsive / mobile handling (currently desktop-only).
5. Keep the README current.

## Hard "don't"s

- Don't invent drill data, commodities, dates, assays, or resolve "Mulga Minerals" to a
  fake listed entity.
- Don't reproduce or re-host source announcement PDFs; GeoLasso indexes/extracts the public
  record, it does not re-host it.
- Don't make the map look like the product.
