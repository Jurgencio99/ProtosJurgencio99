# GeoLasso — real data patch for the intercept/strip-log/expiry UI work

All values below are REAL extracted data, ready to paste into `src/App.jsx`.
Provenance: assay intervals are the same ones rendered in `public/drill3d.html`
(extracted from the Carnaby ASX announcement PDFs); permit dates are from the
Queensland open-data EPM shapefile (`expirydate` / `approvedat` fields).

## Headline figure (for the KPI change)

Global best intercept across AOI 1 = **4.2 m @ 8.2% Cu** (hole CBDD017W7, 475-479 m,
0.5 g/t Au). This is the number for the "Best intercept" KPI that replaces "Deepest hole".

## 1. Assay intervals — AOI 1 (Mt Isa)

Add this constant near the MTISA data block. Keyed by HoleID. `from`/`to` are
downhole metres, `width` m, `cu` = % Cu, `au` = g/t Au. All 18 holes have intervals.
`best` = highest-grade interval in that hole. AOI 2 (North belt) has NO assays
(0 collars) — guard for `ASSAYS_MTISA[hole]` being undefined elsewhere.

```js
const ASSAYS_MTISA = {
  "CBDD017W2": { td:718, src:"03071772.pdf", best:{from:585,to:593,width:8.0,cu:2.4,au:2.9}, intervals:[{from:585,to:593,width:8.0,cu:2.4,au:2.9},{from:606,to:618,width:12.4,cu:0.5,au:0.1}] },
  "CBDD017W3": { td:694, src:"03071772.pdf", best:{from:605,to:614,width:8.7,cu:1.0,au:0.1}, intervals:[{from:605,to:614,width:8.7,cu:1.0,au:0.1}] },
  "CBDD017W5": { td:594, src:"03071772.pdf", best:{from:485,to:493,width:8.1,cu:8.0,au:2.2}, intervals:[{from:485,to:493,width:8.1,cu:8.0,au:2.2}] },
  "CBDD017W7": { td:550, src:"03071772.pdf", best:{from:475,to:479,width:4.2,cu:8.2,au:0.5}, intervals:[{from:475,to:479,width:4.2,cu:8.2,au:0.5}] },
  "CBDD058": { td:72, src:"03055699.pdf", best:{from:2,to:42,width:40.5,cu:0.5,au:0.2}, intervals:[{from:2,to:42,width:40.5,cu:0.5,au:0.2}] },
  "CBRC034": { td:250, src:"03055699.pdf", best:{from:205,to:220,width:15.0,cu:0.9,au:0.1}, intervals:[{from:205,to:220,width:15.0,cu:0.9,au:0.1}] },
  "CBRC037": { td:474, src:"03063808.pdf", best:{from:375,to:379,width:4.0,cu:0.4,au:0.1}, intervals:[{from:366,to:368,width:2.0,cu:0.4,au:0.1},{from:375,to:379,width:4.0,cu:0.4,au:0.1}] },
  "CBRC053": { td:396, src:"03063808.pdf", best:{from:218,to:239,width:21.0,cu:0.8,au:0.1}, intervals:[{from:209,to:211,width:2.0,cu:0.6,au:0.2},{from:218,to:239,width:21.0,cu:0.8,au:0.1},{from:345,to:378,width:33.0,cu:0.4,au:0.1}] },
  "CBRC055": { td:50, src:"03055699.pdf", best:{from:35,to:42,width:7.0,cu:7.0,au:2.3}, intervals:[{from:1,to:20,width:19.0,cu:0.6,au:1.0},{from:35,to:42,width:7.0,cu:7.0,au:2.3}] },
  "CBRC056": { td:65, src:"03055699.pdf", best:{from:25,to:59,width:34.0,cu:1.8,au:0.6}, intervals:[{from:25,to:59,width:34.0,cu:1.8,au:0.6}] },
  "CBRC057": { td:78, src:"03055699.pdf", best:{from:7,to:78,width:71.0,cu:1.0,au:0.1}, intervals:[{from:7,to:78,width:71.0,cu:1.0,au:0.1}] },
  "CBRC059": { td:188, src:"03063808.pdf", best:{from:163,to:170,width:7.0,cu:0.5,au:0.1}, intervals:[{from:89,to:110,width:21.0,cu:0.4,au:0.05},{from:163,to:170,width:7.0,cu:0.5,au:0.1}] },
  "CBRC060": { td:222, src:"03063808.pdf", best:{from:125,to:135,width:10.0,cu:0.4,au:0.1}, intervals:[{from:125,to:135,width:10.0,cu:0.4,au:0.1},{from:168,to:203,width:35.0,cu:0.3,au:0.1}] },
  "CBRC061": { td:161, src:"03055699.pdf", best:{from:104,to:137,width:33.0,cu:0.6,au:0.2}, intervals:[{from:104,to:137,width:33.0,cu:0.6,au:0.2}] },
  "CBRC062": { td:168, src:"03055699.pdf", best:{from:77,to:105,width:28.0,cu:0.2,au:0.04}, intervals:[{from:77,to:105,width:28.0,cu:0.2,au:0.04}] },
  "CBRC063": { td:192, src:"03063808.pdf", best:{from:70,to:73,width:3.0,cu:3.5,au:0.2}, intervals:[{from:52,to:54,width:2.0,cu:0.9,au:0.1},{from:70,to:73,width:3.0,cu:3.5,au:0.2},{from:105,to:140,width:35.0,cu:2.3,au:0.6},{from:162,to:186,width:24.0,cu:0.5,au:0.1}] },
  "CBRC064": { td:128, src:"03063808.pdf", best:{from:83,to:87,width:4.0,cu:1.1,au:0.1}, intervals:[{from:83,to:87,width:4.0,cu:1.1,au:0.1}] },
  "CBRC067": { td:330, src:"03063808.pdf", best:{from:250,to:253,width:3.0,cu:1.3,au:0.4}, intervals:[{from:159,to:175,width:16.0,cu:0.8,au:0.04},{from:186,to:197,width:11.0,cu:1.1,au:0.6},{from:250,to:253,width:3.0,cu:1.3,au:0.4}] },
};
```

## 2. Permit dates — add `approved` and `expiry` to each tenement object

Real dates from the shapefile. Add two fields to every entry in MTISA.tenements
and NORTHBELT.tenements (match by permit). Only EPM 27861 is near expiry
(~4 months from June 2026); the rest are 2027-2030.

| Permit | approved | expiry | (AOI) |
|---|---|---|---|
| EPM 11919 | 2003-07-16 | 2030-07-15 | 2 North belt |
| EPM 14019 | 2003-07-18 | 2027-07-17 | 2 North belt |
| EPM 18980 | 2014-02-11 | 2029-02-10 | 1 Mt Isa |
| EPM 19483 | 2014-03-11 | 2028-03-10 | 1 Mt Isa |
| EPM 25435 | 2014-09-03 | 2029-09-02 | 1 Mt Isa |
| EPM 26694 | 2018-12-13 | 2028-12-12 | 2 North belt |
| EPM 26775 | 2018-11-16 | 2028-11-15 | 2 North belt |
| EPM 26776 | 2018-11-16 | 2028-11-15 | 2 North belt |
| EPM 26777 | 2018-11-16 | 2028-11-15 | 1 Mt Isa |
| EPM 26904 | 2019-04-30 | 2029-04-29 | 2 North belt |
| EPM 27470 | 2020-11-12 | 2030-11-11 | 2 North belt |
| EPM 27861 | 2021-10-05 | 2026-10-04 | 1 Mt Isa |

## 3. Notes for implementation

- **Expiry badge**: compute days-to-expiry against today. Show a badge only when
  it's within, say, 180 days (so only EPM 27861 lights up here — realistic, not
  noisy). For dates already past on a Granted permit, show "renewal due" rather
  than "expired" — Queensland EPMs stay granted through renewal; the shapefile is
  a snapshot, so don't assert a permit is dead.
- **Best-intercept KPI / sort**: "best" = highest Cu%. Use the per-hole `best`
  field; the global headline is CBDD017W7 4.2 m @ 8.2% Cu.
- **Strip log**: each hole = grey bar from 0 to `td` (downhole, hanging down),
  with coloured segments at each interval's from-to, coloured by Cu using the SAME
  thresholds as drill3d.html (>=4% red #DC2626, 1-4% amber #F59E0B, <1% teal
  #14B8A6) so the 2D and 3D views match.
- **Commodity filter**: it can now be made real for AOI 1 (filter holes/intervals
  by whether they carry Cu/Au). For AOI 2 there are no assays, so keep the honest
  empty/preview treatment there.
