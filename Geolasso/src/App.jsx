/*
 * GeoLasso — Spatial Exploration Intelligence (cockpit prototype)
 * Target: junior / mid-cap ASX explorers' in-house geologists; consultants as channel
 * Concept: draw an area -> tenements + listed holders + model-ready drill data, with provenance
 * Sales context: design-partner demo. Beachhead = Queensland / ASX.
 *
 * DATA NOTE: both saved areas are REAL pipeline output.
 *  - "Mt Isa" is the original PoC run: 5 tenements, 3 listed companies, 18 extracted collars.
 *  - "North belt" is a FRESH run of geolasso_query.py on a new AOI 58 km north
 *    (394300, 7681000, MGA94 z54, 5 km): 7 tenements, holder->listed resolution
 *    generalises (Mt. Dockerell -> Hammer Metals across 6 permits), 1 holder flagged
 *    unresolved (Mulga Minerals), 0 collars because the PDF corpus was not loaded for
 *    that run. This second area is the "does it generalise?" evidence: the spatial +
 *    entity layers work statewide on 2,621 permits; extraction coverage is the frontier.
 * Tenement polygons are the real footprints from the QLD open-data shapefile.
 * Insight callouts are hand-authored narrative grounded in the real data (flagged inline).
 */
import React, { useState, useMemo, useEffect } from "react";
import {
  Map, Layers, Crosshair, MapPin, Building2, FileText, Download, Database,
  CheckCircle2, AlertTriangle, ShieldCheck, Search, Target, Gauge, Activity,
  Filter, ArrowUpRight, Inbox, Box, X,
} from "lucide-react";

/* ─────────────────────────────── shared styling for entities ─────────────────────────────── */
const STYLE = {
  "Carnaby Resources": { color: "var(--accent-cool)", ticker: "ASX:CNB" },
  "C29 Metals": { color: "var(--accent-warm)", ticker: "ASX:C29" },
  "Hammer Metals": { color: "var(--accent)", ticker: "ASX:HMX" },
};
const UNRESOLVED = "#9AA3AF";
const colorFor = (listed) => (listed && STYLE[listed] ? STYLE[listed].color : UNRESOLVED);
const tickerFor = (listed) => (listed && STYLE[listed] ? STYLE[listed].ticker : "unlisted / unmapped");

/* ─────────────────────────────── AREA 1: Mt Isa (original PoC) ─────────────────────────────── */
const MTISA = {
  id: "mtisa", name: "Mt Isa demo AOI", region: "NW Queensland (Mt Isa)",
  provenance: "Original PoC run · full pipeline (spatial + resolution + extraction)",
  aoi: { east: 385857, north: 7623831, zone: "MGA94 z54", radius: 5000 },
  tenements: [
    { permit: "EPM 26777", status: "Granted", holder: "MT. DOCKERELL MINING PTY LTD", listed: "Hammer Metals", dist: 0,    approved: "2018-11-16", expiry: "2028-11-15" },
    { permit: "EPM 19483", status: "Granted", holder: "C29 METALS LIMITED", listed: "C29 Metals", dist: 291,              approved: "2014-03-11", expiry: "2028-03-10" },
    { permit: "EPM 27861", status: "Granted", holder: "MT. DOCKERELL MINING PTY LTD", listed: "Hammer Metals", dist: 3144, approved: "2021-10-05", expiry: "2026-10-04" },
    { permit: "EPM 18980", status: "Granted", holder: "CARNABY RESOURCES (HOLDINGS) PTY LTD", listed: "Carnaby Resources", dist: 3763, approved: "2014-02-11", expiry: "2029-02-10" },
    { permit: "EPM 25435", status: "Granted", holder: "CARNABY RESOURCES (HOLDINGS) PTY LTD", listed: "Carnaby Resources", dist: 3801, approved: "2014-09-03", expiry: "2029-09-02" },
  ],
  collars: [
    { hole: "CBDD017W2", e: 385857, n: 7623831, depth: 718, co: "Carnaby Resources", src: "03071772_PA_koordinaatidega.pdf" },
    { hole: "CBDD017W3", e: 385857, n: 7623831, depth: 694, co: "Carnaby Resources", src: "03071772_PA_koordinaatidega.pdf" },
    { hole: "CBDD017W5", e: 385857, n: 7623831, depth: 594, co: "Carnaby Resources", src: "03071772_PA_koordinaatidega.pdf" },
    { hole: "CBDD017W7", e: 385857, n: 7623831, depth: 550, co: "Carnaby Resources", src: "03071772_PA_koordinaatidega.pdf" },
    { hole: "CBDD058", e: 386090, n: 7623991, depth: 72, co: "Carnaby Resources", src: "03055699_PA_koordinaatidega.pdf" },
    { hole: "CBRC034", e: 385989, n: 7623738, depth: 250, co: "Carnaby Resources", src: "03055699_PA_koordinaatidega.pdf" },
    { hole: "CBRC037", e: 385872, n: 7623729, depth: 474, co: "Carnaby Resources", src: "03063808_PA_koordinaatidega.pdf" },
    { hole: "CBRC053", e: 385971, n: 7623951, depth: 396, co: "Carnaby Resources", src: "03063808_PA_koordinaatidega.pdf" },
    { hole: "CBRC055", e: 386138, n: 7623843, depth: 50, co: "Carnaby Resources", src: "03055699_PA_koordinaatidega.pdf" },
    { hole: "CBRC056", e: 386104, n: 7623904, depth: 65, co: "Carnaby Resources", src: "03055699_PA_koordinaatidega.pdf" },
    { hole: "CBRC057", e: 386100, n: 7623943, depth: 78, co: "Carnaby Resources", src: "03055699_PA_koordinaatidega.pdf" },
    { hole: "CBRC059", e: 385930, n: 7624794, depth: 188, co: "Carnaby Resources", src: "03063808_PA_koordinaatidega.pdf" },
    { hole: "CBRC060", e: 385934, n: 7624794, depth: 222, co: "Carnaby Resources", src: "03063808_PA_koordinaatidega.pdf" },
    { hole: "CBRC061", e: 385938, n: 7624797, depth: 161, co: "Carnaby Resources", src: "03055699_PA_koordinaatidega.pdf" },
    { hole: "CBRC062", e: 385948, n: 7624801, depth: 168, co: "Carnaby Resources", src: "03055699_PA_koordinaatidega.pdf" },
    { hole: "CBRC063", e: 385964, n: 7624841, depth: 192, co: "Carnaby Resources", src: "03063808_PA_koordinaatidega.pdf" },
    { hole: "CBRC064", e: 385964, n: 7624842, depth: 128, co: "Carnaby Resources", src: "03063808_PA_koordinaatidega.pdf" },
    { hole: "CBRC067", e: 385978, n: 7623950, depth: 330, co: "Carnaby Resources", src: "03063808_PA_koordinaatidega.pdf" },
  ],
  resolution: [
    { holder: "C29 METALS LIMITED", listed: "C29 Metals" },
    { holder: "CARNABY RESOURCES (HOLDINGS) PTY LTD", listed: "Carnaby Resources" },
    { holder: "MT. DOCKERELL MINING PTY LTD", listed: "Hammer Metals" },
  ],
  coverage: [
    { name: "Carnaby Resources", pdfs: 10, collars: 18 },
    { name: "C29 Metals", pdfs: 2, collars: 0 },
    { name: "Hammer Metals", pdfs: 8, collars: 0 },
  ],
  geom: [{"permit":"EPM 26777","listed":"Hammer Metals","dist":0,"rings":[[[-6859,35296],[-5128,35308],[-3398,35321],[-1667,35333],[63,35345],[76,33500],[89,31656],[-1641,31643],[-1628,29799],[102,29811],[1831,29823],[1844,27978],[3574,27990],[5303,28001],[5316,26156],[5328,24312],[7057,24323],[8786,24334],[8798,22489],[7069,22478],[7081,20633],[7093,18788],[7106,16944],[5377,16932],[5365,18777],[5352,20622],[5340,22467],[3611,22455],[3624,20610],[3636,18765],[3649,16921],[3661,15076],[3674,13231],[3686,11386],[1958,11374],[1971,9529],[243,9517],[256,7672],[1984,7684],[1996,5840],[2009,3995],[282,3983],[269,5828],[-1458,5815],[-1471,7660],[-1485,9505],[-1498,11350],[-1511,13195],[-1524,15040],[204,15052],[192,16897],[1920,16909],[1907,18754],[179,18742],[166,20586],[153,22431],[-1576,22419],[-1563,20574],[-3292,20562],[-3279,18717],[-5008,18705],[-5021,20549],[-5035,22394],[-6764,22382],[-6777,24227],[-5048,24239],[-5061,26084],[-5075,27929],[-6804,27916],[-6818,29761],[-6832,31606],[-6845,33451],[-6859,35296]],[[-3105,-5266],[-1379,-5254],[347,-5242],[360,-7087],[2086,-7075],[2099,-8919],[2111,-10764],[386,-10776],[373,-8932],[-1353,-8944],[-1340,-10789],[-3065,-10801],[-3079,-8956],[-3092,-7111],[-3105,-5266]],[[5525,-5206],[7251,-5195],[7264,-7039],[7276,-8884],[7288,-10729],[7300,-12574],[7313,-14419],[7325,-16264],[7337,-18109],[5612,-18120],[5600,-16275],[5587,-14431],[5575,-12586],[5563,-10741],[5550,-8896],[5538,-7051],[5525,-5206]],[[-10166,14976],[-8437,14989],[-8451,16834],[-6723,16847],[-6709,15002],[-6695,13157],[-8423,13144],[-8409,11299],[-6681,11312],[-6668,9467],[-8396,9455],[-10123,9441],[-10137,11286],[-10151,13131],[-10166,14976]],[[8739,31713],[10469,31724],[10481,29880],[10492,28035],[12222,28046],[13952,28056],[13963,26212],[12233,26201],[10504,26190],[8775,26179],[8763,28024],[8751,29869],[8739,31713]],[[1768,39047],[3499,39058],[3512,37214],[3524,35369],[3536,33524],[3549,31679],[1819,31667],[1806,33512],[1794,35357],[1781,37202],[1768,39047]],[[-3159,2113],[-3172,3958],[-1445,3971],[-1432,2126],[-1419,281],[308,293],[321,-1552],[-1406,-1564],[-3132,-1577],[-3146,268],[-3159,2113]],[[12165,37270],[13895,37280],[13907,35435],[13918,33591],[13929,31746],[12199,31735],[12188,33580],[12176,35425],[12165,37270]],[[-10334,37115],[-8603,37128],[-8589,35283],[-8576,33438],[-8562,31593],[-10292,31580],[-10306,33425],[-10320,35270],[-10334,37115]],[[-1340,-10789],[386,-10776],[399,-12621],[412,-14466],[-1313,-14479],[-1326,-12634],[-1340,-10789]],[[3774,-1528],[5500,-1516],[5513,-3361],[5525,-5206],[3799,-5218],[3787,-3373],[3774,-1528]],[[2111,-10764],[3837,-10752],[3850,-12597],[2124,-12609],[2111,-10764]],[[-4845,-3434],[-3119,-3422],[-3105,-5266],[-4832,-5279],[-4845,-3434]],[[2022,2150],[3749,2162],[3761,317],[2035,305],[2022,2150]],[[412,-14466],[2137,-14454],[2150,-16299],[425,-16311],[412,-14466]],[[-1287,-18168],[438,-18156],[451,-20001],[-1273,-20013],[-1287,-18168]],[[-10222,22356],[-8493,22369],[-8479,20524],[-10208,20511],[-10222,22356]]]},{"permit":"EPM 19483","listed":"C29 Metals","dist":291,"rings":[[[-1445,3971],[282,3983],[2009,3995],[1996,5840],[3724,5851],[3736,4007],[3749,2162],[2022,2150],[2035,305],[3761,317],[3774,-1528],[3787,-3373],[3799,-5218],[5525,-5206],[5538,-7051],[5550,-8896],[5563,-10741],[5575,-12586],[5587,-14431],[5600,-16275],[3875,-16287],[2150,-16299],[2137,-14454],[3862,-14442],[3850,-12597],[3837,-10752],[2111,-10764],[2099,-8919],[2086,-7075],[360,-7087],[347,-5242],[-1379,-5254],[-3105,-5266],[-3119,-3422],[-3132,-1577],[-1406,-1564],[321,-1552],[308,293],[-1419,281],[-1432,2126],[-1445,3971]],[[-1353,-8944],[373,-8932],[386,-10776],[-1340,-10789],[-1353,-8944]]]},{"permit":"EPM 27861","listed":"Hammer Metals","dist":3144,"rings":[[[-10053,217],[-8326,230],[-6599,243],[-4872,256],[-3146,268],[-3132,-1577],[-3119,-3422],[-4845,-3434],[-4832,-5279],[-6558,-5292],[-6572,-3447],[-8298,-3460],[-10024,-3473],[-10038,-1628],[-10053,217]],[[-11851,9428],[-10123,9441],[-10109,7597],[-8382,7610],[-8368,5765],[-8354,3920],[-10081,3907],[-10067,2062],[-10053,217],[-11779,203],[-11794,2048],[-11808,3893],[-11822,5738],[-11837,7583],[-11851,9428]],[[-3052,-12646],[-3065,-10801],[-1340,-10789],[-1326,-12634],[-1313,-14479],[-3038,-14491],[-3052,-12646]],[[-4818,-7124],[-4832,-5279],[-3105,-5266],[-3092,-7111],[-4818,-7124]],[[243,9517],[1971,9529],[1984,7684],[256,7672],[243,9517]],[[3724,5851],[5451,5863],[5463,4018],[3736,4007],[3724,5851]],[[-1458,5815],[269,5828],[282,3983],[-1445,3971],[-1458,5815]]]},{"permit":"EPM 18980","listed":"Carnaby Resources","dist":3763,"rings":[[[3736,4007],[5463,4018],[5476,2173],[7203,2185],[7215,340],[7227,-1505],[7239,-3350],[5513,-3361],[5500,-1516],[3774,-1528],[3761,317],[3749,2162],[3736,4007]]]},{"permit":"EPM 25435","listed":"Carnaby Resources","dist":3801,"rings":[[[-8354,3920],[-6627,3933],[-6640,5778],[-4913,5790],[-4899,3946],[-3172,3958],[-3159,2113],[-4886,2101],[-4872,256],[-6599,243],[-6613,2088],[-8340,2075],[-8354,3920]],[[-3199,7648],[-1471,7660],[-1458,5815],[-3186,5803],[-3199,7648]],[[-4954,11325],[-3226,11338],[-3212,9493],[-4940,9480],[-4954,11325]],[[-3292,20562],[-1563,20574],[-1550,18729],[-3279,18717],[-3292,20562]],[[-8423,13144],[-6695,13157],[-6681,11312],[-8409,11299],[-8423,13144]],[[-10123,9441],[-8396,9455],[-6668,9467],[-6654,7623],[-8382,7610],[-10109,7597],[-10123,9441]],[[-6736,18692],[-5008,18705],[-4994,16860],[-6723,16847],[-6736,18692]],[[-10194,18666],[-8465,18679],[-8451,16834],[-8437,14989],[-10166,14976],[-10180,16821],[-10194,18666]]]}],
};

/* ─────────────────────────────── Assay intervals — AOI 1 (Mt Isa only) ─────────────────────────────── */
const ASSAYS_MTISA = {
  "CBDD017W2": { td:718, src:"03071772.pdf", best:{from:585,to:593,width:8.0,cu:2.4,au:2.9}, intervals:[{from:585,to:593,width:8.0,cu:2.4,au:2.9},{from:606,to:618,width:12.4,cu:0.5,au:0.1}] },
  "CBDD017W3": { td:694, src:"03071772.pdf", best:{from:605,to:614,width:8.7,cu:1.0,au:0.1}, intervals:[{from:605,to:614,width:8.7,cu:1.0,au:0.1}] },
  "CBDD017W5": { td:594, src:"03071772.pdf", best:{from:485,to:493,width:8.1,cu:8.0,au:2.2}, intervals:[{from:485,to:493,width:8.1,cu:8.0,au:2.2}] },
  "CBDD017W7": { td:550, src:"03071772.pdf", best:{from:475,to:479,width:4.2,cu:8.2,au:0.5}, intervals:[{from:475,to:479,width:4.2,cu:8.2,au:0.5}] },
  "CBDD058":   { td:72,  src:"03055699.pdf", best:{from:2,to:42,width:40.5,cu:0.5,au:0.2}, intervals:[{from:2,to:42,width:40.5,cu:0.5,au:0.2}] },
  "CBRC034":   { td:250, src:"03055699.pdf", best:{from:205,to:220,width:15.0,cu:0.9,au:0.1}, intervals:[{from:205,to:220,width:15.0,cu:0.9,au:0.1}] },
  "CBRC037":   { td:474, src:"03063808.pdf", best:{from:375,to:379,width:4.0,cu:0.4,au:0.1}, intervals:[{from:366,to:368,width:2.0,cu:0.4,au:0.1},{from:375,to:379,width:4.0,cu:0.4,au:0.1}] },
  "CBRC053":   { td:396, src:"03063808.pdf", best:{from:218,to:239,width:21.0,cu:0.8,au:0.1}, intervals:[{from:209,to:211,width:2.0,cu:0.6,au:0.2},{from:218,to:239,width:21.0,cu:0.8,au:0.1},{from:345,to:378,width:33.0,cu:0.4,au:0.1}] },
  "CBRC055":   { td:50,  src:"03055699.pdf", best:{from:35,to:42,width:7.0,cu:7.0,au:2.3}, intervals:[{from:1,to:20,width:19.0,cu:0.6,au:1.0},{from:35,to:42,width:7.0,cu:7.0,au:2.3}] },
  "CBRC056":   { td:65,  src:"03055699.pdf", best:{from:25,to:59,width:34.0,cu:1.8,au:0.6}, intervals:[{from:25,to:59,width:34.0,cu:1.8,au:0.6}] },
  "CBRC057":   { td:78,  src:"03055699.pdf", best:{from:7,to:78,width:71.0,cu:1.0,au:0.1}, intervals:[{from:7,to:78,width:71.0,cu:1.0,au:0.1}] },
  "CBRC059":   { td:188, src:"03063808.pdf", best:{from:163,to:170,width:7.0,cu:0.5,au:0.1}, intervals:[{from:89,to:110,width:21.0,cu:0.4,au:0.05},{from:163,to:170,width:7.0,cu:0.5,au:0.1}] },
  "CBRC060":   { td:222, src:"03063808.pdf", best:{from:125,to:135,width:10.0,cu:0.4,au:0.1}, intervals:[{from:125,to:135,width:10.0,cu:0.4,au:0.1},{from:168,to:203,width:35.0,cu:0.3,au:0.1}] },
  "CBRC061":   { td:161, src:"03055699.pdf", best:{from:104,to:137,width:33.0,cu:0.6,au:0.2}, intervals:[{from:104,to:137,width:33.0,cu:0.6,au:0.2}] },
  "CBRC062":   { td:168, src:"03055699.pdf", best:{from:77,to:105,width:28.0,cu:0.2,au:0.04}, intervals:[{from:77,to:105,width:28.0,cu:0.2,au:0.04}] },
  "CBRC063":   { td:192, src:"03063808.pdf", best:{from:70,to:73,width:3.0,cu:3.5,au:0.2}, intervals:[{from:52,to:54,width:2.0,cu:0.9,au:0.1},{from:70,to:73,width:3.0,cu:3.5,au:0.2},{from:105,to:140,width:35.0,cu:2.3,au:0.6},{from:162,to:186,width:24.0,cu:0.5,au:0.1}] },
  "CBRC064":   { td:128, src:"03063808.pdf", best:{from:83,to:87,width:4.0,cu:1.1,au:0.1}, intervals:[{from:83,to:87,width:4.0,cu:1.1,au:0.1}] },
  "CBRC067":   { td:330, src:"03063808.pdf", best:{from:250,to:253,width:3.0,cu:1.3,au:0.4}, intervals:[{from:159,to:175,width:16.0,cu:0.8,au:0.04},{from:186,to:197,width:11.0,cu:1.1,au:0.6},{from:250,to:253,width:3.0,cu:1.3,au:0.4}] },
};

/* ─────────────────────────────── AREA 2: North belt (fresh run) ─────────────────────────────── */
const NORTHBELT = {
  id: "northbelt", name: "North belt (fresh run)", region: "NW Queensland · 58 km N of Mt Isa",
  provenance: "Live fresh run · spatial + entity resolution on the full QLD layer (2,621 permits) · extraction corpus not loaded",
  aoi: { east: 394300, north: 7681000, zone: "MGA94 z54", radius: 5000 },
  tenements: [
    { permit: "EPM 26694", status: "Granted", holder: "MT. DOCKERELL MINING PTY LTD", listed: "Hammer Metals", dist: 0,    approved: "2018-12-13", expiry: "2028-12-12" },
    { permit: "EPM 26775", status: "Granted", holder: "MT. DOCKERELL MINING PTY LTD", listed: "Hammer Metals", dist: 134,  approved: "2018-11-16", expiry: "2028-11-15" },
    { permit: "EPM 14019", status: "Granted", holder: "Mulga Minerals Pty Ltd",        listed: null,           dist: 1642, approved: "2003-07-18", expiry: "2027-07-17" },
    { permit: "EPM 27470", status: "Granted", holder: "MT. DOCKERELL MINING PTY LTD", listed: "Hammer Metals", dist: 2378, approved: "2020-11-12", expiry: "2030-11-11" },
    { permit: "EPM 11919", status: "Granted", holder: "MT. DOCKERELL MINING PTY LTD", listed: "Hammer Metals", dist: 2732, approved: "2003-07-16", expiry: "2030-07-15" },
    { permit: "EPM 26776", status: "Granted", holder: "MT. DOCKERELL MINING PTY LTD", listed: "Hammer Metals", dist: 2897, approved: "2018-11-16", expiry: "2028-11-15" },
    { permit: "EPM 26904", status: "Granted", holder: "MT. DOCKERELL MINING PTY LTD", listed: "Hammer Metals", dist: 4060, approved: "2019-04-30", expiry: "2029-04-29" },
  ], collars: [],
  resolution: [
    { holder: "MT. DOCKERELL MINING PTY LTD", listed: "Hammer Metals" },
    { holder: "Mulga Minerals Pty Ltd", listed: null },
  ],
  coverage: [
    { name: "Hammer Metals", pdfs: 0, collars: 0, note: "corpus not loaded this run" },
    { name: "Mulga Minerals Pty Ltd", unresolved: true },
  ],
  geom: [{"permit":"EPM 26694","listed":"Hammer Metals","holder":"MT. DOCKERELL MINING PTY LTD","dist":0,"rings":[[[108,4061],[1841,4072],[1852,2227],[119,2216],[108,4061]],[[-1602,360],[131,371],[143,-1474],[-1590,-1485],[-1602,360]]]},{"permit":"EPM 26775","listed":"Hammer Metals","holder":"MT. DOCKERELL MINING PTY LTD","dist":134,"rings":[[[10464,11502],[12198,11512],[13932,11522],[13942,9677],[12208,9667],[10475,9658],[10464,11502]],[[12167,17046],[13902,17056],[13912,15211],[13922,13366],[12188,13357],[12177,15201],[12167,17046]],[[-8533,314],[-6800,326],[-5067,337],[-3334,349],[-1602,360],[-1613,2205],[-1625,4050],[108,4061],[119,2216],[1852,2227],[3585,2238],[3574,4082],[5307,4093],[5296,5938],[5285,7782],[7018,7793],[8752,7803],[8762,5958],[7029,5948],[7040,4103],[7051,2259],[7062,414],[5329,403],[5340,-1441],[3608,-1452],[1875,-1463],[1887,-3307],[1899,-5152],[166,-5163],[178,-7008],[1910,-6997],[1922,-8842],[190,-8853],[202,-10697],[213,-12542],[-1518,-12553],[-1530,-10709],[-1542,-8864],[-3274,-8875],[-3286,-7030],[-3298,-5185],[-5030,-5197],[-5018,-7042],[-6750,-7053],[-6762,-5209],[-6775,-3364],[-6787,-1519],[-8520,-1531],[-8533,314]],[[1922,-8842],[3653,-8831],[5385,-8820],[5396,-10665],[3665,-10676],[3676,-12520],[3688,-14365],[3699,-16210],[3710,-18055],[3722,-19899],[1991,-19910],[261,-19921],[249,-18076],[237,-16232],[225,-14387],[1956,-14376],[1945,-12531],[1933,-10686],[1922,-8842]],[[108,4061],[96,5905],[1829,5916],[1841,4072],[108,4061]],[[-9,22508],[1726,22519],[1738,20674],[1749,18829],[1760,16985],[1772,15140],[1783,13295],[49,13284],[38,15129],[26,16974],[14,18819],[3,20663],[-9,22508]],[[1783,13295],[3517,13306],[3506,15151],[3495,16995],[5229,17006],[6964,17016],[6953,18861],[8688,18871],[8698,17026],[8709,15182],[6975,15171],[6986,13327],[8720,13337],[8730,11492],[6996,11482],[5263,11472],[3529,11461],[1795,11450],[1783,13295]],[[1795,11450],[1806,9606],[73,9595],[61,11440],[1795,11450]],[[5196,22540],[6931,22550],[6942,20706],[5207,20695],[5196,22540]],[[3619,-3297],[5352,-3286],[5363,-5131],[5374,-6976],[3642,-6986],[3631,-5141],[3619,-3297]],[[-3407,11417],[-1673,11429],[-1661,9584],[-3395,9573],[-3407,11417]],[[-6737,-8898],[-5006,-8887],[-4993,-10731],[-4981,-12576],[-6712,-12588],[-6725,-10743],[-6737,-8898]],[[-6837,5860],[-5104,5872],[-5092,4027],[-6825,4015],[-6837,5860]],[[-8634,15072],[-6899,15084],[-5165,15095],[-5153,13251],[-6887,13239],[-8621,13227],[-8634,15072]],[[-11907,-12624],[-10175,-12612],[-10188,-10767],[-8456,-10755],[-8444,-12600],[-8431,-14445],[-10162,-14457],[-10149,-16301],[-10136,-18146],[-11867,-18159],[-11880,-16314],[-11893,-14469],[-11907,-12624]],[[-13678,-7102],[-11946,-7090],[-11933,-8934],[-11920,-10779],[-13651,-10792],[-13665,-8947],[-13678,-7102]],[[-15369,-12649],[-13638,-12636],[-13625,-14481],[-13611,-16326],[-15342,-16339],[-15356,-14494],[-15369,-12649]]]},{"permit":"EPM 14019","listed":null,"holder":"Mulga Minerals Pty Ltd","dist":1642,"rings":[[[1887,-3307],[3619,-3297],[3631,-5141],[3642,-6986],[3653,-8831],[1922,-8842],[1910,-6997],[1899,-5152],[1887,-3307]],[[-5092,4027],[-3359,4038],[-3346,2194],[-1613,2205],[-1602,360],[-3334,349],[-5067,337],[-5079,2182],[-5092,4027]],[[-15571,15023],[-13837,15036],[-12102,15048],[-12089,13203],[-13823,13191],[-15558,13178],[-15571,15023]]]},{"permit":"EPM 27470","listed":"Hammer Metals","holder":"MT. DOCKERELL MINING PTY LTD","dist":2378,"rings":[[[1875,-1463],[3608,-1452],[5340,-1441],[7073,-1431],[7084,-3276],[7095,-5120],[5363,-5131],[5352,-3286],[3619,-3297],[1887,-3307],[1875,-1463]],[[166,-5163],[1899,-5152],[1910,-6997],[178,-7008],[166,-5163]],[[-6750,-7053],[-5018,-7042],[-5006,-8887],[-6737,-8898],[-6750,-7053]],[[-8380,-21824],[-6649,-21812],[-6637,-23657],[-6624,-25502],[-8354,-25513],[-8367,-23669],[-8380,-21824]]]},{"permit":"EPM 11919","listed":"Hammer Metals","holder":"MT. DOCKERELL MINING PTY LTD","dist":2732,"rings":[[[-1767,26186],[-32,26197],[-20,24353],[-9,22508],[3,20663],[14,18819],[-1720,18807],[-1732,20652],[-1744,22497],[-1756,24342],[-1767,26186]],[[-3371,5883],[-1637,5894],[-1625,4050],[-1613,2205],[-3346,2194],[-3359,4038],[-3371,5883]]]},{"permit":"EPM 26776","listed":"Hammer Metals","holder":"MT. DOCKERELL MINING PTY LTD","dist":2897,"rings":[[[1806,9606],[3540,9616],[5274,9627],[7007,9637],[6996,11482],[8730,11492],[8741,9648],[8752,7803],[7018,7793],[5285,7782],[5296,5938],[5307,4093],[3574,4082],[3585,2238],[1852,2227],[1841,4072],[1829,5916],[1818,7761],[1806,9606]],[[3768,-27279],[5497,-27268],[5509,-29113],[3779,-29123],[3768,-27279]],[[-10227,-5233],[-8495,-5220],[-6762,-5209],[-6750,-7053],[-6737,-8898],[-6725,-10743],[-8456,-10755],[-10188,-10767],[-10201,-8922],[-10214,-7077],[-10227,-5233]]]},{"permit":"EPM 26904","listed":"Hammer Metals","holder":"MT. DOCKERELL MINING PTY LTD","dist":4060,"rings":[[[-1649,7739],[84,7750],[96,5905],[108,4061],[-1625,4050],[-1637,5894],[-1649,7739]]]}],
};

const AREAS = { mtisa: MTISA, northbelt: NORTHBELT };
const distOf = (c, aoi) => Math.round(Math.hypot(c.e - aoi.east, c.n - aoi.north));
const TODAY = new Date("2026-06-06");
const daysToExpiry = (expiryStr) => Math.round((new Date(expiryStr) - TODAY) / 86400000);
const cuColor = (cu) => cu >= 4 ? "#DC2626" : cu >= 1 ? "#F59E0B" : "#14B8A6";

/* ── downhole strip log (2D companion to drill3d.html) — AOI 1 only ──
   holes: [{ hole, co, td, intervals:[{from,to,width,cu,au}] }] sorted best-Cu first.
   Surface at top, depth grows downward; grey bar = full hole, coloured
   segments = assay intervals at true from→to depth, Cu thresholds = drill3d.html. */
function StripLog({ holes }) {
  const PAD_T = 70, PAD_L = 46, PAD_B = 18, PAD_R = 14;
  const COL_W = 32, BAR_W = 4, SEG_W = 15, plotH = 440;
  const maxTD = Math.max(...holes.map((h) => h.td));
  const y = (d) => PAD_T + (d / maxTD) * plotH;
  const width = PAD_L + holes.length * COL_W + PAD_R;
  const height = PAD_T + plotH + PAD_B;
  const ticks = [];
  for (let d = 0; d <= maxTD; d += 100) ticks.push(d);

  return (
    <div style={{ overflowX: "auto" }}>
      <svg width={width} height={height} style={{ display: "block", fontFamily: "Geist Mono" }}>
        {/* depth axis ticks + gridlines */}
        {ticks.map((d) => (
          <g key={d}>
            <line x1={PAD_L} y1={y(d)} x2={width - PAD_R} y2={y(d)}
              stroke="var(--border-soft)" strokeDasharray={d === 0 ? "0" : "2 4"} strokeWidth={d === 0 ? 1.1 : 1} />
            <text x={PAD_L - 8} y={y(d) + 3} textAnchor="end"
              fontSize="9.5" fill="var(--ink-soft)">{d}</text>
          </g>
        ))}
        <text x={PAD_L - 8} y={PAD_T - 12} textAnchor="end" fontSize="9" fill="var(--ink-muted)">depth m</text>

        {holes.map((h, i) => {
          const cx = PAD_L + i * COL_W + COL_W / 2;
          return (
            <g key={h.hole}>
              {/* full hole length */}
              <rect x={cx - BAR_W / 2} y={y(0)} width={BAR_W} height={y(h.td) - y(0)}
                rx="1.5" fill="#C9CCC7" />
              {/* assay intervals */}
              {h.intervals.map((iv, j) => (
                <rect key={j} x={cx - SEG_W / 2} y={y(iv.from)} width={SEG_W}
                  height={Math.max(2, y(iv.to) - y(iv.from))} rx="1.5" fill={cuColor(iv.cu)}>
                  <title>{`${h.hole} · ${iv.width} m @ ${iv.cu}% Cu, ${iv.au} g/t Au\n${iv.from}–${iv.to} m downhole`}</title>
                </rect>
              ))}
              {/* hole label, rotated to avoid overlap */}
              <text x={cx} y={PAD_T - 14} fontSize="9.5" fill="var(--ink-2)"
                textAnchor="start" transform={`rotate(-50 ${cx} ${PAD_T - 14})`}>{h.hole}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── per-hole detail drawer (AOI 1 only) — opened by clicking an intercept-table row ──
   This is the home of the collar coordinates in the UI (kept out of the comparison table
   by design; also in the CSV export). Shows the hole's full picture the summary table
   can't: every interval (not just the best) + a single-column StripLog reused verbatim
   so the Cu thresholds / depth rendering stay identical to the main strip log + 3D view. */
function HoleDrawer({ collar, onClose }) {
  const a = ASSAYS_MTISA[collar.hole];
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <>
      <div className="gl-backdrop" onClick={onClose} />
      <aside className="gl-drawer" role="dialog" aria-label={`Hole ${collar.hole} detail`}>
        <div className="gl-drawer-h">
          <div>
            <div className="mono" style={{ fontSize: 18, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
              <span className="swatch" style={{ background: colorFor(collar.co), width: 11, height: 11 }} />{collar.hole}
            </div>
            <div style={{ fontSize: 11.5, color: "var(--ink-muted)", marginTop: 4 }}>{collar.co} · {tickerFor(collar.co)}</div>
          </div>
          <button className="gl-drawer-x" onClick={onClose} aria-label="Close hole detail"><X size={18} /></button>
        </div>
        <div className="gl-drawer-b">
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12.5, flexWrap: "wrap" }}>
            <span><span style={{ color: "var(--ink-soft)" }}>Total depth </span><span className="mono" style={{ fontWeight: 600 }}>{a.td} m</span></span>
            <span style={{ color: "var(--ink-soft)", display: "inline-flex", alignItems: "center", gap: 5 }}>
              <FileText size={12} /><span className="mono" style={{ color: "var(--ink-muted)" }}>{a.src}</span>
            </span>
          </div>

          <div className="dr-sec">Collar · MGA94 z54 (EPSG:28354)</div>
          <div className="dr-coord">
            <div className="box"><div className="lab">Easting</div><div className="val">{collar.e.toLocaleString()}</div></div>
            <div className="box"><div className="lab">Northing</div><div className="val">{collar.n.toLocaleString()}</div></div>
          </div>

          <div className="dr-sec">Downhole strip log</div>
          <StripLog holes={[{ hole: collar.hole, co: collar.co, td: a.td, intervals: a.intervals }]} />

          <div className="dr-sec">All intervals · {a.intervals.length} logged</div>
          <table>
            <thead><tr><th>From–To</th><th style={{ textAlign: "right" }}>Width</th><th style={{ textAlign: "right" }}>Cu %</th><th style={{ textAlign: "right" }}>Au g/t</th></tr></thead>
            <tbody>
              {a.intervals.map((iv, j) => (
                <tr key={j}>
                  <td className="mono">{iv.from}–{iv.to} m</td>
                  <td className="mono" style={{ textAlign: "right" }}>{iv.width} m</td>
                  <td className="mono" style={{ textAlign: "right", color: cuColor(iv.cu), fontWeight: 600 }}>{iv.cu}</td>
                  <td className="mono" style={{ textAlign: "right", color: "var(--ink-muted)" }}>{iv.au}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </aside>
    </>
  );
}

/* ─────────────────────────────── styles ─────────────────────────────── */
function Styles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap');
      :root{
        --bg:#F4ECE0; --bg-grain:#F0E6D2; --surface:#FBF5EA; --surface-2:#FFFCF6;
        --ink:#1A2B45; --ink-2:#34425C; --ink-muted:#5C6373; --ink-soft:#8B8472;
        --accent:#C75D3C; --accent-warm:#D9A441; --accent-cool:#3F7A6E; --accent-rust:#8B3A2A;
        --neg:#B84A39; --pos:#3F7A6E; --border:#E5D9C3; --border-soft:#EFE5D2;
        --shadow:0 1px 2px rgba(26,43,69,.04),0 4px 12px rgba(26,43,69,.04);
        --shadow-strong:0 2px 4px rgba(26,43,69,.06),0 12px 32px rgba(26,43,69,.08);
      }
      *{box-sizing:border-box}
      .gl-root{font-family:'Geist',sans-serif;color:var(--ink);background:
        radial-gradient(1200px 600px at 18% -8%, var(--bg-grain), transparent 60%),
        radial-gradient(900px 500px at 110% 10%, #EFE7D6, transparent 55%), var(--bg);
        min-height:100vh;display:flex;font-size:14px;-webkit-font-smoothing:antialiased}
      .mono{font-family:'Geist Mono',monospace;font-variant-numeric:tabular-nums}
      .disp{font-family:'Fraunces',serif;font-feature-settings:'ss01';letter-spacing:-.02em}
      .fade{animation:fade .32s ease}
      @keyframes fade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
      .sb{width:236px;flex:0 0 236px;background:var(--surface);border-right:1px solid var(--border);
        display:flex;flex-direction:column;padding:20px 14px;gap:4px;min-height:100vh}
      .sb-brand{display:flex;align-items:center;gap:9px;padding:4px 8px 16px}
      .sb-logo{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,var(--accent-cool),#2f5d54);
        display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:var(--shadow)}
      .sb-name{font-size:17px;font-weight:600}
      .sb-tag{font-size:10.5px;color:var(--ink-soft);letter-spacing:.04em;text-transform:uppercase}
      .sb-sec{font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-soft);padding:14px 8px 6px}
      .nav{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;cursor:pointer;
        color:var(--ink-2);font-weight:500;transition:background .14s,color .14s}
      .nav:hover{background:var(--border-soft)}
      .nav.on{background:var(--ink);color:#fff}
      .nav.on .navsub{color:#C9D2E0}
      .navsub{font-size:11px;color:var(--ink-soft);margin-left:auto}
      .saved{display:flex;flex-direction:column;gap:3px;padding:6px 8px;border-radius:8px;cursor:pointer;transition:.14s;border:1px solid transparent}
      .saved:hover{background:var(--border-soft)}
      .saved.on{background:var(--surface-2);border-color:var(--accent-cool)}
      .saved .nm{display:flex;align-items:center;gap:8px;font-weight:500;font-size:13px}
      .saved .meta{font-size:10.5px;color:var(--ink-soft);margin-left:24px}
      .sb-foot{margin-top:auto;padding:12px 8px 2px;border-top:1px solid var(--border);font-size:11px;color:var(--ink-soft)}
      .main{flex:1;min-width:0;display:flex;flex-direction:column}
      .fstrip{display:flex;align-items:center;gap:10px;padding:14px 26px;border-bottom:1px solid var(--border);
        background:rgba(251,245,234,.7);backdrop-filter:blur(6px);position:sticky;top:0;z-index:5}
      .fbtn{display:flex;align-items:center;gap:7px;padding:7px 12px;border:1px solid var(--border);border-radius:8px;
        background:var(--surface-2);color:var(--ink-2);font-size:12.5px;font-weight:500;cursor:pointer;transition:.14s}
      .fbtn:hover{border-color:var(--accent-cool);color:var(--ink)}
      .fseg{display:flex;border:1px solid var(--border);border-radius:8px;overflow:hidden;background:var(--surface-2)}
      .fseg button{padding:7px 11px;border:0;background:transparent;font-family:'Geist Mono',monospace;font-size:12px;
        color:var(--ink-muted);cursor:pointer;transition:.12s;border-right:1px solid var(--border-soft)}
      .fseg button:last-child{border-right:0}
      .fseg button.on{background:var(--accent-cool);color:#fff}
      .fseg button:disabled{cursor:not-allowed}
      .fprev{display:flex;align-items:center;gap:8px;padding:4px 9px 4px 7px;border:1px dashed var(--border);border-radius:10px;background:transparent;cursor:help}
      .fprev-tag{font-family:'Geist Mono',monospace;font-size:9.5px;letter-spacing:.07em;text-transform:uppercase;
        color:var(--ink-soft);background:var(--surface-2);border:1px solid var(--border-soft);border-radius:999px;padding:2px 7px}
      .fprev .fseg,.fprev .fbtn{opacity:.5}
      .fprev .fbtn{cursor:not-allowed}
      .fprev .fbtn:hover{border-color:var(--border);color:var(--ink-2)}
      .fnote{display:flex;align-items:center;gap:7px;padding:7px 26px;font-size:11.5px;color:var(--ink-soft);
        background:rgba(251,245,234,.5);border-bottom:1px solid var(--border-soft)}
      .fnote b{color:var(--ink-muted);font-weight:600}
      .sync{margin-left:auto;display:flex;align-items:center;gap:7px;font-size:12px;color:var(--ink-muted)}
      .dot{width:7px;height:7px;border-radius:999px;background:var(--pos);box-shadow:0 0 0 3px rgba(63,122,110,.18)}
      .content{padding:24px 26px 40px;overflow:auto}
      .h-title{font-size:24px;font-weight:600}
      .h-sub{color:var(--ink-muted);font-size:13px;margin:2px 0 6px}
      .prov{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;color:var(--ink-soft);
        background:var(--surface);border:1px solid var(--border-soft);border-radius:999px;padding:3px 10px;margin-bottom:18px}
      .kpis{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr 1fr;gap:14px;margin-bottom:18px}
      .kpi{background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:16px 16px 14px;box-shadow:var(--shadow)}
      .kpi.main{background:linear-gradient(160deg,#23463f,#1c3a34);border-color:#1c3a34;color:#fff}
      .kpi-lab{font-size:11.5px;color:var(--ink-soft);letter-spacing:.02em;display:flex;align-items:center;gap:6px}
      .kpi.main .kpi-lab{color:#A9C7BF}
      .kpi-num{font-size:33px;font-weight:600;margin-top:6px;line-height:1}
      .kpi-sub{font-size:11.5px;color:var(--ink-soft);margin-top:7px}
      .kpi.main .kpi-sub{color:#B6D0C8}
      .pill{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600}
      .pill-pos{background:rgba(63,122,110,.13);color:var(--pos)}
      .pill-warn{background:rgba(217,164,65,.18);color:#9a7414}
      .pill-soft{background:var(--border-soft);color:var(--ink-muted)}
      .pill-gray{background:#EBE7DD;color:#6B7280}
      .grid{display:grid;gap:16px}
      .card{background:var(--surface-2);border:1px solid var(--border);border-radius:12px;box-shadow:var(--shadow);overflow:hidden}
      .card-h{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--border-soft)}
      .card-t{font-size:14px;font-weight:600}
      .card-st{font-size:11.5px;color:var(--ink-soft)}
      .card-b{padding:14px 16px}
      table{width:100%;border-collapse:collapse}
      th{text-align:left;font-size:10.5px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-soft);
        font-weight:600;padding:8px 10px;border-bottom:1px solid var(--border)}
      td{padding:9px 10px;border-bottom:1px solid var(--border-soft);font-size:12.5px}
      tr:last-child td{border-bottom:0}
      tr.hl td{background:rgba(63,122,110,.06)}
      .swatch{width:9px;height:9px;border-radius:3px;display:inline-block;margin-right:7px;vertical-align:middle}
      .tk{font-size:10.5px;color:var(--ink-soft)}
      .insight{display:flex;gap:12px;padding:14px 16px;border-radius:10px;border:1px solid var(--border);
        background:linear-gradient(180deg,#FFFCF6,#FBF3E6)}
      .insight .ic{width:30px;height:30px;border-radius:8px;flex:0 0 30px;display:flex;align-items:center;justify-content:center;
        background:rgba(199,93,60,.12);color:var(--accent)}
      .insight b{color:var(--ink)}
      .exp{display:flex;gap:9px;flex-wrap:wrap}
      .exp button{display:flex;align-items:center;gap:8px;padding:9px 13px;border-radius:8px;border:1px solid var(--border);
        background:var(--surface-2);font-size:12.5px;font-weight:500;color:var(--ink-2);cursor:pointer;transition:.14s}
      .exp button:hover{border-color:var(--accent-cool);color:var(--ink);transform:translateY(-1px)}
      .exp button.pri{background:var(--accent);border-color:var(--accent);color:#fff}
      .exp button:disabled{opacity:.45;cursor:not-allowed;transform:none}
      .legend{display:flex;gap:16px;flex-wrap:wrap;font-size:12px;color:var(--ink-muted)}
      .empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:50px 20px;text-align:center;color:var(--ink-muted)}
      .empty .ic{width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:var(--border-soft);color:var(--ink-soft)}
      .toast{position:fixed;bottom:22px;left:50%;transform:translateX(-50%);background:var(--ink);color:#fff;
        padding:11px 18px;border-radius:10px;font-size:13px;box-shadow:var(--shadow-strong);display:flex;align-items:center;gap:9px;z-index:20}
      tr.clickable{cursor:pointer}
      tr.clickable:hover td{background:rgba(63,122,110,.05)}
      .gl-backdrop{position:fixed;inset:0;background:rgba(26,43,69,.22);z-index:30;animation:fade .2s ease}
      .gl-drawer{position:fixed;top:0;right:0;height:100vh;width:396px;max-width:92vw;background:var(--surface-2);
        border-left:1px solid var(--border);box-shadow:var(--shadow-strong);z-index:31;display:flex;flex-direction:column;
        animation:slidein .26s cubic-bezier(.22,.61,.36,1)}
      @keyframes slidein{from{transform:translateX(100%)}to{transform:none}}
      .gl-drawer-h{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;
        padding:18px 18px 14px;border-bottom:1px solid var(--border-soft)}
      .gl-drawer-b{padding:6px 18px 30px;overflow:auto;flex:1}
      .gl-drawer-x{background:transparent;border:0;cursor:pointer;color:var(--ink-soft);padding:5px;border-radius:7px;display:flex}
      .gl-drawer-x:hover{background:var(--border-soft);color:var(--ink)}
      .dr-sec{font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-soft);font-weight:600;margin:20px 0 9px}
      .dr-coord{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      .dr-coord .box{background:var(--surface);border:1px solid var(--border-soft);border-radius:9px;padding:9px 11px}
      .dr-coord .lab{font-size:10px;color:var(--ink-soft);text-transform:uppercase;letter-spacing:.04em}
      .dr-coord .val{font-family:'Geist Mono',monospace;font-size:15px;font-weight:600;color:var(--ink);margin-top:3px}
    `}</style>
  );
}

/* ─────────────────────────────── plan map (SVG) ─────────────────────────────── */
const WINDOWS = {
  aoi:   { xMin: -6500, xMax: 6500, yMin: -6800, yMax: 6800, VW: 440, scaleM: 2000, scaleLab: "2 km", gridStep: 2000 },
  drill: { xMin: -260,  xMax: 540,  yMin: -300,  yMax: 1140, VW: 400, scaleM: 200,  scaleLab: "200 m", gridStep: 200 },
};

function PlanMap({ area, collars, hovered, setHovered, mode, markerMode = "holders" }) {
  const aoi = area.aoi;
  // Grade×width (gram-metre) bubbles — AOI 1 only; markerMode is forced to "holders" elsewhere.
  // radius ∝ sqrt(gram-metres) so AREA is proportional to Cu×width; clamped readable.
  const gw = markerMode === "gradewidth";
  const gmRadius = (best) => Math.max(3, Math.min(15, 1.7 * Math.sqrt(best.cu * best.width)));
  const W = WINDOWS[mode];
  const Wm = W.xMax - W.xMin, Hm = W.yMax - W.yMin;
  const VW = W.VW, VH = (VW * Hm) / Wm;
  const ppm = VW / Wm;
  const px = (dE) => (dE - W.xMin) * ppm;
  const py = (dN) => (1 - (dN - W.yMin) / Hm) * VH;
  const at0 = collars.filter((c) => c.e === aoi.east && c.n === aoi.north);
  const gx = [], gy = [];
  for (let g = Math.ceil(W.yMin / W.gridStep) * W.gridStep; g <= W.yMax; g += W.gridStep) gx.push(g);
  for (let g = Math.ceil(W.xMin / W.gridStep) * W.gridStep; g <= W.xMax; g += W.gridStep) gy.push(g);
  const ringCentroid = (ring) => {
    const xs = ring.map((p) => p[0]), ys = ring.map((p) => p[1]);
    return [xs.reduce((a, b) => a + b, 0) / xs.length, ys.reduce((a, b) => a + b, 0) / ys.length];
  };

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${VW} ${VH}`} style={{ width: "100%", height: "auto", display: "block",
        background: "radial-gradient(120% 90% at 35% 18%, #FFFDF8, #F6EEDF)", borderRadius: 10, border: "1px solid var(--border)" }}>
        <defs><clipPath id="vp"><rect x="0" y="0" width={VW} height={VH} /></clipPath></defs>
        <g clipPath="url(#vp)">
          {gx.map((g) => <line key={"gx" + g} x1={0} y1={py(g)} x2={VW} y2={py(g)} stroke="var(--border-soft)" strokeWidth="0.5" />)}
          {gy.map((g) => <line key={"gy" + g} x1={px(g)} y1={0} x2={px(g)} y2={VH} stroke="var(--border-soft)" strokeWidth="0.5" />)}
          {mode === "aoi" && (
            <circle cx={px(0)} cy={py(0)} r={aoi.radius * ppm} fill="rgba(199,93,60,0.04)"
              stroke="var(--accent)" strokeWidth="1.1" strokeDasharray="5 4" />
          )}
          {area.geom.map((t) => {
            const col = colorFor(t.listed);
            return (
              <g key={t.permit}>
                {t.rings.map((ring, ri) => (
                  <polygon key={ri}
                    points={ring.map((p) => `${px(p[0]).toFixed(1)},${py(p[1]).toFixed(1)}`).join(" ")}
                    fill={mode === "aoi" ? col : "none"} fillOpacity={mode === "aoi" ? 0.1 : 0}
                    stroke={col} strokeWidth={mode === "aoi" ? 1 : 1.4} strokeOpacity="0.85"
                    strokeDasharray={mode === "drill" ? "5 3" : "0"} strokeLinejoin="round" />
                ))}
              </g>
            );
          })}
          {mode === "aoi" && area.geom.map((t) => {
            const near = t.rings.reduce((best, r) => {
              const c = ringCentroid(r); const d = Math.hypot(c[0], c[1]);
              return d < best.d ? { d, c } : best;
            }, { d: Infinity, c: [0, 0] }).c;
            const lx = Math.max(16, Math.min(px(near[0]), VW - 58));
            const ly = Math.max(14, Math.min(py(near[1]), VH - 8));
            return (
              <g key={"L" + t.permit}>
                <rect x={lx - 3} y={ly - 9} width={52} height={13} rx="3" fill="var(--surface-2)" stroke={colorFor(t.listed)} strokeWidth="0.6" opacity="0.92" />
                <text x={lx} y={ly} fontSize="8" fontFamily="Geist Mono" fill="var(--ink-2)">{t.permit}</text>
              </g>
            );
          })}
          <g>
            <circle cx={px(0)} cy={py(0)} r={mode === "drill" ? 13 : 5} fill="none" stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
            <line x1={px(0) - 9} y1={py(0)} x2={px(0) + 9} y2={py(0)} stroke="var(--accent)" strokeWidth="1" />
            <line x1={px(0)} y1={py(0) - 9} x2={px(0)} y2={py(0) + 9} stroke="var(--accent)" strokeWidth="1" />
          </g>
          {collars.map((c, i) => {
            const dE = c.e - aoi.east, dN = c.n - aoi.north;
            const best = gw ? ASSAYS_MTISA[c.hole]?.best : null;
            // Holders: dot sized by depth (drill) / fixed (aoi), coloured by company.
            // Grade×width: bubble sized by gram-metres, coloured by Cu grade; no-assay → min grey.
            const r = gw ? (best ? gmRadius(best) : 3)
              : (mode === "drill" ? 3.4 + Math.sqrt(c.depth) / 3.6 : 2.6);
            const fill = gw ? (best ? cuColor(best.cu) : UNRESOLVED) : colorFor(c.co);
            const on = hovered === c.hole;
            const grp = at0.findIndex((x) => x.hole === c.hole);
            const isStack = mode === "drill" && c.e === aoi.east && c.n === aoi.north && grp >= 0;
            const ang = isStack ? (grp / at0.length) * Math.PI * 2 : 0;
            const off = isStack ? 7 : 0;
            return (
              <circle key={c.hole + i} cx={px(dE) + Math.cos(ang) * off} cy={py(dN) + Math.sin(ang) * off}
                r={on ? r + 2 : r} fill={fill} fillOpacity={on ? 0.95 : 0.8}
                stroke="#fff" strokeWidth={on ? 1.4 : 0.7} style={{ cursor: "pointer", transition: "r .12s" }}
                onMouseEnter={() => setHovered(c.hole)} onMouseLeave={() => setHovered(null)} />
            );
          })}
          {collars.filter((c) => c.hole === hovered).map((c) => {
            const best = gw ? ASSAYS_MTISA[c.hole]?.best : null;
            const boxW = best ? 116 : 92, boxH = best ? 36 : 26;
            const lx = Math.min(px(c.e - aoi.east) + 10, VW - boxW - 4), ly = Math.max(py(c.n - aoi.north) - 8, 18);
            return (
              <g key="lab">
                <rect x={lx} y={ly - 12} width={boxW} height={boxH} rx="5" fill="var(--ink)" />
                <text x={lx + 7} y={ly + 1} fill="#fff" fontSize="8.5" fontFamily="Geist Mono">{c.hole}</text>
                <text x={lx + 7} y={ly + 10} fill="#9FB4C9" fontSize="7.5" fontFamily="Geist Mono">{c.depth} m TD</text>
                {best && <text x={lx + 7} y={ly + 20} fill={cuColor(best.cu)} fontSize="7.5" fontFamily="Geist Mono">{best.width} m @ {best.cu}% Cu</text>}
              </g>
            );
          })}
        </g>
        <g>
          <line x1={14} y1={VH - 16} x2={14 + W.scaleM * ppm} y2={VH - 16} stroke="var(--ink-2)" strokeWidth="1.4" />
          <line x1={14} y1={VH - 19} x2={14} y2={VH - 13} stroke="var(--ink-2)" strokeWidth="1.4" />
          <line x1={14 + W.scaleM * ppm} y1={VH - 19} x2={14 + W.scaleM * ppm} y2={VH - 13} stroke="var(--ink-2)" strokeWidth="1.4" />
          <text x={14} y={VH - 22} fontSize="7.5" fill="var(--ink-muted)" fontFamily="Geist Mono">{W.scaleLab}</text>
        </g>
        <g transform={`translate(${VW - 22},22)`}>
          <path d="M0,-11 L5,7 L0,3 L-5,7 Z" fill="var(--ink-2)" />
          <text x="-3.2" y="20" fontSize="8" fill="var(--ink-muted)" fontFamily="Geist Mono">N</text>
        </g>
      </svg>
      <div style={{ position: "absolute", top: 10, left: 12, fontSize: 10.5, color: "var(--ink-soft)", fontFamily: "Geist Mono" }}>
        {gw
          ? (mode === "aoi"
              ? `AOI ${(aoi.radius / 1000).toFixed(0)} km · bubble size ∝ gram-metres (Cu×width)`
              : "plan zoomed to drilling · bubble size ∝ gram-metres (Cu×width) · dashed = permit boundary")
          : (mode === "aoi"
              ? `AOI ${(aoi.radius / 1000).toFixed(0)} km · real permit footprints (QLD open data)`
              : "plan zoomed to drilling · marker size ∝ depth · dashed = permit boundary")}
      </div>
    </div>
  );
}

/* ─────────────────────────────── bits ─────────────────────────────── */
const Kpi = ({ label, value, sub, icon, pill, pillType = "pos", main }) => (
  <div className={"kpi" + (main ? " main" : "")}>
    <div className="kpi-lab">{icon}{label}</div>
    <div className="kpi-num disp mono">{value}</div>
    <div className="kpi-sub">
      {pill && <span className={"pill pill-" + pillType} style={{ marginRight: 7 }}>{pill}</span>}
      {sub}
    </div>
  </div>
);

function downloadFile(name, text, type) {
  try {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name; document.body.appendChild(a); a.click();
    a.remove(); URL.revokeObjectURL(url);
  } catch (e) {}
}

/* ─────────────────────────────── app ─────────────────────────────── */
export default function App() {
  const [areaId, setAreaId] = useState("mtisa");
  const [view, setView] = useState("query");
  const [radius, setRadius] = useState(5000);
  const [mapMode, setMapMode] = useState("aoi");
  const [markerMode, setMarkerMode] = useState("holders"); // plan-map collar styling: "holders" | "gradewidth" (AOI 1 only)
  const [hovered, setHovered] = useState(null);
  const [toast, setToast] = useState(null);
  const [drawerHole, setDrawerHole] = useState(null); // per-hole detail drawer (AOI 1 only)

  const A = AREAS[areaId];
  const collars = useMemo(() => A.collars.filter((c) => distOf(c, A.aoi) <= radius), [A, radius]);
  const tenements = useMemo(() => A.tenements.filter((t) => t.dist <= radius), [A, radius]);
  const visibleGeom = useMemo(() => A.geom.filter((g) => g.dist <= radius), [A, radius]);
  const cos = useMemo(() => [...new Set(tenements.map((t) => t.listed).filter(Boolean))], [tenements]);
  const unresolved = useMemo(() => [...new Set(A.tenements.filter((t) => t.dist <= radius && !t.listed).map((t) => t.holder))], [A, radius]);
  const deepest = collars.reduce((m, c) => Math.max(m, c.depth), 0);
  const bestInterceptHole = areaId === "mtisa"
    ? Object.values(ASSAYS_MTISA).reduce((b, h) => h.best.cu > (b?.cu ?? -1) ? h.best : b, null)
    : null;
  const withData = A.coverage.filter((c) => c.collars > 0).length;

  const fire = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2600); };
  const switchArea = (id) => { setAreaId(id); setRadius(AREAS[id].aoi.radius); setMapMode("aoi"); setMarkerMode("holders"); setHovered(null); setDrawerHole(null); };

  const exportCsv = () => {
    const head = "HoleID,Easting,Northing,Total_Depth,Company,Source_PDF";
    const body = collars.map((c) => `${c.hole},${c.e},${c.n},${c.depth},${c.co},${c.src}`).join("\n");
    downloadFile("collars.csv", head + "\n" + body, "text/csv");
    fire(`collars.csv exported · ${collars.length} holes, provenance retained`);
  };
  const exportGeojson = () => {
    const fc = { type: "FeatureCollection", crs: { type: "name", properties: { name: "EPSG:28354" } },
      features: collars.map((c) => ({ type: "Feature", geometry: { type: "Point", coordinates: [c.e, c.n] },
        properties: { HoleID: c.hole, depth: c.depth, company: c.co, source: c.src } })) };
    downloadFile("collars.geojson", JSON.stringify(fc, null, 2), "application/geo+json");
    fire("collars.geojson exported · MGA94 z54 (EPSG:28354)");
  };

  // Downhole strip-log data (AOI 1 only): holes ordered by best Cu% desc — same as the intercept table.
  const stripHoles = areaId === "mtisa"
    ? [...collars]
        .filter((c) => ASSAYS_MTISA[c.hole])
        .sort((a, b) => (ASSAYS_MTISA[b.hole].best.cu) - (ASSAYS_MTISA[a.hole].best.cu))
        .map((c) => ({ hole: c.hole, co: c.co, td: ASSAYS_MTISA[c.hole].td, intervals: ASSAYS_MTISA[c.hole].intervals }))
    : [];
  const aoiLabel = `${A.aoi.radius < 1000 ? A.aoi.radius + " m" : A.aoi.radius / 1000 + " km"}`;
  // Drawer target: only render if the selected hole is in-AOI and has assays (AOI 1 only).
  const drawerCollar = (areaId === "mtisa" && drawerHole)
    ? collars.find((c) => c.hole === drawerHole && ASSAYS_MTISA[c.hole])
    : null;

  return (
    <div className="gl-root">
      <Styles />
      <aside className="sb">
        <div className="sb-brand">
          <div className="sb-logo"><Crosshair size={17} /></div>
          <div><div className="sb-name disp">GeoLasso</div><div className="sb-tag">Exploration intel</div></div>
        </div>
        <div className="sb-sec">Query</div>
        {[
          { id: "query", label: "Area & tenements", icon: <Map size={16} />, sub: tenements.length + unresolved.length },
          { id: "drill", label: "Drill data", icon: <Layers size={16} />, sub: collars.length },
          { id: "prov", label: "Provenance & QA", icon: <ShieldCheck size={16} />, sub: null },
          { id: "drill3d", label: "3D drill view", icon: <Box size={16} />, sub: null },
        ].map((n) => (
          <div key={n.id} className={"nav" + (view === n.id ? " on" : "")} onClick={() => setView(n.id)}>
            {n.icon}<span>{n.label}</span>{n.sub != null && <span className="navsub mono">{n.sub}</span>}
          </div>
        ))}
        <div className="sb-sec">Saved areas</div>
        {Object.values(AREAS).map((a) => (
          <div key={a.id} className={"saved" + (areaId === a.id ? " on" : "")} onClick={() => switchArea(a.id)}>
            <div className="nm"><MapPin size={15} color={areaId === a.id ? "var(--accent-cool)" : "var(--ink-soft)"} />{a.name}</div>
            <div className="meta mono">{a.tenements.length || a.geom.length} permits · {a.collars.length} collars</div>
          </div>
        ))}
        <div className="sb-foot">Prototype · real GeoLasso pipeline output<br />on QLD open data.</div>
      </aside>

      <div className="main">
        <div className="fstrip">
          <button className="fbtn"><Crosshair size={14} />Point + radius</button>
          <div className="fseg">
            {[500, 1000, 2000, 5000].map((r) => (
              <button key={r} className={radius === r ? "on" : ""} onClick={() => setRadius(r)}>{r < 1000 ? r + " m" : r / 1000 + " km"}</button>
            ))}
          </div>
          {/* Commodity + date filters are PREVIEW: the PoC collar data carries no per-hole
              commodity or announcement date, so these are shown (product vision) but disabled
              and clearly labelled rather than faking interactivity — see CLAUDE.md. */}
          <div className="fprev" title="Preview — not yet wired. The proof-of-concept extraction captures hole ID, collar coordinates, total depth, holder and source PDF, but not per-hole commodity or announcement date. These filters activate once those fields are extracted from the source reports.">
            <span className="fprev-tag">Preview</span>
            <div className="fseg">
              {["Cu", "Au", "Co", "All"].map((c) => (
                <button key={c} disabled>{c}</button>
              ))}
            </div>
            <button className="fbtn" disabled><Filter size={14} />All dates</button>
          </div>
          <div className="sync"><span className="dot" />QLD GeoResGlobe · GSQ Open Data · synced</div>
        </div>
        <div className="fnote">
          <Filter size={12} />
          <span>Commodity &amp; date filters are <b>preview</b> — this prototype's drill-collar data carries no per-hole commodity or date, so they're placeholders for a production data source, not active filters.</span>
        </div>

        {/* ───── query ───── */}
        {view === "query" && (
          <div className="content fade">
            <div className="h-title disp">{A.name}</div>
            <div className="h-sub mono">point ({A.aoi.east.toLocaleString()}, {A.aoi.north.toLocaleString()}) {A.aoi.zone} · {aoiLabel} radius · {A.region}</div>
            <div className="prov"><Activity size={12} />{A.provenance}</div>

            <div className="kpis">
              <Kpi main label={<>&nbsp;Days of work → this query</>} value="≈ 0" sub="hand-typed rows in the output" icon={<Gauge size={13} />} pill="minutes, not days" />
              <Kpi label="Tenements" value={tenements.length + unresolved.length ? visibleGeom.length : 0} sub="granted permits in area" icon={<Layers size={13} />} />
              <Kpi label="Listed holders" value={cos.length} sub={unresolved.length ? `${unresolved.length} unresolved` : `${withData} with disclosures`} icon={<Building2 size={13} />} pill={unresolved.length ? "+ flagged" : null} pillType="warn" />
              <Kpi label="Drill collars" value={collars.length} sub={collars.length ? "extracted from PDFs" : "none this run"} icon={<Target size={13} />} pill={collars.length ? "0 typed" : null} />
              <Kpi label="Best intercept" value={bestInterceptHole ? `${bestInterceptHole.width} m @ ${bestInterceptHole.cu}% Cu` : "—"} sub={bestInterceptHole ? `${bestInterceptHole.au} g/t Au · best in AOI` : "no assays this run"} icon={<Activity size={13} />} />
            </div>

            <div className="grid" style={{ gridTemplateColumns: "minmax(360px,1fr) 1.25fr" }}>
              <div className="card">
                <div className="card-h"><div><div className="card-t">Plan view</div><div className="card-st">real permit footprints + extracted collars</div></div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {/* Grade×width toggle: AOI 1 only — North belt has no assays, so it never offers the mode */}
                    {areaId === "mtisa" && (
                      <div className="fseg">
                        <button className={markerMode === "holders" ? "on" : ""} onClick={() => setMarkerMode("holders")}>Holders</button>
                        <button className={markerMode === "gradewidth" ? "on" : ""} onClick={() => setMarkerMode("gradewidth")}>Grade×width</button>
                      </div>
                    )}
                    <div className="fseg">
                      <button className={mapMode === "aoi" ? "on" : ""} onClick={() => setMapMode("aoi")}>AOI {aoiLabel}</button>
                      <button className={mapMode === "drill" ? "on" : ""} onClick={() => setMapMode("drill")}>Drilling</button>
                    </div>
                  </div></div>
                <div className="card-b">
                  <PlanMap area={A} collars={collars} hovered={hovered} setHovered={setHovered} mode={mapMode}
                    markerMode={areaId === "mtisa" ? markerMode : "holders"} />
                  <div className="legend" style={{ marginTop: 12 }}>
                    {cos.map((name) => (<span key={name}><span className="swatch" style={{ background: colorFor(name) }} />{name} <span className="tk">{tickerFor(name)}</span></span>))}
                    {unresolved.map((h) => (<span key={h}><span className="swatch" style={{ background: UNRESOLVED }} />{h} <span className="tk">unmapped</span></span>))}
                  </div>
                  {areaId === "mtisa" && markerMode === "gradewidth" && (
                    <div className="legend" style={{ marginTop: 8, fontSize: 11 }}>
                      <span style={{ color: "var(--ink-soft)" }}>bubble size = Cu × width (gram-metres) · colour = Cu grade</span>
                      <span><span className="swatch" style={{ background: "#DC2626" }} />≥4% Cu</span>
                      <span><span className="swatch" style={{ background: "#F59E0B" }} />1–4% Cu</span>
                      <span><span className="swatch" style={{ background: "#14B8A6" }} />&lt;1% Cu</span>
                    </div>
                  )}
                  {mapMode === "aoi" && areaId === "mtisa" && (
                    <div style={{ marginTop: 10, fontSize: 11.5, color: "var(--ink-muted)", lineHeight: 1.45 }}>
                      <AlertTriangle size={12} style={{ verticalAlign: "-2px", marginRight: 5, color: "var(--accent-warm)" }} />
                      Carnaby's holes straddle two other holders' permits — the southern cluster sits inside Hammer's EPM 26777, the northern cluster inside C29's EPM 19483 — yet none fall in Carnaby's own ground (~3.8 km away). Holder-of-ground ≠ driller-on-record: verify against the source reports.
                    </div>
                  )}
                  {mapMode === "aoi" && areaId === "northbelt" && (
                    <div style={{ marginTop: 10, fontSize: 11.5, color: "var(--ink-muted)", lineHeight: 1.45 }}>
                      <CheckCircle2 size={12} style={{ verticalAlign: "-2px", marginRight: 5, color: "var(--pos)" }} />
                      Fresh run, 58 km north: 6 of 7 permits resolve to Hammer Metals via "Mt. Dockerell → Hammer" — permits the resolver had never seen. One holder (Mulga Minerals, grey) is unmapped and flagged. No drilling extracted — the PDF corpus wasn't loaded for this run.
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="insight">
                  <div className="ic">{areaId === "mtisa" ? <AlertTriangle size={16} /> : <ArrowUpRight size={16} />}</div>
                  <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>
                    {areaId === "mtisa"
                      ? <><b>Discoverable signal.</b> Four of the deepest holes (550–718 m) share a single collar at the dead centre of the AOI — Carnaby's <span className="mono">CBDD017</span> wedge series, a target being drilled out hard, just <b>291 m</b> from C29 Metals' EPM 19483 boundary.</>
                      : <><b>Generalisation check.</b> This is a live run on a new area against the full <b>2,621-permit</b> Queensland layer. The spatial query and holder→listed resolution work unchanged; the only gap is the announcement corpus, which isolates <b>extraction coverage</b> as the real frontier — exactly as the brief predicted.</>}
                  </div>
                </div>
                <div className="card" style={{ flex: 1 }}>
                  <div className="card-h"><div className="card-t">Tenements in area</div><div className="card-st mono">{visibleGeom.length} granted</div></div>
                  <div className="card-b" style={{ paddingTop: 4 }}>
                    <table>
                      <thead><tr><th>Permit</th><th>Registered holder</th><th>Listed entity</th><th style={{ textAlign: "right" }}>Dist</th></tr></thead>
                      <tbody>
                        {visibleGeom.map((t) => {
                          const tData = A.tenements.find((x) => x.permit === t.permit);
                          const xDays = tData?.expiry ? daysToExpiry(tData.expiry) : null;
                          return (
                            <tr key={t.permit}>
                              <td className="mono" style={{ fontWeight: 600 }}>
                                {t.permit}
                                {xDays !== null && xDays <= 180 && (
                                  xDays > 0
                                    ? <span className="pill pill-warn" style={{ marginLeft: 6, fontSize: 10 }}>expires in ~{xDays} d</span>
                                    : <span className="pill pill-gray" style={{ marginLeft: 6, fontSize: 10 }}>renewal due</span>
                                )}
                              </td>
                              <td style={{ color: "var(--ink-muted)", fontSize: 11.5 }}>{t.holder || tData?.holder}</td>
                              <td>
                                <span className="swatch" style={{ background: colorFor(t.listed) }} />
                                {t.listed || <span style={{ color: "var(--ink-muted)" }}>{(t.holder || "").replace(/ PTY LTD/i, "")} <span className="pill pill-gray" style={{ marginLeft: 4 }}>unmapped</span></span>}
                              </td>
                              <td className="mono" style={{ textAlign: "right" }}>{t.dist === 0 ? "in" : (t.dist >= 1000 ? (t.dist / 1000).toFixed(1) + " km" : t.dist + " m")}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ───── drill ───── */}
        {view === "drill" && (
          <div className="content fade">
            <div className="h-title disp">Drill collars</div>
            <div className="h-sub mono">{collars.length} holes inside AOI · {A.name}</div>
            {collars.length === 0 ? (
              <div className="card"><div className="card-b"><div className="empty">
                <div className="ic"><Inbox size={22} /></div>
                <div style={{ fontWeight: 600, color: "var(--ink-2)" }}>No drill collars extracted for this area</div>
                <div style={{ fontSize: 12.5, maxWidth: 460 }}>This was a live spatial + entity-resolution run; the announcement PDF corpus wasn't loaded, so the document layer produced nothing. The spatial and corporate layers still resolved {cos.length ? cos.join(", ") : "the holders"}. See <b>Provenance & QA</b> for the full picture.</div>
              </div></div></div>
            ) : (
              <>
                <div className="exp" style={{ marginBottom: 18 }}>
                  <button className="pri" onClick={exportCsv}><Download size={15} />collars.csv</button>
                  <button onClick={exportGeojson}><Download size={15} />collars.geojson</button>
                  <button onClick={() => fire("result.gpkg queued · tenements + collars + AOI layers")}><Database size={15} />result.gpkg (QGIS)</button>
                  <button onClick={() => fire("Hand-off to Leapfrog / Micromine · collar + survey schema")}><ArrowUpRight size={15} />Send to 3D model</button>
                </div>
                <div className="grid" style={{ gridTemplateColumns: "1fr 1.55fr" }}>
                  <div className="card">
                    <div className="card-h"><div className="card-t">Downhole strip log</div><div className="card-st mono">depth m · best Cu first</div></div>
                    <div className="card-b">
                      <StripLog holes={stripHoles} />
                      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", margin: "10px 2px 2px", fontSize: 10.5, color: "var(--ink-muted)" }}>
                        <span><span className="swatch" style={{ background: "#DC2626" }} />≥4% Cu</span>
                        <span><span className="swatch" style={{ background: "#F59E0B" }} />1–4% Cu</span>
                        <span><span className="swatch" style={{ background: "#14B8A6" }} />&lt;1% Cu</span>
                        <span><span className="swatch" style={{ background: "#C9CCC7" }} />hole length</span>
                      </div>
                      <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 8, lineHeight: 1.5 }}>
                        Downhole strip log — interval depth and Cu grade. Same colour logic as the 3D view.
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-h"><div className="card-t">Intercept table</div><div className="card-st mono">sorted by best Cu% · row → hole detail + coords</div></div>
                    <div className="card-b" style={{ paddingTop: 4, maxHeight: 520, overflow: "auto" }}>
                      <table>
                        <thead><tr><th>Hole</th><th>Best intercept</th><th style={{ textAlign: "right" }}>TD</th><th>Company</th><th>Source PDF</th></tr></thead>
                        <tbody>
                          {[...collars].sort((a, b) => {
                            const ba = ASSAYS_MTISA[a.hole]?.best?.cu ?? -1;
                            const bb = ASSAYS_MTISA[b.hole]?.best?.cu ?? -1;
                            return bb - ba;
                          }).map((c) => {
                            const best = ASSAYS_MTISA[c.hole]?.best;
                            const clickable = !!ASSAYS_MTISA[c.hole];
                            return (
                              <tr key={c.hole}
                                className={(clickable ? "clickable" : "") + (drawerHole === c.hole ? " hl" : "")}
                                onClick={clickable ? () => setDrawerHole(c.hole) : undefined}
                                onMouseEnter={() => setHovered(c.hole)} onMouseLeave={() => setHovered(null)}>
                                <td className="mono" style={{ fontWeight: 600 }}><span className="swatch" style={{ background: colorFor(c.co) }} />{c.hole}</td>
                                <td className="mono">
                                  {best ? (
                                    <span style={{ color: cuColor(best.cu), fontWeight: 600 }}>{best.width} m @ {best.cu}% Cu</span>
                                  ) : "—"}
                                  {best?.au ? <span style={{ marginLeft: 6, fontSize: 10.5, color: "var(--ink-soft)" }}>{best.au} g/t Au</span> : null}
                                </td>
                                <td className="mono" style={{ textAlign: "right", fontWeight: 600 }}>{c.depth}</td>
                                <td style={{ color: "var(--ink-muted)", fontSize: 11.5 }}>{c.co}</td>
                                <td className="mono" style={{ fontSize: 10.5, color: "var(--ink-soft)" }}><FileText size={11} style={{ verticalAlign: "-1px", marginRight: 4 }} />{c.src.replace("_PA_koordinaatidega", "")}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                {drawerCollar && <HoleDrawer collar={drawerCollar} onClose={() => setDrawerHole(null)} />}
              </>
            )}
          </div>
        )}

        {/* ───── provenance ───── */}
        {view === "prov" && (
          <div className="content fade">
            <div className="h-title disp">Provenance & QA</div>
            <div className="h-sub">The trust surface — what was read, what resolved, and what to verify. We do ~90%; you check the flagged rest.</div>
            <div className="prov"><Activity size={12} />{A.provenance}</div>

            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="card">
                <div className="card-h"><div className="card-t">Holder → listed entity</div>{unresolved.length ? <AlertTriangle size={16} color="var(--accent-warm)" /> : <CheckCircle2 size={16} color="var(--pos)" />}</div>
                <div className="card-b">
                  <table>
                    <thead><tr><th>Registered holder</th><th>Resolved listed entity</th></tr></thead>
                    <tbody>
                      {A.resolution.map((r) => (
                        <tr key={r.holder}>
                          <td style={{ color: "var(--ink-muted)", fontSize: 11.5 }}>{r.holder}</td>
                          <td>
                            <span className="swatch" style={{ background: colorFor(r.listed) }} />
                            {r.listed
                              ? <>{r.listed} <span className="pill pill-pos" style={{ marginLeft: 6 }}>resolved</span></>
                              : <span style={{ color: "var(--ink-muted)" }}>— <span className="pill pill-gray" style={{ marginLeft: 6 }}><AlertTriangle size={11} />unmapped</span></span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card">
                <div className="card-h"><div className="card-t">Extraction coverage</div><div className="card-st">collars parsed per holder</div></div>
                <div className="card-b">
                  <table>
                    <thead><tr><th>Entity</th><th style={{ textAlign: "right" }}>PDFs read</th><th style={{ textAlign: "right" }}>Collars</th><th>Flag</th></tr></thead>
                    <tbody>
                      {A.coverage.map((m) => (
                        <tr key={m.name}>
                          <td><span className="swatch" style={{ background: m.unresolved ? UNRESOLVED : colorFor(m.name) }} />{m.name}</td>
                          <td className="mono" style={{ textAlign: "right" }}>{m.unresolved ? "—" : m.pdfs}</td>
                          <td className="mono" style={{ textAlign: "right", fontWeight: 600 }}>{m.unresolved ? "—" : m.collars}</td>
                          <td>{m.unresolved
                            ? <span className="pill pill-gray"><AlertTriangle size={11} />unmapped</span>
                            : m.collars > 0
                              ? <span className="pill pill-pos">extracted</span>
                              : <span className="pill pill-warn"><AlertTriangle size={11} />{m.note ? "no corpus" : "verify"}</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card" style={{ gridColumn: "1 / -1" }}>
                <div className="card-h"><div className="card-t">Flags to review</div><div className="card-st mono">best-effort automated extraction</div></div>
                <div className="card-b" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {areaId === "mtisa" ? (
                    <>
                      <div className="insight">
                        <div className="ic"><AlertTriangle size={16} /></div>
                        <div style={{ fontSize: 12.5, lineHeight: 1.5 }}><b>Hammer Metals holds the central tenement</b> (EPM 26777, distance 0) yet <b>0 collars</b> were extracted from its 8 announcements — likely scanned/legacy layouts needing OCR, or no in-AOI drilling disclosed. Flagged before it reaches your model.</div>
                      </div>
                      <div className="insight">
                        <div className="ic"><CheckCircle2 size={16} color="var(--pos)" /></div>
                        <div style={{ fontSize: 12.5, lineHeight: 1.5 }}><b>Carnaby Resources:</b> 18 collars from 10 announcements, all coordinates inside the AOI and de-duplicated across reports. Each row carries its source PDF and is ready to verify.</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="insight">
                        <div className="ic"><CheckCircle2 size={16} color="var(--pos)" /></div>
                        <div style={{ fontSize: 12.5, lineHeight: 1.5 }}><b>Entity resolution generalised cleanly:</b> 6 permits held by "MT. DOCKERELL MINING PTY LTD" all resolved to Hammer Metals on a new area the resolver had never seen — the subsidiary map compounds across the whole state.</div>
                      </div>
                      <div className="insight">
                        <div className="ic"><AlertTriangle size={16} /></div>
                        <div style={{ fontSize: 12.5, lineHeight: 1.5 }}><b>Mulga Minerals Pty Ltd is unmapped</b> (EPM 14019) — flagged for review, not silently dropped. And no announcement corpus was loaded for this run, so <b>0 collars</b> were extracted: the spatial + corporate layers generalise; extraction coverage is the work to fund.</div>
                      </div>
                    </>
                  )}
                  <div style={{ fontSize: 11.5, color: "var(--ink-soft)", fontStyle: "italic" }}>
                    Best-effort automated extraction. GeoLasso indexes and extracts the public record — it does not re-host source documents.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ───── 3D drill view ───── */}
        {view === "drill3d" && (
          collars.length === 0 ? (
            <div className="content fade">
              <div className="card"><div className="card-b"><div className="empty">
                <div className="ic"><Box size={22} /></div>
                <div style={{ fontWeight: 600, color: "var(--ink-2)" }}>No drill data for 3D view</div>
                <div style={{ fontSize: 12.5, maxWidth: 460 }}>This area had no announcement PDF corpus loaded, so no drill collars or assay intervals were extracted. The 3D view is available for <b>Mt Isa</b> — switch to that area to explore 18 holes with Cu% and Au g/t intervals in 3D.</div>
              </div></div></div>
            </div>
          ) : (
            <div className="fade" style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", padding: "12px 26px 16px" }}>
              <div style={{ marginBottom: 8, fontSize: 11.5, color: "var(--ink-soft)", display: "flex", alignItems: "center", gap: 7 }}>
                <Box size={12} />
                Interactive 3D — drag to orbit, scroll to zoom, hover a hole for assay intervals + source PDF.
              </div>
              <iframe
                src="/drill3d.html"
                title="GeoLasso 3D drill view — Mt Isa AOI"
                style={{ flex: 1, width: "100%", border: "1px solid var(--border)", borderRadius: 10, display: "block" }}
              />
            </div>
          )
        )}
      </div>

      {toast && <div className="toast fade"><CheckCircle2 size={16} color="#7BD3C0" />{toast}</div>}
    </div>
  );
}
