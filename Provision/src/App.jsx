import React, { useState, useEffect, useMemo } from 'react';
import {
  Clipboard, Bold, Italic, Underline, List, ListOrdered,
  AlignLeft, AlignCenter, ChevronDown, Search, Minus, Square, X,
  RotateCcw, Scale, Check, ChevronLeft, AlertTriangle, ShieldCheck, Link2,
  Save, Undo2, Redo2, Share2, MoreHorizontal, Plus, Pencil, BookOpen, FileText, Globe,
} from 'lucide-react';

/*
 * Provision — "EU Layer"
 *
 * A legal memo in Word. Press "/" (or the ribbon button) to open the
 * EU Regulatory Layer task pane on the right:
 *   READ   — the default view is the GDPR × EU AI Act overlap matrix. Click any
 *            chip to read that obligation alongside the draft, with first-class
 *            trust signals (verified primary text + regulatory-status intelligence).
 *   INSERT — from the reading view, drop the provision text, a drafted memo
 *            paragraph, or a diligence checklist into the document. Inserted
 *            blocks are styled distinctly from the lawyer's own prose and carry
 *            a citation line.
 *
 * Provision excerpts are faithful public-source text (EUR-Lex); parties fictional.
 * Regulatory-status notes are accurate as of 7 June 2026.
 */

// ── Visual tokens ──────────────────────────────────────────────────────────
const NAVY = '#222B36';
const BLUE = '#2B579A';
const GREEN = '#107C10';
const AMBER = '#B45309';
const RED = '#B3261E';

const STATUS = {
  green: { text: GREEN, bg: '#F1F8F1', border: '#C8E6C9' },
  amber: { text: AMBER, bg: '#FFF7ED', border: '#F6D5A8' },
  red: { text: RED, bg: '#FCEFEE', border: '#F1C7C3' },
};

// Shared trust signals -------------------------------------------------------
const VERIFIED = 'Official text · EUR-Lex consolidated · checked 7 Jun 2026';

const GDPR_STATUS = {
  kind: 'grey',
  text: 'In force since 2018; GDPR Digital Omnibus amendments proposed Nov 2025, not yet agreed.',
};
const AIACT_DEFERRAL = {
  kind: 'amber',
  header: 'Regulatory status — not enacted text',
  text: 'Applicability contested. High-risk obligations for Annex III systems (incl. employment) provisionally deferred from 2 Aug 2026 to 2 Dec 2027 under the Digital Omnibus on AI — political agreement 6 May 2026, confirmed by Council 13 May 2026, NOT YET FORMALLY ADOPTED. Until adopted, 2 Aug 2026 applies as written; keep preparing.',
};
const AIACT_PROHIBITED = {
  kind: 'red',
  header: 'Regulatory status — prohibited practice',
  text: 'Prohibited practice — in force since 2 Feb 2025 (AI Act Art 5). No deferral.',
};

// ── Content ─────────────────────────────────────────────────────────────────
const ITEMS = {
  'gdpr-22': {
    regime: 'GDPR', cite: 'Art 22', status: 'green',
    title: 'Automated individual decision-making',
    regStatus: GDPR_STATUS,
    citation: '— GDPR Art 22 · EUR-Lex, checked 7 Jun 2026',
    body: [
      { h: 'Article 22 — Automated individual decision-making, including profiling.' },
      { t: '1. The data subject shall have the right not to be subject to a decision based solely on automated processing, including profiling, which produces legal effects concerning him or her or similarly significantly affects him or her.' },
      { t: '2. Paragraph 1 shall not apply if the decision: (a) is necessary for entering into, or performance of, a contract between the data subject and a data controller; (b) is authorised by Union or Member State law to which the controller is subject and which also lays down suitable measures to safeguard the data subject’s rights and freedoms and legitimate interests; or (c) is based on the data subject’s explicit consent.' },
      { t: '3. In the cases referred to in points (a) and (c) of paragraph 2, the controller shall implement suitable measures to safeguard the data subject’s rights and freedoms and legitimate interests, at least the right to obtain human intervention on the part of the controller, to express his or her point of view and to contest the decision.' },
      { t: '4. Decisions referred to in paragraph 2 shall not be based on special categories of personal data referred to in Article 9(1), unless point (a) or (g) of Article 9(2) applies and suitable measures to safeguard the data subject’s rights and freedoms and legitimate interests are in place.' },
    ],
    memo: 'TalentMatch’s candidate-ranking and rejection logic likely constitutes a decision “based solely on automated processing” within the meaning of Article 22 GDPR, since it produces effects that significantly affect a candidate’s access to employment. Northwind may rely on Article 22 only where one of the exceptions in Article 22(2) applies and, in that case, must implement safeguards — at a minimum, the right to obtain human intervention, to express a view, and to contest the outcome. Because the ranking may draw on or infer special-category data, Article 22(4) imposes a near-prohibition absent explicit consent or a substantial-public-interest basis under Article 9(2).',
    diligence: [
      'Are hiring decisions made “solely” by automated processing, or is there meaningful human review?',
      'Does TalentMatch process or infer any special-category data (Art 9)?',
      'Has a DPIA been completed (Art 35)?',
      'Does the feature perform emotion recognition? (Prohibited in the workplace under AI Act Art 5.)',
      'Is Northwind a “provider” or a “deployer” of the high-risk system?',
    ],
  },

  'gdpr-35': {
    regime: 'GDPR', cite: 'Art 35', status: 'green',
    title: 'Data protection impact assessment (DPIA)',
    regStatus: GDPR_STATUS,
    citation: '— GDPR Art 35 · EUR-Lex, checked 7 Jun 2026',
    body: [
      { h: 'Article 35 — Data protection impact assessment.' },
      { t: '1. Where a type of processing in particular using new technologies, and taking into account the nature, scope, context and purposes of the processing, is likely to result in a high risk to the rights and freedoms of natural persons, the controller shall, prior to the processing, carry out an assessment of the impact of the envisaged processing operations on the protection of personal data.' },
      { t: '3. A data protection impact assessment shall in particular be required in the case of: (a) a systematic and extensive evaluation of personal aspects relating to natural persons which is based on automated processing, including profiling, and on which decisions are based that produce legal effects concerning the natural person or similarly significantly affect the natural person…' },
      { t: '7. The assessment shall contain at least: (a) a systematic description of the envisaged processing operations and purposes; (b) an assessment of the necessity and proportionality of the processing operations in relation to the purposes; (c) an assessment of the risks to the rights and freedoms of data subjects; and (d) the measures envisaged to address the risks, including safeguards and security measures.' },
    ],
    memo: 'Because TalentMatch carries out a systematic and extensive evaluation of candidates based on automated processing on which hiring decisions are based, a data protection impact assessment is mandatory under Article 35(3)(a) GDPR and must be completed before any processing begins. The DPIA should describe the processing and its purposes, assess necessity and proportionality, evaluate the risks to candidates’ rights and freedoms, and document the mitigating measures. Where the residual risk remains high, prior consultation with the supervisory authority under Article 36 is required.',
    diligence: [
      'Has a DPIA been completed before any candidate data is processed?',
      'Does it assess the necessity and proportionality of automated ranking?',
      'Does it document the human-oversight and contestability safeguards?',
      'Is prior consultation under Art 36 required given the residual risk?',
      'Has the Data Protection Officer been consulted (Art 35(2))?',
    ],
  },

  'gdpr-13-14': {
    regime: 'GDPR', cite: 'Arts 13–14', status: 'green',
    title: 'Transparency to candidates',
    regStatus: GDPR_STATUS,
    citation: '— GDPR Arts 13–14 · EUR-Lex, checked 7 Jun 2026',
    body: [
      { h: 'Articles 13–14 — Information to be provided to the data subject.' },
      { t: 'Where personal data are collected, the controller shall provide the data subject with, among other things, the identity of the controller, the purposes and legal basis of the processing, the recipients of the data, and the retention period.' },
      { t: 'In the case of automated decision-making within the meaning of Article 22(1) and (4), the controller must also provide meaningful information about the logic involved, as well as the significance and the envisaged consequences of such processing for the data subject (Arts 13(2)(f) and 14(2)(g)).' },
    ],
    memo: 'Where TalentMatch performs automated decision-making, Articles 13(2)(f) and 14(2)(g) GDPR require Northwind to give candidates meaningful information about the logic involved and about the significance and envisaged consequences of the processing, at the point at which their data are collected. This transparency obligation operates independently of the AI Act and applies now; it should be reflected in the candidate-facing privacy notice.',
  },

  'gdpr-9': {
    regime: 'GDPR', cite: 'Art 9', status: 'green',
    title: 'Special categories of personal data',
    regStatus: GDPR_STATUS,
    citation: '— GDPR Art 9 · EUR-Lex, checked 7 Jun 2026',
    body: [
      { h: 'Article 9 — Processing of special categories of personal data.' },
      { t: '1. Processing of personal data revealing racial or ethnic origin, political opinions, religious or philosophical beliefs, or trade union membership, and the processing of genetic data, biometric data for the purpose of uniquely identifying a natural person, data concerning health or data concerning a natural person’s sex life or sexual orientation shall be prohibited.' },
      { t: '2. Paragraph 1 shall not apply where one of a limited set of conditions applies, including explicit consent (point (a)) or reasons of substantial public interest on the basis of Union or Member State law (point (g)), subject to suitable and specific safeguards.' },
    ],
    memo: 'If TalentMatch processes or infers any special-category data — for instance health, ethnicity, or biometric data — Article 9(1) GDPR imposes a baseline prohibition that can be lifted only where a narrow condition in Article 9(2), such as explicit consent, applies. Inferred special-category data is treated as special-category data; Northwind should map whether the model’s features could reveal protected characteristics, even indirectly.',
  },

  'aiact-annex3': {
    regime: 'EU AI Act', cite: 'Annex III(4)', status: 'amber',
    title: 'Employment — high-risk AI systems',
    regStatus: AIACT_DEFERRAL,
    citation: '— EU AI Act, Annex III(4) · EUR-Lex, checked 7 Jun 2026',
    body: [
      { h: 'Annex III — High-risk AI systems referred to in Article 6(2).' },
      { t: 'Point 4 (Employment, workers’ management and access to self-employment): (a) AI systems intended to be used for the recruitment or selection of natural persons, in particular to place targeted job advertisements, to analyse and filter job applications, and to evaluate candidates;' },
      { t: '(b) AI systems intended to be used to make decisions affecting terms of work-related relationships, the promotion or termination of work-related contractual relationships, to allocate tasks based on individual behaviour or personal traits or characteristics, or to monitor and evaluate the performance and behaviour of persons in such relationships.' },
      { t: 'Providers of high-risk systems must meet the requirements of Chapter III (risk management, data governance, technical documentation, record-keeping, transparency, human oversight, accuracy and robustness); deployers carry the obligations set out in Article 26.' },
    ],
    memo: 'TalentMatch falls squarely within Annex III(4)(a) of the EU AI Act as a system used to analyse and filter job applications and to evaluate candidates, and is therefore classified as high-risk. Northwind must determine whether it acts as a “provider” (developing or placing the system on the market under its own name) or a “deployer” (using the system in the EU), because the two roles carry different obligations under Chapter III and Article 26. The high-risk obligations were scheduled to apply from 2 August 2026; a provisional deferral to 2 December 2027 has been politically agreed under the Digital Omnibus but is not yet formally adopted. Until adoption is confirmed in the Official Journal, Northwind should plan against the 2 August 2026 date and continue its conformity preparations.',
    diligence: [
      'Are hiring decisions made “solely” by automated processing, or is there meaningful human review?',
      'Does TalentMatch process or infer any special-category data (Art 9)?',
      'Has a DPIA been completed (Art 35)?',
      'Does the feature perform emotion recognition? (Prohibited in the workplace under AI Act Art 5.)',
      'Is Northwind a “provider” or a “deployer” of the high-risk system?',
    ],
  },

  'aiact-9-27': {
    regime: 'EU AI Act', cite: 'Arts 9 / 27', status: 'amber',
    title: 'Risk management & fundamental rights impact assessment',
    regStatus: AIACT_DEFERRAL,
    citation: '— EU AI Act Arts 9 & 27 · EUR-Lex, checked 7 Jun 2026',
    body: [
      { h: 'Article 9 — Risk management system; Article 27 — Fundamental rights impact assessment.' },
      { t: 'Article 9 requires providers of high-risk AI systems to establish, document, implement and maintain a continuous, iterative risk-management system run throughout the entire lifecycle of the system.' },
      { t: 'Article 27 requires certain deployers — including bodies governed by public law, private operators providing public services, and deployers of Annex III systems used for creditworthiness or insurance — to carry out a fundamental rights impact assessment (FRIA) before putting the system into use.' },
    ],
    memo: 'As the provider of a high-risk system, Northwind would need to operate a continuous risk-management system under Article 9 of the AI Act across the lifecycle of TalentMatch. A fundamental rights impact assessment under Article 27 is required only for defined categories of deployer; Northwind should confirm whether it falls within Article 27’s scope, while noting that a GDPR DPIA under Article 35 is in any event required and can be coordinated with any FRIA to avoid duplicative work.',
  },

  'aiact-14': {
    regime: 'EU AI Act', cite: 'Art 14', status: 'amber',
    title: 'Human oversight',
    regStatus: AIACT_DEFERRAL,
    citation: '— EU AI Act Art 14 · EUR-Lex, checked 7 Jun 2026',
    body: [
      { h: 'Article 14 — Human oversight.' },
      { t: 'High-risk AI systems shall be designed and developed in such a way, including with appropriate human-machine interface tools, that they can be effectively overseen by natural persons during the period in which they are in use.' },
      { t: 'Oversight measures shall enable the persons to whom human oversight is assigned to understand the system’s capacities and limitations, remain aware of automation bias, correctly interpret the output, and decide not to use the system or otherwise to override, reverse or disregard its output.' },
    ],
    memo: 'Article 14 of the AI Act requires that TalentMatch, as a high-risk system, be designed so that a natural person can effectively oversee it — understanding its limitations, guarding against automation bias, and retaining the ability to override or disregard its output. This complements, but is distinct from, the Article 22(3) GDPR right to human intervention; both should be satisfied through a documented human-in-the-loop review of every adverse hiring decision.',
  },

  'aiact-50': {
    regime: 'EU AI Act', cite: 'Art 50', status: 'amber',
    title: 'Transparency / deployer duties',
    regStatus: AIACT_DEFERRAL,
    citation: '— EU AI Act Art 50 · EUR-Lex, checked 7 Jun 2026',
    body: [
      { h: 'Article 50 — Transparency obligations for providers and deployers of certain AI systems.' },
      { t: 'Providers and deployers of certain AI systems are subject to transparency duties — for example, ensuring that natural persons are informed when they are interacting with an AI system, and that certain AI-generated or manipulated content is marked as such.' },
      { t: 'Deployer transparency duties under Article 50 sit alongside, and do not displace, the candidate-facing information duties under Articles 13–14 GDPR.' },
    ],
    memo: 'To the extent TalentMatch interacts directly with candidates, Article 50 of the AI Act imposes transparency duties — at minimum, informing candidates that they are interacting with an AI system. These duties run in parallel with the GDPR Articles 13–14 information obligations and should be addressed together in the candidate-facing notice rather than treated as alternatives.',
  },

  'aiact-5': {
    regime: 'EU AI Act', cite: 'Art 5(1)(f)', status: 'red',
    title: 'Emotion recognition in the workplace — prohibited',
    regStatus: AIACT_PROHIBITED,
    citation: '— EU AI Act Art 5(1)(f) · EUR-Lex, checked 7 Jun 2026',
    body: [
      { h: 'Article 5 — Prohibited AI practices.' },
      { t: '1. The following AI practices shall be prohibited: …' },
      { t: '(f) the placing on the market, the putting into service for this specific purpose, or the use of AI systems to infer emotions of a natural person in the areas of workplace and education institutions, except where the use of the AI system is intended to be put in place or into the market for medical or safety reasons.' },
    ],
    memo: 'If TalentMatch infers candidates’ emotional states — for example from video interviews, voice analysis, or facial expression — that functionality is a prohibited practice under Article 5(1)(f) of the EU AI Act in the employment context, subject only to narrow medical or safety exceptions that do not apply to hiring. Unlike the high-risk obligations, this prohibition has been in force since 2 February 2025 and is not subject to any deferral. Northwind should obtain written confirmation from the vendor that TalentMatch performs no emotion inference in any EU-facing configuration.',
    diligence: [
      'Does TalentMatch infer emotion from video, voice, or facial expression?',
      'Can any emotion-recognition feature be disabled for EU candidates?',
      'Has the vendor confirmed in writing the absence of emotion inference?',
      'Do any medical or safety exceptions conceivably apply? (They do not in hiring.)',
    ],
  },

  'aiact-10': {
    regime: 'EU AI Act', cite: 'Art 10', status: 'amber',
    title: 'Data and data governance',
    regStatus: AIACT_DEFERRAL,
    citation: '— EU AI Act Art 10 · EUR-Lex, checked 7 Jun 2026',
    body: [
      { h: 'Article 10 — Data and data governance.' },
      { t: 'High-risk AI systems which make use of techniques involving the training of models with data shall be developed on the basis of training, validation and testing data sets that meet the quality criteria set out in this Article.' },
      { t: 'Such data sets shall be subject to appropriate data-governance and management practices, including examination in view of possible biases that are likely to affect the health and safety of persons, have a negative impact on fundamental rights, or lead to discrimination. To the extent strictly necessary, providers may process special categories of personal data for the purpose of ensuring bias detection and correction, subject to appropriate safeguards (Art 10(5)).' },
    ],
    memo: 'Article 10 of the AI Act requires that the data sets used to train and test TalentMatch meet quality criteria and be examined for biases that could lead to discrimination against candidates. Article 10(5) permits the processing of special-category data strictly for the purpose of bias detection and correction, subject to safeguards — a basis that should be reconciled with the Article 9 GDPR analysis rather than treated as a standalone authorisation to process protected characteristics.',
  },
};

// Overlap matrix: one themed row per obligation, two chips per row.
const MATRIX = [
  {
    theme: 'Automated decisions on candidates',
    gdpr: { itemId: 'gdpr-22', label: 'Art 22' },
    aiact: { itemId: 'aiact-annex3', label: 'High-risk, Annex III' },
  },
  {
    theme: 'Impact assessment',
    gdpr: { itemId: 'gdpr-35', label: 'DPIA, Art 35' },
    aiact: { itemId: 'aiact-9-27', label: 'Risk mgmt Art 9 / FRIA Art 27' },
  },
  {
    theme: 'Human oversight',
    gdpr: { itemId: 'gdpr-22', label: 'Art 22 safeguards' },
    aiact: { itemId: 'aiact-14', label: 'Art 14' },
  },
  {
    theme: 'Transparency to candidates',
    gdpr: { itemId: 'gdpr-13-14', label: 'Arts 13–14' },
    aiact: { itemId: 'aiact-50', label: 'Art 50 / deployer duties' },
  },
  {
    theme: 'Emotion recognition in hiring',
    gdpr: { itemId: 'gdpr-9', label: 'Art 9 special category' },
    aiact: { itemId: 'aiact-5', label: 'Art 5 PROHIBITED' },
  },
  {
    theme: 'Special-category inference',
    gdpr: { itemId: 'gdpr-9', label: 'Art 9' },
    aiact: { itemId: 'aiact-10', label: 'Data governance Art 10' },
  },
];

const INSERT_LABELS = { provision: 'Provision text', memo: 'Memo paragraph', diligence: 'Diligence questions' };

// Scoped search index — keywords let common queries land on the right in-scope
// article. Search is a delivery mechanism for the trust layer, not a new corpus.
const KEYWORDS = {
  'gdpr-22': ['automated decision', 'profiling', 'solely', 'human intervention', 'contest', 'safeguards', 'art 22'],
  'gdpr-35': ['dpia', 'impact assessment', 'high risk', 'records of processing', 'art 30', 'accountability', 'prior consultation', 'art 35', 'art 36'],
  'gdpr-13-14': ['transparency', 'privacy notice', 'information', 'logic involved', 'right to information', 'art 13', 'art 14'],
  'gdpr-9': ['special category', 'sensitive data', 'health', 'biometric', 'ethnicity', 'discrimination', 'art 9'],
  'aiact-annex3': ['high-risk', 'high risk', 'annex iii', 'recruitment', 'provider', 'deployer', 'conformity', 'chapter iii', 'art 6', 'art 26'],
  'aiact-9-27': ['risk management', 'fria', 'fundamental rights', 'impact assessment', 'art 27'],
  'aiact-14': ['human oversight', 'automation bias', 'override', 'human in the loop'],
  'aiact-50': ['transparency', 'disclosure', 'inform candidates', 'deployer duties', 'art 50'],
  'aiact-5': ['emotion recognition', 'emotion', 'prohibited', 'prohibition', 'banned', 'fines', 'penalties', 'enforcement', 'workplace'],
  'aiact-10': ['data governance', 'bias', 'training data', 'data quality', 'discrimination'],
};

// Known-but-deliberately-out-of-scope regimes: matching one shows the boundary
// card, never a blank state.
const OUT_OF_SCOPE = ['DSA', 'DMA', 'NIS2', 'ePrivacy', 'Data Act', 'CRA', 'MiCA'];

const SEARCH_INDEX = Object.entries(ITEMS).map(([id, it]) => ({
  id,
  hay: `${it.regime} ${it.cite} ${it.title} ${(KEYWORDS[id] || []).join(' ')}`.toLowerCase(),
}));

// ── Memo ⇄ matrix linking ("EU Lens") ───────────────────────────────────────
// A matrix cell is addressed by `${rowIndex}-gdpr|aiact`. Each sparse memo
// anchor maps to one or more cells; status is read from the underlying item.
const CELL_INDEX = {};
MATRIX.forEach((row, i) => {
  CELL_INDEX[`${i}-gdpr`] = row.gdpr.itemId;
  CELL_INDEX[`${i}-aiact`] = row.aiact.itemId;
});

const STATUS_WORD = { green: 'in force', amber: 'contested · not yet adopted', red: 'prohibited' };

// Exactly five live anchors. Each carries the inline display label per linked
// regime; the settled-ness word is derived from the cell's item status.
const ANCHORS = {
  auto: { cells: [
    { cellId: '0-gdpr', label: 'GDPR Art 22' },
    { cellId: '0-aiact', label: 'AI Act high-risk' },
    { cellId: '2-aiact', label: 'AI Act human oversight' },
  ] },
  infer: { cells: [
    { cellId: '5-gdpr', label: 'GDPR Art 9' },
    { cellId: '5-aiact', label: 'AI Act data governance' },
  ] },
  dpia: { cells: [
    { cellId: '1-gdpr', label: 'GDPR Art 35' },
  ] },
  notice: { cells: [
    { cellId: '3-gdpr', label: 'GDPR Arts 13–14' },
    { cellId: '3-aiact', label: 'AI Act Art 50' },
  ] },
  emotion: { cells: [
    { cellId: '4-aiact', label: 'AI Act Art 5' },
    { cellId: '4-gdpr', label: 'GDPR Art 9' },
  ] },
};

// Reverse index: which anchor(s) reference a given cell (panel → document).
const ANCHOR_BY_CELL = {};
Object.entries(ANCHORS).forEach(([aid, a]) => a.cells.forEach(c => {
  (ANCHOR_BY_CELL[c.cellId] = ANCHOR_BY_CELL[c.cellId] || []).push(aid);
}));

const anchorTags = (id) => ANCHORS[id].cells.map(c => {
  const status = ITEMS[CELL_INDEX[c.cellId]].status;
  return { label: c.label, status, word: STATUS_WORD[status] };
});

// Inline trust-status pill shown next to an active anchor.
function StatusTag({ label, status, word }) {
  const tone = STATUS[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: '"Segoe UI", sans-serif',
      fontSize: 10.5, lineHeight: 1.4, color: tone.text, background: tone.bg, border: `1px solid ${tone.border}`,
      borderRadius: 999, padding: '1px 8px', margin: '0 2px', verticalAlign: 'middle', whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: tone.text }} />
      {label} — {word}
    </span>
  );
}

// A live anchor in the lawyer's prose: faint dotted blue underline at rest;
// emphasised when active (document → panel) or linked (panel → document).
function Anchor({ active, linked, onClick, onEnter, onLeave, tags, children }) {
  return (
    <>
      <span
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        style={{
          cursor: 'pointer',
          textDecoration: 'underline', textDecorationStyle: 'dotted', textDecorationColor: BLUE,
          textUnderlineOffset: '3px', color: active ? BLUE : 'inherit',
          background: active ? '#EAF1FB' : linked ? '#F3F8FD' : 'transparent',
          borderRadius: 3, padding: (active || linked) ? '0 2px' : 0,
          WebkitBoxDecorationBreak: 'clone', boxDecorationBreak: 'clone',
          transition: 'background 140ms ease',
        }}
      >{children}</span>
      {active && tags && tags.length > 0 && (
        <span>{' '}{tags.map((t, i) => <StatusTag key={i} {...t} />)}</span>
      )}
    </>
  );
}

// ── Word chrome helpers (unchanged) ─────────────────────────────────────────
const WordLogo = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
    <rect x="1" y="2" width="18" height="16" rx="2" fill={BLUE} />
    <text x="10" y="14.5" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fontWeight="700" fill="#fff">W</text>
  </svg>
);

function RibbonTab({ label, active, accent }) {
  return (
    <div style={{
      padding: '7px 11px', fontSize: 13, color: accent ? '#fff' : active ? BLUE : '#444',
      background: accent ? BLUE : 'transparent', borderRadius: accent ? 3 : 0,
      fontWeight: active ? 600 : 400, borderBottom: active && !accent ? `2.5px solid ${BLUE}` : '2.5px solid transparent',
      whiteSpace: 'nowrap',
    }}>{label}</div>
  );
}

// The small diagonal "dialog launcher" arrow real Word groups carry, bottom-right.
const DialogLauncher = () => (
  <svg width="9" height="9" viewBox="0 0 10 10" style={{ marginLeft: 4, opacity: 0.55 }} aria-hidden>
    <path d="M2 2 L8 8" stroke="#605E5C" strokeWidth="1.2" />
    <path d="M8 4.6 L8 8 L4.6 8" stroke="#605E5C" strokeWidth="1.2" fill="none" />
  </svg>
);

function RibbonGroup({ label, children, launcher }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 10px', borderRight: '1px solid #E1DFDD' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, padding: '6px 0' }}>{children}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10.5, color: '#605E5C', paddingBottom: 3 }}>
        {label}{launcher && <DialogLauncher />}
      </div>
    </div>
  );
}

const IconBtn = ({ children }) => (<div style={{ padding: 4, borderRadius: 3, color: '#444', display: 'flex' }}>{children}</div>);

// Quick Access Toolbar button (title bar, top-left).
const QatBtn = ({ children }) => (<div style={{ padding: 3, borderRadius: 3, color: '#444', display: 'flex', cursor: 'default' }}>{children}</div>);

// ── Trust signals ───────────────────────────────────────────────────────────
function VerifiedBadge() {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, lineHeight: 1.4,
      color: GREEN, background: '#F1F8F1', border: `1px solid #C8E6C9`, borderRadius: 6, padding: '8px 11px',
    }}>
      <Check size={14} strokeWidth={3} style={{ marginTop: 1, flexShrink: 0 }} />
      <span><b style={{ fontWeight: 600 }}>Official text</b> · EUR-Lex consolidated · checked 7 Jun 2026</span>
    </div>
  );
}

function RegStatusBadge({ status }) {
  if (status.kind === 'grey') {
    return (
      <div style={{ fontSize: 11.5, lineHeight: 1.5, color: '#605E5C', padding: '2px 1px' }}>
        {status.text}
      </div>
    );
  }
  const tone = status.kind === 'red' ? STATUS.red : STATUS.amber;
  return (
    <div style={{
      background: tone.bg, border: `1px solid ${tone.border}`, borderRadius: 6, padding: '9px 11px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
        <AlertTriangle size={13} strokeWidth={2.4} color={tone.text} style={{ flexShrink: 0 }} />
        <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: tone.text }}>
          {status.header}
        </span>
      </div>
      <div style={{ fontSize: 12, lineHeight: 1.5, color: '#3a3a3a' }}>{status.text}</div>
    </div>
  );
}

// ── Inserted document block ─────────────────────────────────────────────────
function InsertedBlock({ block }) {
  const item = ITEMS[block.itemId];
  let inner;
  if (block.type === 'provision') {
    inner = item.body.map((seg, i) => seg.h
      ? <p key={i} style={{ margin: '0 0 9px', fontWeight: 700, fontSize: 14.5 }}>{seg.h}</p>
      : <p key={i} style={{ margin: '0 0 9px', textAlign: 'justify', fontSize: 13.5, lineHeight: 1.5 }}>{seg.t}</p>);
  } else if (block.type === 'memo') {
    inner = <p style={{ margin: 0, textAlign: 'justify', fontSize: 14.5, lineHeight: 1.55 }}>{item.memo}</p>;
  } else {
    inner = (
      <div>
        <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 9 }}>Diligence questions</div>
        {item.diligence.map((q, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginBottom: 8 }}>
            <span style={{ width: 13, height: 13, border: `1.5px solid ${BLUE}`, borderRadius: 2, flexShrink: 0, marginTop: 4 }} />
            <span style={{ fontSize: 14, lineHeight: 1.5 }}>{q}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div style={{ margin: '18px 0', animation: 'wp-slide 320ms ease-out both' }}>
      <div style={{ background: '#F4F8FC', borderLeft: `3px solid ${BLUE}`, borderRadius: '0 4px 4px 0', padding: '14px 18px' }}>
        {inner}
        <div style={{ marginTop: 11, fontFamily: '"Segoe UI", sans-serif', fontSize: 11.5, fontStyle: 'italic', color: BLUE }}>
          {item.citation}
        </div>
      </div>
    </div>
  );
}

// ── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [panel, setPanel] = useState('closed'); // 'closed' | 'matrix' | 'reading'
  const [activeId, setActiveId] = useState(null);
  const [blocks, setBlocks] = useState([]); // { key, type, itemId }
  const [query, setQuery] = useState('');
  const [activeLink, setActiveLink] = useState(null); // { source:'doc'|'panel', anchorId, cellIds, cellId, locked }

  const q = query.trim().toLowerCase();
  const matches = useMemo(() => (q ? SEARCH_INDEX.filter(e => e.hay.includes(q)).map(e => e.id) : []), [q]);
  const knownOutOfScope = q ? OUT_OF_SCOPE.some(t => q.includes(t.toLowerCase())) : false;
  const results = knownOutOfScope ? [] : matches;

  const openMatrix = () => setPanel('matrix');
  const read = (itemId) => { setActiveId(itemId); setPanel('reading'); };
  const onSearchKey = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); if (results.length) read(results[0]); }
    else if (e.key === 'Escape') { e.preventDefault(); setQuery(''); }
  };
  const insert = (type) => {
    setBlocks(b => [...b, { key: `${activeId}-${type}-${Date.now()}`, type, itemId: activeId }]);
    setPanel('closed');
  };
  const reset = () => { setBlocks([]); setPanel('closed'); setActiveId(null); setQuery(''); setActiveLink(null); };

  // ── Memo ⇄ matrix linking ──
  const clickAnchor = (id) => {
    setActiveLink({ source: 'doc', anchorId: id, cellIds: ANCHORS[id].cells.map(c => c.cellId), locked: true });
    setPanel(p => (p === 'reading' || p === 'closed') ? 'matrix' : p);
  };
  const enterAnchor = (id) => setActiveLink(prev => prev?.locked ? prev
    : { source: 'doc', anchorId: id, cellIds: ANCHORS[id].cells.map(c => c.cellId), locked: false });
  const enterCell = (cellId) => setActiveLink(prev => prev?.locked ? prev : { source: 'panel', cellId, locked: false });
  const leaveLink = () => setActiveLink(prev => prev?.locked ? prev : null);
  const clearLink = () => setActiveLink(null);

  const activeCells = activeLink ? (activeLink.source === 'doc' ? activeLink.cellIds : [activeLink.cellId]) : [];
  const isCellActive = (id) => activeCells.includes(id);
  const isCellDim = (id) => activeLink?.source === 'doc' && !activeCells.includes(id);
  const anchorProps = (id) => ({
    active: activeLink?.source === 'doc' && activeLink.anchorId === id,
    linked: activeLink?.source === 'panel' && (ANCHOR_BY_CELL[activeLink.cellId] || []).includes(id),
    onClick: () => clickAnchor(id),
    onEnter: () => enterAnchor(id),
    onLeave: leaveLink,
    tags: anchorTags(id),
  });

  // When an anchor activates, bring its first linked cell into view.
  useEffect(() => {
    if (activeLink?.source === 'doc' && activeLink.cellIds?.length) {
      const el = document.querySelector(`[data-cell="${activeLink.cellIds[0]}"]`);
      if (el) el.scrollIntoView({ block: 'nearest' });
    }
  }, [activeLink]);

  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (panel === 'closed') {
        if (e.key === '/') { e.preventDefault(); openMatrix(); }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setPanel(panel === 'reading' ? 'matrix' : 'closed');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [panel]);

  const item = activeId ? ITEMS[activeId] : null;
  const hasInserts = blocks.length > 0;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh', minHeight: 680, minWidth: 1100,
      background: '#E7E7E7', fontFamily: '"Segoe UI", "Segoe UI Web (West European)", system-ui, sans-serif', color: '#252525', overflow: 'hidden',
    }}>
      <style>{`
        * { box-sizing: border-box; } body { margin: 0; }
        @keyframes wp-blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        @keyframes wp-slide { from{opacity:0; transform:translateY(8px)} to{opacity:1; transform:translateY(0)} }
        @keyframes wp-fade { from{opacity:0} to{opacity:1} }
        @keyframes wp-panel { from{transform:translateX(20px); opacity:0} to{transform:translateX(0); opacity:1} }
        ::-webkit-scrollbar { width: 14px; }
        ::-webkit-scrollbar-thumb { background: #C8C6C4; border: 4px solid #E7E7E7; border-radius: 8px; }
      `}</style>

      {/* Title bar */}
      <div style={{ background: '#F3F2F1', height: 38, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', borderBottom: '1px solid #EDEBE9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <WordLogo />
          {/* Quick Access Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <QatBtn><Save size={14} strokeWidth={1.7} /></QatBtn>
            <QatBtn><Undo2 size={14} strokeWidth={1.7} /></QatBtn>
            <QatBtn><Redo2 size={14} strokeWidth={1.7} /></QatBtn>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#605E5C', marginLeft: 4 }}>
            <span style={{ width: 30, height: 16, background: BLUE, borderRadius: 999, position: 'relative', display: 'inline-block' }}>
              <span style={{ position: 'absolute', right: 2, top: 2, width: 12, height: 12, borderRadius: 999, background: '#fff' }} />
            </span>AutoSave
          </div>
        </div>
        <div style={{ fontSize: 13, color: '#323130', fontWeight: 600 }}>
          Northwind — EU Launch Memo.docx<span style={{ fontWeight: 400, color: '#605E5C' }}> — Saved to OneDrive</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#605E5C' }}>
          {/* Editing mode dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: '#444' }}>
            <Pencil size={13} /> Editing <ChevronDown size={12} />
          </div>
          {/* Share */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#444', border: '1px solid #D2D0CE', borderRadius: 4, padding: '3px 10px', background: '#fff' }}>
            <Share2 size={13} /> Share
          </div>
          {/* Window controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginLeft: 2 }}>
            <Minus size={14} /><Square size={11} /><X size={15} />
          </div>
        </div>
      </div>

      {/* Ribbon tabs */}
      <div style={{ background: '#FAF9F8', display: 'flex', alignItems: 'center', gap: 2, padding: '0 8px', borderBottom: '1px solid #EDEBE9' }}>
        <RibbonTab label="File" accent /><RibbonTab label="Home" active />
        {['Insert', 'Draw', 'Design', 'Layout', 'References', 'Review', 'View', 'Help'].map(t => <RibbonTab key={t} label={t} />)}
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid #E1DFDD', borderRadius: 3, padding: '4px 10px', width: 220, color: '#605E5C', fontSize: 12.5, marginRight: 4 }}>
          <Search size={13} /> Search
        </div>
      </div>

      {/* Ribbon body */}
      <div style={{ background: '#FFFFFF', display: 'flex', alignItems: 'stretch', padding: '4px 6px', borderBottom: '1px solid #E1DFDD', height: 86 }}>
        <RibbonGroup label="Clipboard" launcher>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 11, color: '#444' }}>
            <Clipboard size={22} strokeWidth={1.4} color={BLUE} /><span>Paste</span>
          </div>
        </RibbonGroup>
        <RibbonGroup label="Font" launcher>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              <div style={{ border: '1px solid #D2D0CE', borderRadius: 2, padding: '2px 6px', fontSize: 12, width: 124, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>Times New Roman <ChevronDown size={11} /></div>
              <div style={{ border: '1px solid #D2D0CE', borderRadius: 2, padding: '2px 6px', fontSize: 12, width: 42, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>12 <ChevronDown size={11} /></div>
            </div>
            <div style={{ display: 'flex', gap: 2 }}>
              <IconBtn><Bold size={15} /></IconBtn><IconBtn><Italic size={15} /></IconBtn><IconBtn><Underline size={15} /></IconBtn>
            </div>
          </div>
        </RibbonGroup>
        <RibbonGroup label="Paragraph" launcher>
          <IconBtn><List size={16} /></IconBtn><IconBtn><ListOrdered size={16} /></IconBtn>
          <IconBtn><AlignLeft size={16} /></IconBtn><IconBtn><AlignCenter size={16} /></IconBtn>
        </RibbonGroup>
        <RibbonGroup label="Styles">
          {['Normal', 'No Spacing', 'Heading 1'].map((s, i) => (
            <div key={s} style={{ border: '1px solid #E1DFDD', borderRadius: 2, padding: '6px 10px', fontSize: 12, color: i === 0 ? BLUE : '#252525', background: i === 0 ? '#F3F8FD' : '#fff', minWidth: 58, textAlign: 'center', fontWeight: i === 2 ? 600 : 400 }}>{s}</div>
          ))}
        </RibbonGroup>
        {/* Add-in group */}
        <RibbonGroup label="EU Regulatory Layer">
          <button onClick={openMatrix} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, cursor: 'pointer',
            border: '1px solid #C7DAF0', background: panel !== 'closed' ? '#E4EFFB' : '#F3F8FD', borderRadius: 4, padding: '4px 12px', color: BLUE,
          }}>
            <Scale size={18} strokeWidth={1.6} />
            <span style={{ fontSize: 11.5, fontWeight: 600 }}>EU Layer</span>
            <span style={{ fontSize: 10, color: '#605E5C' }}>read or insert · /</span>
          </button>
        </RibbonGroup>
      </div>

      {/* Body: document + task pane */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Document canvas — align-items: flex-start so a page taller than the
            viewport grows downward (and scrolls) instead of being clipped/stretched */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 0 60px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          <div onClick={clearLink} style={{
            width: 720, background: '#fff', border: '1px solid #D9D9D9', boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
            padding: '78px 86px 96px', minHeight: 900, fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 15, lineHeight: 1.6, color: '#1a1a1a',
          }}>
            <div style={{ fontWeight: 700, fontSize: 19, letterSpacing: '0.06em', marginBottom: 16 }}>
              MEMORANDUM
            </div>
            <div style={{ fontFamily: '"Segoe UI", sans-serif', fontSize: 12, color: '#605E5C', lineHeight: 1.6, paddingBottom: 16, marginBottom: 22, borderBottom: '1px solid #E6E6E6' }}>
              <div><b style={{ color: '#3a3a3a', fontWeight: 600 }}>To:</b>&nbsp;&nbsp;General Counsel, Northwind Labs, Inc. (Delaware)</div>
              <div style={{ display: 'flex' }}>
                <b style={{ color: '#3a3a3a', fontWeight: 600, flexShrink: 0 }}>Re:</b>
                <span style={{ marginLeft: 8 }}>GDPR and EU AI Act implications of launching the &ldquo;TalentMatch&rdquo; AI hiring feature in the European Union</span>
              </div>
              <div><b style={{ color: '#3a3a3a', fontWeight: 600 }}>Date:</b>&nbsp;7 June 2026</div>
            </div>

            <p style={{ margin: '0 0 16px', textAlign: 'justify' }}>
              Northwind Labs, Inc. proposes to launch &ldquo;TalentMatch&rdquo;, an AI-assisted hiring feature that screens, ranks
              and shortlists candidates, to users in the European Union. You have asked for an assessment of the principal
              obligations the launch would trigger under EU law, and in particular whether the feature may be deployed in
              its current form.
            </p>
            <p style={{ margin: '0 0 16px', textAlign: 'justify' }}>
              On the present design,{' '}
              <Anchor {...anchorProps('auto')}>candidates are screened and ranked automatically, without individual human review</Anchor>;
              to produce those rankings,{' '}
              <Anchor {...anchorProps('infer')}>the model may infer characteristics such as gender, ethnicity or health</Anchor>{' '}
              from their CVs and recorded responses. As matters stand,{' '}
              <Anchor {...anchorProps('dpia')}>no data protection impact assessment has yet been carried out</Anchor>, and{' '}
              <Anchor {...anchorProps('notice')}>candidates are not currently told that an automated system evaluates them</Anchor>.
              Separately,{' '}
              <Anchor {...anchorProps('emotion')}>an optional module scores candidates&rsquo; facial expressions during video interviews</Anchor>.
            </p>
            <p style={{ margin: '0 0 16px', textAlign: 'justify' }}>
              Two regimes apply in parallel and must be analysed together. The General Data Protection Regulation governs
              the processing of candidates&rsquo; personal data, including the rules on automated decision-making and on special
              categories of data. The EU Artificial Intelligence Act governs the system itself, classifying AI used to evaluate
              job applicants as &ldquo;high-risk&rdquo; and prohibiting certain uses outright. The two regimes overlap but are not
              coextensive, and compliance with one does not establish compliance with the other.
            </p>
            <p style={{ margin: '0 0 4px', textAlign: 'justify' }}>
              This memorandum maps the launch against both regimes, flags the obligations whose timing is presently in flux,
              and identifies the diligence required before a go/no-go decision. The key obligations under each regime are set
              out below.
              <span style={{ display: 'inline-block', width: 1.5, height: 17, background: '#000', verticalAlign: 'middle', marginLeft: 2, animation: 'wp-blink 1.05s steps(1) infinite' }} />
              {panel === 'closed' && !hasInserts && (
                <span style={{ marginLeft: 10, fontFamily: '"Segoe UI", sans-serif', fontSize: 12, color: '#8A8886', fontStyle: 'italic', verticalAlign: 'middle' }}>
                  press <b style={{ fontStyle: 'normal', color: BLUE }}>/</b> to open the EU Regulatory Layer
                </span>
              )}
            </p>

            {blocks.map(b => <InsertedBlock key={b.key} block={b} />)}
          </div>
        </div>

        {/* Task pane — EU Regulatory Layer */}
        {panel !== 'closed' && (
          <div style={{
            width: 380, background: '#fff', borderLeft: '1px solid #E1DFDD', display: 'flex', flexDirection: 'column',
            animation: 'wp-panel 200ms ease-out', fontFamily: '"Segoe UI", sans-serif',
          }}>
            {/* Office add-in pane strip (Word-rendered chrome) */}
            <div style={{ background: '#F3F2F1', borderBottom: '1px solid #E1DFDD', height: 34, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px 0 14px' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#444' }}>EU Regulatory Layer</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#605E5C' }}>
                <MoreHorizontal size={16} style={{ cursor: 'pointer' }} />
                <X size={15} style={{ cursor: 'pointer' }} onClick={() => setPanel('closed')} />
              </div>
            </div>
            {/* Pane header (navy/graphite) */}
            <div style={{ background: NAVY, padding: '12px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: '#fff' }}>
                <ShieldCheck size={16} color="#fff" /> EU Regulatory Layer
              </div>
              <div style={{ fontSize: 11.5, color: '#AEB6C2', marginTop: 3 }}>TalentMatch · AI hiring · EU launch</div>
            </div>

            {/* (a) MATRIX */}
            {panel === 'matrix' && (
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
                {/* Scoped search — quiet secondary fallback; matrix still leads below */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 7, border: '1px solid #E1DFDD', borderRadius: 5,
                  padding: '6px 9px', background: '#FAFAFA', marginBottom: q ? 10 : 14,
                }}>
                  <Search size={13} color="#A19F9D" />
                  <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={onSearchKey}
                    placeholder="Look up a GDPR or AI Act article"
                    style={{ flex: 1, border: 'none', outline: 'none', fontSize: 12.5, background: 'transparent', fontFamily: 'inherit', color: '#323130' }}
                  />
                  {q && <X size={13} color="#A19F9D" style={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => setQuery('')} />}
                </div>

                {activeLink?.locked && (
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 12, padding: '7px 10px', background: '#EAF1FB', border: '1px solid #C7DAF0', borderRadius: 5,
                  }}>
                    <span style={{ fontSize: 11.5, color: BLUE, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <Link2 size={12} /> Linked from the memo
                    </span>
                    <button onClick={clearLink} style={{ background: 'transparent', border: 'none', color: BLUE, fontSize: 11.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Clear</button>
                  </div>
                )}

                {q && (
                  <div style={{ marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid #EDEBE9' }}>
                    {results.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {results.map(id => {
                          const it = ITEMS[id]; const tone = STATUS[it.status];
                          return (
                            <button key={id} onClick={() => read(id)} style={{
                              display: 'flex', alignItems: 'center', gap: 9, textAlign: 'left', cursor: 'pointer',
                              background: '#fff', border: '1px solid #E1DFDD', borderRadius: 5, padding: '8px 10px', fontFamily: 'inherit', width: '100%',
                            }}>
                              <span style={{ width: 7, height: 7, borderRadius: 999, background: tone.text, flexShrink: 0 }} />
                              <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                <span style={{ fontSize: 11, color: tone.text, fontWeight: 600 }}>{it.regime} · {it.cite}</span>
                                <span style={{ fontSize: 12.5, color: '#323130', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.title}</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{ background: '#F3F2F1', border: '1px solid #E1DFDD', borderRadius: 6, padding: '12px 13px', lineHeight: 1.55 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: '#323130', marginBottom: 5 }}>
                          EU Layer currently covers the GDPR and the EU AI Act in depth.
                        </div>
                        <div style={{ fontSize: 12, color: '#605E5C' }}>
                          &ldquo;{query.trim()}&rdquo; isn&rsquo;t in scope yet — covering it shallowly would undercut the
                          currentness guarantee on the two regulations we do maintain.
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', color: '#605E5C', textTransform: 'uppercase' }}>GDPR</div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', color: '#605E5C', textTransform: 'uppercase' }}>EU AI Act</div>
                </div>
                {MATRIX.map((row, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, color: '#8A8886', marginBottom: 5 }}>{row.theme}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, alignItems: 'stretch' }}>
                      <MatrixChip cell={row.gdpr} cellId={`${i}-gdpr`} onClick={read}
                        active={isCellActive(`${i}-gdpr`)} dim={isCellDim(`${i}-gdpr`)}
                        onEnter={() => enterCell(`${i}-gdpr`)} onLeave={leaveLink} />
                      <MatrixChip cell={row.aiact} cellId={`${i}-aiact`} onClick={read}
                        active={isCellActive(`${i}-aiact`)} dim={isCellDim(`${i}-aiact`)}
                        onEnter={() => enterCell(`${i}-aiact`)} onLeave={leaveLink} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 6, paddingTop: 10, borderTop: '1px solid #EDEBE9', fontSize: 11, color: '#8A8886', lineHeight: 1.5 }}>
                  Green = in force · Amber = applicability contested · Red = prohibited.
                </div>
              </div>
            )}

            {/* (b) READING VIEW */}
            {panel === 'reading' && item && (
              <>
                <div style={{ padding: '12px 16px 0' }}>
                  <div onClick={() => setPanel('matrix')} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: BLUE, cursor: 'pointer', marginBottom: 10 }}>
                    <ChevronLeft size={13} /> Overlap matrix
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', color: STATUS[item.status].text, textTransform: 'uppercase' }}>{item.regime}</span>
                    <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12.5, color: '#323130' }}>{item.cite}</span>
                  </div>
                  <div style={{ fontSize: 14, color: '#1a1a1a', fontWeight: 600, margin: '3px 0 12px' }}>{item.title}</div>
                </div>

                {/* Trust signals */}
                <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 12 }}>
                  <VerifiedBadge />
                  {item.regStatus && <RegStatusBadge status={item.regStatus} />}
                </div>

                {/* Provision text */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 14px', fontFamily: 'Georgia, serif', fontSize: 13.5, lineHeight: 1.55, color: '#1a1a1a', borderTop: '1px solid #EDEBE9', paddingTop: 14 }}>
                  {item.body.map((seg, i) => seg.h
                    ? <p key={i} style={{ margin: '0 0 10px', fontWeight: 700 }}>{seg.h}</p>
                    : <p key={i} style={{ margin: '0 0 10px', textAlign: 'justify' }}>{seg.t}</p>)}
                </div>

                {/* Insert control */}
                <div style={{ padding: 14, borderTop: '1px solid #EDEBE9' }}>
                  <div style={{ fontSize: 11, color: '#605E5C', marginBottom: 8 }}>Insert into memo</div>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                    {['provision', 'memo', 'diligence'].filter(t => t === 'provision' || item[t]).map(t => (
                      <button key={t} onClick={() => insert(t)} style={{
                        flex: 1, background: '#F3F8FD', color: BLUE, border: '1px solid #C7DAF0', borderRadius: 4,
                        padding: '8px 6px', fontSize: 11.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1.25,
                      }}>{INSERT_LABELS[t]}</button>
                    ))}
                  </div>
                  <button onClick={() => setPanel('closed')} style={{
                    width: '100%', background: '#fff', color: '#323130', border: '1px solid #D2D0CE', borderRadius: 4,
                    padding: '8px 12px', fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit',
                  }}>Close</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Status bar — current Word: light grey, dark text */}
      <div style={{ background: '#F3F2F1', color: '#444', height: 26, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', fontSize: 11.5, borderTop: '1px solid #E1DFDD' }}>
        <span>Page 1 of 1 · English (UK){hasInserts ? ` · ${blocks.length} inserted` : ''}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {hasInserts && (
            <button onClick={reset} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#EDEBE9', border: '1px solid #D2D0CE', color: '#444', borderRadius: 4, padding: '1px 9px', cursor: 'pointer', fontSize: 11.5, fontFamily: 'inherit' }}>
              <RotateCcw size={11} /> Reset
            </button>
          )}
          {/* View icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, color: '#605E5C' }}>
            <BookOpen size={14} /><FileText size={14} /><Globe size={14} />
          </div>
          {/* Zoom control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#444' }}>
            <Minus size={12} color="#605E5C" />
            <div style={{ width: 64, height: 3, background: '#D2D0CE', borderRadius: 2, position: 'relative' }}>
              <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 8, height: 8, borderRadius: 999, background: '#605E5C' }} />
            </div>
            <Plus size={12} color="#605E5C" />
            <span style={{ minWidth: 32, textAlign: 'right' }}>100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Clickable matrix chip ------------------------------------------------------
function MatrixChip({ cell, cellId, onClick, active, dim, onEnter, onLeave }) {
  const item = ITEMS[cell.itemId];
  const tone = STATUS[item.status];
  return (
    <button data-cell={cellId} onClick={() => onClick(cell.itemId)} onMouseEnter={onEnter} onMouseLeave={onLeave} style={{
      display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer',
      background: tone.bg,
      border: active ? `1.5px solid ${BLUE}` : `1px solid ${tone.border}`,
      boxShadow: active ? '0 0 0 3px rgba(43,87,154,0.18)' : 'none',
      opacity: dim ? 0.4 : 1,
      transition: 'opacity 140ms ease, box-shadow 140ms ease, border-color 140ms ease',
      borderRadius: 6, padding: '8px 10px', fontFamily: 'inherit', height: '100%',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 7, height: 7, borderRadius: 999, background: tone.text, flexShrink: 0 }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: tone.text, lineHeight: 1.3 }}>{cell.label}</span>
      </div>
    </button>
  );
}
