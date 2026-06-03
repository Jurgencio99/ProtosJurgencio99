# GeoLasso — spatial exploration intelligence (prototype)

Draw an area of interest and get back the exploration tenements that intersect it, the
ASX-listed companies behind them, and model-ready drill-hole data extracted from public
announcements — each row traceable to its source document.

This is an interactive prototype for the mining-exploration sector, built on Queensland
open data. It demonstrates the workflow end to end on **two real query results**.

## What it shows

- **Area & tenements** — a plan view of the area of interest with the real permit
  footprints, the holders that own them, and (where available) the drill collars found
  inside. A regional / drill-detail toggle lets you move between the 5 km area view and a
  close-up of the drilling.
- **Drill data** — the extracted collar table (HoleID, easting, northing, total depth) with
  the source PDF on every row, plus CSV / GeoJSON / GeoPackage export for hand-off to a 3D
  modelling package.
- **Provenance & QA** — the trust surface: which holders resolved to which listed entities,
  how many collars were parsed per company, and what is flagged for a geologist to verify.

## The two saved areas

Both are genuine output from the GeoLasso query pipeline run against the Queensland
exploration-permit layer (2,621 permits; GDA94 / MGA Zone 54).

- **Mt Isa** — the original run: 5 tenements, 3 listed companies, 18 drill collars
  extracted from real ASX announcement PDFs.
- **North belt** — a fresh run on a new area 58 km north: 7 tenements, with the
  holder→listed resolution generalising across six permits to Hammer Metals, one holder
  flagged as unmapped, and no drill data because the announcement corpus was not loaded for
  that run. It is the "does it generalise?" check — the spatial and corporate layers work
  statewide; extraction coverage is the frontier.

## Run locally

```bash
npm install
npm run dev      # open the printed localhost URL
npm run build    # production build into dist/
```

## Stack

React + Vite, with `recharts` and `lucide-react`. The plan view is hand-drawn SVG (no map
dependency); styling is self-contained.

## Notes

- The commodity and date filters in the toolbar are previews — the prototype's drill data
  carries no per-hole commodity or date.
- Tenement polygons are the true permit footprints from the open-data shapefile.
- GeoLasso indexes and extracts the public record; it does not re-host source documents.

---

A Civitta sales asset. Prototype only — not production.
