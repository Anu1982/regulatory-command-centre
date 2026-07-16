/* ------------------------------------------------------------------ */
/*  Regulatory Intelligence AI Agent — front-end controller            */
/*                                                                     */
/*  Pure vanilla JS. No build step. Data is illustrative only.         */
/* ------------------------------------------------------------------ */

'use strict';

// -------------------------------------------------------------------
// Domain catalog (D1–D6) — mirrors the workshop slide.
// -------------------------------------------------------------------
const DOMAINS = [
    {
        id: 'D1',
        title: 'Patient Population',
        glyph: '⌘',
        tone: 'blue',
        summary: 'In/Ex criteria and biomarker fit versus label.',
    },
    {
        id: 'D2',
        title: 'Primary Endpoint',
        glyph: '◎',
        tone: 'purple',
        summary: 'Surrogate versus clinical; COA and PRO status.',
    },
    {
        id: 'D3',
        title: 'Statistical Design',
        glyph: 'Σ',
        tone: 'green',
        summary: 'Multiplicity, interim analyses, estimand framework.',
    },
    {
        id: 'D4',
        title: 'Comparator / Control',
        glyph: '⇄',
        tone: 'amber',
        summary: 'Standard of care, external and synthetic-control precedent.',
    },
    {
        id: 'D5',
        title: 'Innovative Design',
        glyph: '✦',
        tone: 'pink',
        summary: 'Adaptive, Bayesian, platform, and master-protocol elements.',
    },
    {
        id: 'D6',
        title: 'Safety Framework',
        glyph: '♥',
        tone: 'teal',
        summary: 'Monitoring plan, DSMB charter, stopping rules.',
    },
];

// -------------------------------------------------------------------
// Protocol sections — the actual document surface a regulatory writer
// works on. Each section is anchored to a D-domain so scores and
// recommendations connect directly to the language in the protocol.
// -------------------------------------------------------------------
const PROTOCOL_SECTIONS = [
    {
        id: 'sec-population',
        num: '4',
        title: 'Study Population',
        domain: 'D1',
        text:
            'Adults ≥ 18 years with histologically confirmed Stage IV NSCLC ' +
            'and PD-L1 CPS ≥ 1, no prior systemic therapy for advanced disease. ' +
            'ECOG performance status 0–1. Adequate organ function per protocol Appendix A.',
        suggested:
            'Restrict primary analysis to CPS ≥ 10 with hierarchical testing to ' +
            'all-comers (CPS ≥ 1). Rationale: aligns with three most recent FDA ' +
            'approvals and the Type C outcome on our sister asset.',
    },
    {
        id: 'sec-endpoints',
        num: '5',
        title: 'Objectives and Endpoints',
        domain: 'D2',
        text:
            'Primary endpoint: investigator-assessed Progression-Free Survival ' +
            '(PFS) per RECIST v1.1. Key secondary endpoints: Overall Survival (OS), ' +
            'Objective Response Rate (ORR), safety.',
        suggested:
            'Elevate Overall Survival (OS) to co-primary with a group-sequential ' +
            'design; keep BICR-adjudicated PFS as the key secondary. Rationale: ' +
            'four consecutive EMA CHMP opinions in this indication have required OS.',
    },
    {
        id: 'sec-design',
        num: '6',
        title: 'Study Design',
        domain: 'D5',
        text:
            'Randomised, open-label, active-controlled, two-arm Phase III trial ' +
            'with unblinded sample-size re-estimation at 60% information time.',
        suggested:
            'Add explicit Type-I-error preservation language (combination test) and ' +
            'define an independent DMC firewall in the SAP.',
    },
    {
        id: 'sec-comparator',
        num: '7',
        title: 'Investigational Product and Comparator',
        domain: 'D4',
        text:
            'Experimental arm: BI-042 200 mg Q3W. Control arm: external control ' +
            'constructed from Flatiron RWD cohort matched on 12 baseline covariates.',
        suggested:
            'Add a small internal randomised concurrent control (~40 patients) as ' +
            'sensitivity analysis, mirroring the EOP2 agreement on BI-0987.',
    },
    {
        id: 'sec-stats',
        num: '9',
        title: 'Statistical Considerations',
        domain: 'D3',
        text:
            'Estimand: treatment-policy strategy for discontinuation; hypothetical ' +
            'strategy for treatment switching. Multiplicity: graphical Bonferroni-based ' +
            'scheme with α = 0.025 (one-sided).',
        suggested:
            'No structural changes recommended. Add a while-on-treatment sensitivity ' +
            'estimand for the safety analysis.',
    },
    {
        id: 'sec-safety',
        num: '10',
        title: 'Safety and Data Monitoring',
        domain: 'D6',
        text:
            'Independent DSMB with pre-specified stopping rules for futility, ' +
            'efficacy, and unacceptable toxicity. AEs graded per NCI-CTCAE v5.',
        suggested:
            'No changes recommended. Charter is ready for submission.',
    },
];

// -------------------------------------------------------------------
// Regulatory milestones — the path a protocol travels through the
// agencies. Used to draw the horizontal timeline on the dashboard.
// -------------------------------------------------------------------
const MILESTONES = [
    { id: 'typeb',  label: 'Type B',   status: 'done',    when: 'Q4 2024' },
    { id: 'typec',  label: 'Type C',   status: 'done',    when: 'Q2 2025' },
    { id: 'eop2',   label: 'EOP2',     status: 'done',    when: 'Q4 2025' },
    { id: 'draft',  label: 'Draft protocol', status: 'current', when: 'Now' },
    { id: 'ind',    label: 'IND / CTA', status: 'upcoming', when: 'Q3 2026' },
    { id: 'fpi',    label: 'First-patient-in', status: 'upcoming', when: 'Q1 2027' },
    { id: 'readout', label: 'Primary readout', status: 'upcoming', when: 'H2 2029' },
    { id: 'bla',    label: 'BLA / MAA', status: 'upcoming', when: '2030' },
];

// -------------------------------------------------------------------
// Study schema — arms and periods, rendered as a horizontal visual.
// -------------------------------------------------------------------
const STUDY_SCHEMA = {
    periods: ['Screening', 'Randomisation', 'Treatment', 'Follow-up'],
    arms: [
        { name: 'Experimental · BI-042 200 mg Q3W', tone: 'blue', n: '≈ 420 pts' },
        { name: 'Control · External RWD cohort',   tone: 'amber', n: '≈ 420 pts' },
    ],
};

// -------------------------------------------------------------------
// Comparator precedent trials — the analogues the agent scored against.
// -------------------------------------------------------------------
const COMPARATORS = [
    {
        id: 'CT-8801',
        sponsor: 'Competitor A',
        design: '1L NSCLC · CPS ≥ 10',
        outcome: 'FDA approved (2024)',
        score: 88,
        tone: 'strong',
    },
    {
        id: 'CT-7712',
        sponsor: 'Competitor B',
        design: '1L NSCLC · all-comers',
        outcome: 'ODAC 8-3 against (2024)',
        score: 54,
        tone: 'alert',
    },
    {
        id: 'CT-6543',
        sponsor: 'Competitor C',
        design: 'RWE external control',
        outcome: 'FDA CRL — RWE deficiency (2025)',
        score: 61,
        tone: 'risk',
    },
    {
        id: 'CT-9021',
        sponsor: 'Internal · BI-0987',
        design: 'ECA + concurrent sensitivity',
        outcome: 'EOP2 agreement (2024)',
        score: 84,
        tone: 'ok',
    },
];

// -------------------------------------------------------------------
// Version history — draft revisions and their scores over time.
// -------------------------------------------------------------------
const VERSIONS = [
    { id: 'v1', label: 'v1 · initial draft',      score: 62, when: 'May 2026', active: false },
    { id: 'v2', label: 'v2 · post-Type-C revise', score: 71, when: 'Jun 2026', active: false },
    { id: 'v3', label: 'v3 · current draft',      score: 78, when: 'Jul 2026', active: true  },
];

// -------------------------------------------------------------------
// Suggested prompts for the Ask-the-agent chat.
// -------------------------------------------------------------------
const CHAT_PROMPTS = [
    'Where has FDA accepted an ECA in 1L NSCLC?',
    'Show every EMA CHMP opinion mentioning OS as primary in this tumour type.',
    'Summarise our Type C position on hierarchical testing.',
    'Which stopping rules did DMC guidance recommend in the last 24 months?',
];

// -------------------------------------------------------------------
// Sample scoring result — illustrative, not a real submission.
// Each finding carries cited precedent so the reviewer can follow the
// reasoning back to source.
// -------------------------------------------------------------------
const SAMPLE = {
    protocol: 'BI-2026-042 · Phase III',
    overall: 78,
    findings: [
        {
            domain: 'D1',
            sectionId: 'sec-population',
            title: 'Broader biomarker cutoff than label precedent',
            tone: 'risk',
            score: 72,
            desc: 'Draft enrolls PD-L1 CPS ≥ 1. The three most recent FDA approvals in this indication used CPS ≥ 10; the AdCom transcript flagged CPS ≥ 1 as underpowered for the ITT vote.',
            citations: ['FDA · CPS ≥ 10 precedent', 'AdCom Sep 2024', 'Prior CSR BI-1019'],
            recommendation:
                'Consider a hierarchical testing strategy that reads out CPS ≥ 10 first, then ITT. This mirrors the design FDA endorsed at the Type C meeting on our sister asset.',
            precedents: [
                {
                    type: 'FDA decision letter',
                    title: 'Approval memo — competitor asset, 1L NSCLC (2024)',
                    meta: ['NDA 217xxx', 'CPS ≥ 10 primary'],
                    quote:
                        '“The applicant’s decision to restrict the primary analysis to CPS ≥ 10 addressed the review division’s concern regarding effect dilution in the CPS 1–9 subgroup.”',
                },
                {
                    type: 'Internal · Type C minutes',
                    title: 'BI-1019 Type C meeting — Feb 2025',
                    meta: ['FDA OOD', 'Division of Oncology 1'],
                    quote:
                        '“Division agrees with sponsor’s hierarchical testing plan (CPS ≥ 10 → all-comers) and considers it registrationally acceptable.”',
                },
                {
                    type: 'Public · AdCom transcript',
                    title: 'ODAC · September 2024',
                    meta: ['Vote 8-3 against', 'Population question'],
                    quote:
                        '“The all-comers primary analysis is unlikely to yield an interpretable benefit–risk given the enrichment observed in the CPS ≥ 10 subgroup.”',
                },
            ],
        },
        {
            domain: 'D2',
            sectionId: 'sec-endpoints',
            title: 'PFS surrogate — EMA prefers OS in this indication',
            tone: 'alert',
            score: 61,
            desc: 'Primary endpoint is investigator-assessed PFS. EMA CHMP has, in the last four opinions for this tumor type, requested OS as the primary or co-primary endpoint.',
            citations: ['EMA CHMP · 4 opinions', 'ICH E9(R1)', 'EU CTR benchmarks'],
            recommendation:
                'Elevate OS to co-primary with a group-sequential design; keep BICR-adjudicated PFS as the key secondary. This aligns with the CHMP pattern and preserves the EMA path.',
            precedents: [
                {
                    type: 'EMA · CHMP opinion',
                    title: 'Competitor asset — 1L, negative opinion (2025)',
                    meta: ['Article 12', 'Endpoint concern'],
                    quote:
                        '“The magnitude of PFS benefit in the absence of an OS trend is not considered clinically meaningful for this indication.”',
                },
                {
                    type: 'ICH guidance',
                    title: 'ICH E9(R1) · Addendum on Estimands',
                    meta: ['Section A.3', 'Intercurrent events'],
                    quote:
                        '“Selection of the primary endpoint should reflect the treatment effect of most direct clinical relevance to the target population.”',
                },
            ],
        },
        {
            domain: 'D3',
            sectionId: 'sec-stats',
            title: 'Estimand aligned with ICH E9(R1)',
            tone: 'strong',
            score: 91,
            desc: 'Draft explicitly defines the treatment-policy strategy for treatment discontinuation and a hypothetical strategy for treatment switching. Multiplicity control uses a graphical Bonferroni-based scheme.',
            citations: ['ICH E9(R1)', 'FDA Multiplicity Guidance (2022)'],
            recommendation:
                'No changes recommended. Consider pre-specifying sensitivity analyses using a while-on-treatment strategy for the safety estimand.',
            precedents: [
                {
                    type: 'FDA guidance',
                    title: 'Multiple Endpoints in Clinical Trials (2022)',
                    meta: ['Section IV.B', 'Graphical procedures'],
                    quote:
                        '“Graphical approaches provide flexibility while strictly controlling the family-wise Type I error rate.”',
                },
            ],
        },
        {
            domain: 'D4',
            sectionId: 'sec-comparator',
            title: 'ECA rationale needs strengthening for accelerated approval path',
            tone: 'risk',
            score: 70,
            desc: 'External control arm (ECA) constructed from Flatiron RWD. FDA has approved ECAs in rare oncology but has been more cautious in the current tumor type.',
            citations: ['FDA RWE Framework', '2 recent CRLs', 'Prior EOP2 minutes'],
            recommendation:
                'Add a small internal randomized concurrent control (~40 patients) as sensitivity analysis. This is the pattern FDA endorsed at our EOP2 meeting on BI-0987.',
            precedents: [
                {
                    type: 'FDA · CRL summary',
                    title: 'Complete response letter — competitor RWE submission (2025)',
                    meta: ['CDER', 'RWE deficiency'],
                    quote:
                        '“Residual confounding in the external control precluded a reliable estimate of comparative effectiveness.”',
                },
                {
                    type: 'Internal · EOP2 minutes',
                    title: 'BI-0987 End-of-Phase-2 — Nov 2024',
                    meta: ['FDA agreement', 'Sensitivity arm'],
                    quote:
                        '“Division would view a small randomized sensitivity arm as substantially strengthening the interpretability of the ECA-based primary analysis.”',
                },
            ],
        },
        {
            domain: 'D5',
            sectionId: 'sec-design',
            title: 'Adaptive sample-size re-estimation — precedent exists',
            tone: 'ok',
            score: 84,
            desc: 'Draft includes an unblinded sample-size re-estimation at 60% information time. FDA has accepted the same design in two competitor Phase III trials in the last 24 months.',
            citations: ['FDA Adaptive Designs Guidance', '2 competitor precedents'],
            recommendation:
                'Add explicit language on Type I error preservation via combination test; propose independent DMC firewall in the SAP.',
            precedents: [
                {
                    type: 'FDA guidance',
                    title: 'Adaptive Designs for Clinical Trials (2019)',
                    meta: ['Section VI.C', 'Unblinded SSR'],
                    quote:
                        '“Adaptive sample-size re-estimation is acceptable when Type I error control is analytically demonstrated and operational bias is mitigated.”',
                },
            ],
        },
        {
            domain: 'D6',
            sectionId: 'sec-safety',
            title: 'DSMB charter aligned with agency expectations',
            tone: 'strong',
            score: 93,
            desc: 'DSMB independence, stopping rules for futility and efficacy, and pre-specified safety triggers all match the most recent FDA and EMA feedback on comparable programs.',
            citations: ['FDA DMC Guidance', 'CHMP safety Q&A'],
            recommendation:
                'No changes recommended. Charter is ready for submission.',
            precedents: [
                {
                    type: 'FDA guidance',
                    title: 'Establishment and Operation of Clinical Trial DMCs',
                    meta: ['Section V', 'Independence'],
                    quote:
                        '“DMC members should be free from significant conflicts of interest and operate under a written charter agreed prior to trial initiation.”',
                },
            ],
        },
    ],
};

// -------------------------------------------------------------------
// View manager
// -------------------------------------------------------------------
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function showView(name) {
    $$('.view').forEach((v) => {
        const active = v.dataset.view === name;
        v.classList.toggle('is-active', active);
        v.setAttribute('aria-hidden', active ? 'false' : 'true');
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// -------------------------------------------------------------------
// Populate the six-domain preview grid on the landing view
// -------------------------------------------------------------------
function renderDomainPreview() {
    const host = $('#domainPreview');
    host.innerHTML = DOMAINS.map(
        (d) => `
        <article class="domain-card" data-tone="${d.tone}" role="listitem">
            <span class="domain-card__glyph" aria-hidden="true">${d.id}</span>
            <div class="domain-card__id">${d.id}</div>
            <h3 class="domain-card__title">${d.title}</h3>
            <p class="domain-card__desc">${d.summary}</p>
        </article>
    `
    ).join('');
}

// -------------------------------------------------------------------
// Analyze view (fake pipeline — feels like the real thing)
// -------------------------------------------------------------------
const ANALYZE_STEPS = [
    { pct: 12, title: 'Reading protocol…',                step: 'Extracting design elements' },
    { pct: 28, title: 'Matching against internal corpus', step: 'Type B/C minutes · EOP2 · prior CSRs' },
    { pct: 46, title: 'Matching against public corpus',   step: 'FDA & EMA guidance · AdCom · ClinicalTrials.gov' },
    { pct: 64, title: 'Scoring each design domain',       step: 'D1 Population · D2 Endpoint · D3 Statistics' },
    { pct: 82, title: 'Scoring each design domain',       step: 'D4 Comparator · D5 Innovative · D6 Safety' },
    { pct: 94, title: 'Assembling cited precedent',       step: 'Attaching decision letters & meeting minutes' },
    { pct: 100, title: 'Ready',                           step: 'Regulatory Alignment Score computed' },
];

function runAnalyze() {
    showView('analyze');

    const ringNum  = $('#ringNum');
    const ringProg = $('#ringProgress');
    const title    = $('#analyzeTitle');
    const step     = $('#analyzeStep');
    const log      = $('#analyzeLog');
    const CIRC     = 2 * Math.PI * 52;

    log.innerHTML = '';
    ringProg.style.strokeDasharray = CIRC.toString();

    let i = 0;
    const tick = () => {
        if (i >= ANALYZE_STEPS.length) {
            setTimeout(renderResults, 350);
            return;
        }
        const s = ANALYZE_STEPS[i];
        ringNum.textContent = s.pct;
        ringProg.style.strokeDashoffset = (CIRC * (1 - s.pct / 100)).toString();
        title.textContent = s.title;
        step.textContent  = s.step;

        if (i > 0) {
            const li = document.createElement('li');
            li.textContent = ANALYZE_STEPS[i - 1].step;
            log.appendChild(li);
        }
        i += 1;
        setTimeout(tick, i === 1 ? 500 : 620);
    };
    tick();
}

// -------------------------------------------------------------------
// Render the results dashboard
// -------------------------------------------------------------------
function toneOf(score) {
    if (score >= 88) return 'strong';
    if (score >= 78) return 'ok';
    if (score >= 65) return 'risk';
    return 'alert';
}

function toneLabel(t) {
    return ({
        strong: 'Strong alignment',
        ok:     'Aligned',
        risk:   'Needs attention',
        alert:  'Divergent from precedent',
    })[t];
}

function renderResults() {
    showView('dashboard');

    const overall = SAMPLE.overall;
    $('#heroNum').textContent = overall;
    $('#heroTag').textContent = toneLabel(toneOf(overall));
    $('#heroTag').dataset.tone =
        overall >= 78 ? 'green' : overall >= 65 ? 'amber' : 'red';

    // Animate the score ring
    const HERO_CIRC = 2 * Math.PI * 68;
    const hero = $('#heroProgress');
    hero.style.strokeDasharray = HERO_CIRC.toString();
    requestAnimationFrame(() => {
        hero.style.strokeDashoffset =
            (HERO_CIRC * (1 - overall / 100)).toString();
    });

    // Summary text
    const flags = SAMPLE.findings.filter((f) => f.tone === 'risk' || f.tone === 'alert').length;
    const cites = SAMPLE.findings.reduce((n, f) => n + f.precedents.length, 0) * 3;
    $('#outFlags').textContent = flags;
    $('#outCites').textContent = cites;
    $('#resultsSummary').textContent =
        `Draft scored across ${SAMPLE.findings.length} regulatory design domains. ` +
        `${flags} finding${flags === 1 ? '' : 's'} require senior regulatory review before first-patient-in.`;

    // Findings
    const grid = $('#resultsGrid');
    grid.innerHTML = SAMPLE.findings
        .map((f, idx) => {
            const dom = DOMAINS.find((d) => d.id === f.domain);
            return `
            <button class="finding" data-tone="${f.tone}" data-idx="${idx}"
                data-section="${f.sectionId}" role="listitem"
                aria-label="${dom.id} ${f.title}, score ${f.score} of 100">
                <div class="finding__header">
                    <div class="finding__meta">
                        <span class="finding__id">${dom.id}</span>
                        <span style="color:var(--text-muted); font-size:13px;">${dom.title}</span>
                    </div>
                    <span class="score-badge" data-tone="${f.tone}">
                        ${f.score}<small>/100</small>
                    </span>
                </div>
                <h3 class="finding__title">${f.title}</h3>
                <p class="finding__desc">${f.desc}</p>
                <div class="finding__citations">
                    ${f.citations.map((c) => `<span class="citation">${c}</span>`).join('')}
                </div>
                <div class="finding__link" aria-hidden="true">
                    <span>Jump to Section ${(PROTOCOL_SECTIONS.find(s => s.id === f.sectionId) || {}).num}</span>
                    <span aria-hidden="true">→</span>
                </div>
            </button>
        `;
        })
        .join('');

    // Wire finding clicks — main click opens the sheet, the "Jump" affordance
    // scrolls the protocol section into view.
    $$('.finding').forEach((el) => {
        el.addEventListener('click', (e) => {
            if (e.target.closest('.finding__link')) {
                e.stopPropagation();
                revealSection(el.dataset.section);
            } else {
                openSheet(Number(el.dataset.idx));
            }
        });
    });

    renderMilestones();
    renderStudySchema();
    renderProtocol();
    renderComparators();
    renderVersions();
}

// -------------------------------------------------------------------
// Milestones — horizontal step timeline
// -------------------------------------------------------------------
function renderMilestones() {
    const host = $('#milestones');
    if (!host) return;
    host.innerHTML = MILESTONES.map(
        (m) => `
        <li class="milestone milestone--${m.status}">
            <span class="milestone__dot" aria-hidden="true"></span>
            <span class="milestone__label">${m.label}</span>
            <span class="milestone__when">${m.when}</span>
        </li>
    `
    ).join('');
}

// -------------------------------------------------------------------
// Study schema — periods x arms
// -------------------------------------------------------------------
function renderStudySchema() {
    const host = $('#studySchema');
    if (!host) return;
    const cols = STUDY_SCHEMA.periods
        .map((p) => `<div class="schema__period">${p}</div>`)
        .join('');
    const rows = STUDY_SCHEMA.arms
        .map(
            (a) => `
        <div class="schema__arm" data-tone="${a.tone}">
            <div class="schema__arm-name">${a.name}</div>
            <div class="schema__arm-n">${a.n}</div>
            <div class="schema__arm-bar"><span></span></div>
        </div>
    `
        )
        .join('');
    host.innerHTML = `
        <div class="schema__periods">${cols}</div>
        <div class="schema__arms">${rows}</div>
    `;
}

// -------------------------------------------------------------------
// Protocol viewer — each section anchored to a D-domain and its finding
// -------------------------------------------------------------------
function renderProtocol() {
    const host = $('#protocolDoc');
    if (!host) return;
    host.innerHTML = PROTOCOL_SECTIONS.map((s) => {
        const dom = DOMAINS.find((d) => d.id === s.domain);
        const finding = SAMPLE.findings.find((f) => f.sectionId === s.id);
        const tone = finding ? finding.tone : 'ok';
        const score = finding ? finding.score : null;
        return `
        <article class="doc-section" id="${s.id}" data-tone="${tone}" data-domain="${s.domain}">
            <header class="doc-section__head">
                <div>
                    <span class="doc-section__num">Section ${s.num}</span>
                    <h4 class="doc-section__title">${s.title}</h4>
                </div>
                <div class="doc-section__meta">
                    <span class="doc-tag">${dom.id} · ${dom.title}</span>
                    ${score !== null
                        ? `<span class="score-badge score-badge--sm" data-tone="${tone}">${score}<small>/100</small></span>`
                        : ''}
                </div>
            </header>
            <p class="doc-section__text">${s.text}</p>
            ${s.suggested
                ? `<aside class="doc-section__suggest" data-tone="${tone}">
                        <span class="doc-section__suggest-label">Suggested revision</span>
                        <p>${s.suggested}</p>
                        <button class="doc-section__cta" data-open-finding="${s.id}">
                            View precedent →
                        </button>
                   </aside>`
                : ''}
        </article>
        `;
    }).join('');

    // Wire "View precedent" jumps back to the finding sheet
    $$('[data-open-finding]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const sid = btn.dataset.openFinding;
            const idx = SAMPLE.findings.findIndex((f) => f.sectionId === sid);
            if (idx >= 0) openSheet(idx);
        });
    });
}

// -------------------------------------------------------------------
// Comparator precedent trials
// -------------------------------------------------------------------
function renderComparators() {
    const host = $('#comparators');
    if (!host) return;
    host.innerHTML = COMPARATORS.map(
        (c) => `
        <article class="comparator" data-tone="${c.tone}">
            <header class="comparator__head">
                <span class="comparator__id">${c.id}</span>
                <span class="score-badge score-badge--sm" data-tone="${c.tone}">${c.score}<small>/100</small></span>
            </header>
            <div class="comparator__sponsor">${c.sponsor}</div>
            <div class="comparator__design">${c.design}</div>
            <div class="comparator__outcome">${c.outcome}</div>
        </article>
    `
    ).join('');
}

// -------------------------------------------------------------------
// Version history chip (draft revision picker)
// -------------------------------------------------------------------
function renderVersions() {
    const host = $('#versionPicker');
    if (!host) return;
    host.innerHTML = VERSIONS.map(
        (v) => `
        <button class="version ${v.active ? 'is-active' : ''}" data-version="${v.id}"
            aria-pressed="${v.active}">
            <span class="version__label">${v.label}</span>
            <span class="version__meta">${v.when} · score ${v.score}</span>
        </button>
    `
    ).join('');

    $$('.version').forEach((btn) => {
        btn.addEventListener('click', () => {
            $$('.version').forEach((b) => {
                b.classList.remove('is-active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('is-active');
            btn.setAttribute('aria-pressed', 'true');
            const v = VERSIONS.find((x) => x.id === btn.dataset.version);
            showToast(`Viewing ${v.label} · score ${v.score}/100`);
        });
    });
}

// -------------------------------------------------------------------
// Scroll a protocol section into view and pulse-highlight it
// -------------------------------------------------------------------
function revealSection(sectionId) {
    const el = document.getElementById(sectionId);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.remove('is-pulse');
    // Force reflow so animation restarts
    void el.offsetWidth;
    el.classList.add('is-pulse');
}

// -------------------------------------------------------------------
// Segmented filter
// -------------------------------------------------------------------
function wireSegmented() {
    $$('.seg').forEach((btn) => {
        btn.addEventListener('click', () => {
            $$('.seg').forEach((b) => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            const f = btn.dataset.filter;

            $$('.finding').forEach((card) => {
                const t = card.dataset.tone;
                let show = true;
                if (f === 'risk')   show = t === 'risk' || t === 'alert';
                if (f === 'ok')     show = t === 'ok';
                if (f === 'strong') show = t === 'strong';
                card.classList.toggle('is-hidden', !show);
            });
        });
    });
}

// -------------------------------------------------------------------
// Sheet
// -------------------------------------------------------------------
function openSheet(idx) {
    const f = SAMPLE.findings[idx];
    const dom = DOMAINS.find((d) => d.id === f.domain);

    $('#sheetEyebrow').textContent = `${dom.id} · ${dom.title} · Score ${f.score}/100`;
    $('#sheetTitle').textContent = f.title;
    $('#sheetSub').textContent = f.desc;

    const body = $('#sheetBody');
    body.innerHTML =
        f.precedents
            .map(
                (p) => `
            <article class="precedent">
                <div class="precedent__type">${p.type}</div>
                <div class="precedent__title">${p.title}</div>
                <div class="precedent__meta">${p.meta.map((m) => `<span>${m}</span>`).join('')}</div>
                <blockquote class="precedent__quote">${p.quote}</blockquote>
            </article>
        `
            )
            .join('') +
        `<div class="recommendation">${f.recommendation}</div>`;

    const sheet = $('#sheet');
    sheet.classList.add('is-open');
    sheet.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeSheet() {
    const sheet = $('#sheet');
    sheet.classList.remove('is-open');
    sheet.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function wireSheet() {
    $$('[data-close-sheet]').forEach((el) => el.addEventListener('click', closeSheet));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSheet();
    });
    $('#acceptFinding').addEventListener('click', () => {
        closeSheet();
        showToast('Recommendation accepted · added to review packet');
    });
}

// -------------------------------------------------------------------
// Toast
// -------------------------------------------------------------------
let toastTimer = null;
function showToast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2600);
}

// -------------------------------------------------------------------
// Dropzone
// -------------------------------------------------------------------
function wireDropzone() {
    const dz     = $('#dropzone');
    const input  = $('#file');
    const browse = $('#browse');
    const sample = $('#loadSample');

    browse.addEventListener('click', () => input.click());
    sample.addEventListener('click', () => {
        showToast('Loaded sample protocol · BI-2026-042');
        runAnalyze();
    });

    input.addEventListener('change', () => {
        if (input.files && input.files.length) {
            showToast(`Uploaded ${input.files[0].name}`);
            runAnalyze();
        }
    });

    ['dragenter', 'dragover'].forEach((evt) =>
        dz.addEventListener(evt, (e) => {
            e.preventDefault();
            dz.classList.add('is-drag');
        })
    );
    ['dragleave', 'drop'].forEach((evt) =>
        dz.addEventListener(evt, (e) => {
            e.preventDefault();
            dz.classList.remove('is-drag');
        })
    );
    dz.addEventListener('drop', (e) => {
        const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (file) {
            showToast(`Uploaded ${file.name}`);
            runAnalyze();
        }
    });
}

// -------------------------------------------------------------------
// Nav jumps and export
// -------------------------------------------------------------------
function wireNav() {
    $$('[data-jump]').forEach((el) => {
        el.addEventListener('click', () => {
            const target = el.dataset.jump;
            if (target === 'dashboard') {
                renderResults();
            } else {
                showView(target);
            }
        });
    });

    $('#exportBtn').addEventListener('click', () => {
        showToast('Briefing exported · sent to Regulatory Affairs share');
    });
}

// -------------------------------------------------------------------
// Ask-the-agent chat (grounded prompts, mock answers)
// -------------------------------------------------------------------
function wireChat() {
    const fab   = $('#chatFab');
    const panel = $('#chat');
    const close = $('#chatClose');
    const list  = $('#chatList');
    const form  = $('#chatForm');
    const input = $('#chatInput');
    const promptRow = $('#chatPrompts');

    if (!fab) return;

    // Seed suggested prompts
    promptRow.innerHTML = CHAT_PROMPTS.map(
        (p) => `<button type="button" class="chat-prompt" data-prompt="${p.replace(/"/g, '&quot;')}">${p}</button>`
    ).join('');

    // Seed a friendly opening
    if (!list.dataset.seeded) {
        appendMsg('agent',
            'I have full context on the current draft (v3 · BI-2026-042). Ask about any ' +
            'domain, a specific section, or a precedent — I will cite sources.');
        list.dataset.seeded = '1';
    }

    const open  = () => {
        panel.classList.add('is-open');
        panel.setAttribute('aria-hidden', 'false');
        setTimeout(() => input.focus(), 60);
    };
    const shut = () => {
        panel.classList.remove('is-open');
        panel.setAttribute('aria-hidden', 'true');
    };

    fab.addEventListener('click', open);
    close.addEventListener('click', shut);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('is-open')) shut();
    });

    promptRow.addEventListener('click', (e) => {
        const btn = e.target.closest('.chat-prompt');
        if (!btn) return;
        input.value = btn.dataset.prompt;
        submit();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        submit();
    });

    function appendMsg(role, text, cites) {
        const li = document.createElement('li');
        li.className = `chat-msg chat-msg--${role}`;
        const cText = document.createElement('div');
        cText.className = 'chat-msg__bubble';
        cText.textContent = text;
        li.appendChild(cText);
        if (cites && cites.length) {
            const cRow = document.createElement('div');
            cRow.className = 'chat-msg__cites';
            cRow.innerHTML = cites
                .map((c) => `<span class="citation">${c}</span>`)
                .join('');
            li.appendChild(cRow);
        }
        list.appendChild(li);
        list.scrollTop = list.scrollHeight;
    }

    function submit() {
        const q = input.value.trim();
        if (!q) return;
        appendMsg('user', q);
        input.value = '';

        // Typing indicator
        const typing = document.createElement('li');
        typing.className = 'chat-msg chat-msg--agent chat-msg--typing';
        typing.innerHTML = '<div class="chat-msg__bubble"><span></span><span></span><span></span></div>';
        list.appendChild(typing);
        list.scrollTop = list.scrollHeight;

        setTimeout(() => {
            typing.remove();
            const { answer, cites } = mockAnswer(q);
            appendMsg('agent', answer, cites);
        }, 720);
    }
}

function mockAnswer(q) {
    const s = q.toLowerCase();
    if (s.includes('eca') || s.includes('external control')) {
        return {
            answer:
                'FDA has accepted external control arms in 1L NSCLC only when a small ' +
                'concurrent randomised sensitivity arm was included. See our EOP2 minute ' +
                'on BI-0987 (Nov 2024) and the RWE Framework §III.C. Our draft (Section 7) ' +
                'currently lacks this sensitivity arm — see finding D4.',
            cites: ['Internal · BI-0987 EOP2', 'FDA RWE Framework §III.C', 'Finding D4'],
        };
    }
    if (s.includes('os') || s.includes('overall survival') || s.includes('endpoint')) {
        return {
            answer:
                'CHMP has requested OS as primary or co-primary in four consecutive opinions ' +
                'for this indication. Recommendation on Section 5: elevate OS to co-primary ' +
                'with a group-sequential design and keep PFS (BICR) as key secondary.',
            cites: ['EMA CHMP · 4 opinions', 'ICH E9(R1) §A.3', 'Finding D2'],
        };
    }
    if (s.includes('type c') || s.includes('hierarchical')) {
        return {
            answer:
                'At the Type C meeting on our sister asset (Feb 2025), the Division agreed ' +
                'with the hierarchical testing plan (CPS ≥ 10 → all-comers) and considered it ' +
                'registrationally acceptable. Apply the same structure to Section 4.',
            cites: ['Internal · Type C Feb 2025', 'Finding D1'],
        };
    }
    if (s.includes('dsmb') || s.includes('stopping')) {
        return {
            answer:
                'Current DSMB charter (Section 10) aligns with FDA DMC Guidance §V and CHMP ' +
                'safety Q&A. Stopping rules for futility, efficacy, and toxicity are precedent-consistent. ' +
                'No changes recommended.',
            cites: ['FDA DMC Guidance §V', 'CHMP safety Q&A', 'Finding D6'],
        };
    }
    return {
        answer:
            'I scored the draft across the six regulatory design domains. The two items ' +
            'requiring senior review are D2 (Primary Endpoint) and D4 (Comparator). ' +
            'Ask me about either for citations and suggested language.',
        cites: ['Findings D2, D4'],
    };
}

// -------------------------------------------------------------------
// Module registry — each entry describes one specialist agent module
// and, optionally, a render() function to populate its markup.
// -------------------------------------------------------------------
const MODULES = [
    { id: 'home',                 group: 'Overview',    icon: '⌂', label: 'Home',                 subtitle: 'All agents at a glance' },
    { id: 'protocol-alignment',   group: 'Design',      icon: '◎', label: 'Protocol Alignment',   subtitle: 'Score a draft against precedent' },
    { id: 'change-monitoring',    group: 'Monitor',     icon: '◐', label: 'Change Monitoring',    subtitle: 'FDA, EMA, PMDA, ICH …', badge: 12 },
    { id: 'meetings',             group: 'Monitor',     icon: '☰', label: 'Meeting Intelligence', subtitle: 'Transcripts & commitments' },
    { id: 'extraction',           group: 'Understand',  icon: '⎘', label: 'Intelligence Extraction', subtitle: 'PDF → structured' },
    { id: 'knowledge-graph',      group: 'Understand',  icon: '⇄', label: 'Knowledge Graph',      subtitle: 'Impact propagation' },
    { id: 'qa-copilot',           group: 'Understand',  icon: '?', label: 'Q&A Copilot',          subtitle: 'Citation-grounded answers' },
    { id: 'content',              group: 'Act',         icon: '✎', label: 'Content Generation',   subtitle: 'Drafts with human-in-the-loop' },
    { id: 'impact',               group: 'Act',         icon: '◪', label: 'Impact Assessment',    subtitle: 'Portfolio impact scoring' },
    { id: 'predictive',           group: 'Predict',     icon: '◈', label: 'Predictive Intelligence', subtitle: 'Approval & timeline forecasts' },
    { id: 'orchestrator',         group: 'Foundation',  icon: '◈', label: 'Multi-Agent Orchestrator', subtitle: 'Planner + specialist agents' },
    { id: 'data-hub',             group: 'Foundation',  icon: '▤', label: 'Regulatory Data Hub',  subtitle: 'FHIR-native fabric' },
    { id: 'compliance',           group: 'Foundation',  icon: '✓', label: 'Compliance & Audit',   subtitle: 'GxP · CFR 11 · Responsible AI' },
];

// -------------------------------------------------------------------
// Illustrative content per module
// -------------------------------------------------------------------
const CM_AGENCIES = ['FDA', 'EMA', 'PMDA', 'MHRA', 'Health Canada', 'ICH', 'Internal'];
const CM_FEED = [
    { agency: 'FDA', region: 'US', tone: 'alert', tag: 'Deadline',
      title: 'Confirmatory-evidence guidance · public comment window closing',
      meta: 'Docket FDA-2026-D-1180 · comments due Aug 14 · affects 3 products' },
    { agency: 'EMA', region: 'EU', tone: 'new',  tag: 'New guidance',
      title: 'Draft reflection paper on external control arms in oncology',
      meta: 'CHMP · issued 2 days ago · impacts D4 scoring for 4 protocols' },
    { agency: 'ICH', region: 'Global', tone: 'warn', tag: 'Revision',
      title: 'ICH E9(R1) addendum revised — treatment-policy strategy clarifications',
      meta: 'Step 4 · aligns FDA and EMA estimand terminology' },
    { agency: 'PMDA', region: 'JP', tone: 'new', tag: 'New guidance',
      title: 'Update on Japanese-population bridging expectations for oncology',
      meta: 'Notification No. 2026-0311 · impacts BI-2026-042 IND strategy' },
    { agency: 'MHRA', region: 'UK', tone: 'info', tag: 'FYI',
      title: 'Innovative Licensing and Access Pathway — cohort criteria refresh',
      meta: 'Published Jun 30 · relevant to accelerated approval planning' },
    { agency: 'Health Canada', region: 'CA', tone: 'info', tag: 'FYI',
      title: 'Notice of intent — CTA electronic submission requirements',
      meta: 'Consultation open · 90-day comment period' },
    { agency: 'Internal', region: '—', tone: 'warn', tag: 'Internal',
      title: 'Type C position on hierarchical testing — new template published',
      meta: 'Regulatory Strategy team · applies to all Phase III oncology' },
    { agency: 'FDA', region: 'US', tone: 'new', tag: 'AdCom',
      title: 'ODAC agenda posted — external control arms panel discussion',
      meta: 'Meeting Sep 12 · watchlist for D4 scoring inputs' },
];
const CM_SUBS = [
    { name: 'FDA CDER · new guidance', kbd: 'daily' },
    { name: 'EMA CHMP · opinions',     kbd: 'weekly' },
    { name: 'PMDA · oncology',         kbd: 'weekly' },
    { name: 'ICH · working groups',    kbd: 'monthly' },
    { name: 'Internal · Type-C mins',  kbd: 'as-published' },
];

const EX_STATS = [
    { label: 'Documents ingested', value: '18,432', delta: '+312 this week' },
    { label: 'Obligations extracted', value: '54,918', delta: '+1,204 this week' },
    { label: 'Regulatory entities', value: '128k', delta: '+3.1k this week' },
    { label: 'Grounded citations', value: '392k', delta: '+9.4k this week' },
];
const EX_ITEMS = [
    { kind: 'Obligation', title: 'Sponsors shall pre-specify the estimand for the primary analysis',
      sub: 'FDA Adaptive Designs Guidance §VI · para 3',
      tags: ['E9(R1)', 'shall', 'primary analysis'] },
    { kind: 'Requirement', title: 'Independent DMC must be established prior to first-patient-in',
      sub: 'FDA DMC Guidance §V',
      tags: ['must', 'DMC', 'safety'] },
    { kind: 'Authority position', title: 'CHMP prefers overall survival as primary in advanced NSCLC',
      sub: 'EMA CHMP opinions 2023–2025 · aggregated',
      tags: ['CHMP', 'OS', 'endpoint'] },
    { kind: 'Risk statement', title: 'External control comparisons risk residual confounding',
      sub: 'FDA RWE Framework §III.C',
      tags: ['RWE', 'ECA', 'risk'] },
    { kind: 'Guidance', title: 'Multiplicity controlled via graphical Bonferroni approach acceptable',
      sub: 'FDA Multiple Endpoints Guidance §IV.B',
      tags: ['multiplicity', 'family-wise error'] },
];

const KG_NODES = [
    { id: 'p1',  type: 'Product',      x: 320, y: 220, label: 'BI-042' },
    { id: 's1',  type: 'Submission',   x: 500, y: 130, label: 'IND 2026' },
    { id: 's2',  type: 'Submission',   x: 500, y: 310, label: 'CTA EU 2026' },
    { id: 'l1',  type: 'Label',        x: 320, y: 380, label: 'USPI draft' },
    { id: 't1',  type: 'Study',        x: 140, y: 150, label: 'BI-042-301' },
    { id: 't2',  type: 'Study',        x: 100, y: 300, label: 'BI-042-201' },
    { id: 'a1',  type: 'Authority',    x: 580, y: 60,  label: 'FDA OOD' },
    { id: 'a2',  type: 'Authority',    x: 580, y: 380, label: 'EMA CHMP' },
    { id: 'r1',  type: 'Regulation',   x: 320, y: 60,  label: 'ICH E9(R1)' },
    { id: 'x1',  type: 'Safety signal',x: 140, y: 400, label: 'AE cluster #17' },
];
const KG_EDGES = [
    ['p1','s1'], ['p1','s2'], ['p1','l1'], ['p1','t1'], ['p1','t2'],
    ['s1','a1'], ['s2','a2'], ['t1','r1'], ['t2','x1'], ['l1','a1'],
    ['r1','s1'], ['r1','s2'], ['x1','l1'],
];
const KG_COLORS = {
    Product: '#464feb', Submission: '#248a3d', Label: '#b25000',
    Study: '#7c3aed', Authority: '#1d1d1f', Regulation: '#0f766e', 'Safety signal': '#b3261e',
};

const IMPACT = [
    { label: 'Products',      value: 12, tone: 'alert', note: '3 requiring label update' },
    { label: 'Active trials', value: 7,  tone: 'warn',  note: '2 protocol amendments needed' },
    { label: 'Manufacturing', value: 4,  tone: 'warn',  note: '1 process validation triggered' },
    { label: 'Safety',        value: 2,  tone: 'alert', note: '2 PSURs to refile' },
    { label: 'Supply chain',  value: 3,  tone: 'ok',    note: '3 low-severity notifications' },
    { label: 'Portfolio',     value: 89, tone: 'warn',  note: 'Composite priority score' },
];

const MEETINGS = [
    { title: 'FDA Type C · BI-042 · hierarchical testing',
      when: 'Feb 12, 2026 · minutes ingested', badge: 'Type C',
      commits: [
        { who: 'FDA', what: 'agrees hierarchical CPS ≥ 10 → all-comers acceptable' },
        { who: 'Sponsor', what: 'to update Section 4 of protocol by Q3' } ] },
    { title: 'EMA Scientific Advice · endpoint selection',
      when: 'Apr 3, 2026 · transcript', badge: 'SA',
      commits: [
        { who: 'CHMP', what: 'requests OS as co-primary or primary in this indication' },
        { who: 'Sponsor', what: 'to submit revised statistical plan within 60 days' } ] },
    { title: 'Internal · Regulatory Strategy weekly',
      when: 'Jul 8, 2026 · Teams recording', badge: 'Internal',
      commits: [
        { who: 'Reg. Ops', what: 'to align eCTD publish date with revised timeline' } ] },
];

const CT_TEMPLATES = [
    { id: 'briefing',  name: 'Type C briefing package',  meta: 'FDA · 12 sections' },
    { id: 'response',  name: 'Response to FDA CRL',      meta: 'auto-cited from CRL' },
    { id: 'label',     name: 'USPI label proposal',      meta: 'diff vs comparator label' },
    { id: 'qanda',     name: 'Anticipated Q&A',          meta: 'from prior AdComs' },
    { id: 'summary',   name: 'Executive impact summary', meta: '1-page briefing' },
];
const CT_DRAFTS = {
    briefing:
        `<h3>Type C briefing package — BI-2026-042</h3>
         <p><strong>Sponsor:</strong> Boehringer Ingelheim &nbsp;·&nbsp;
            <strong>Indication:</strong> 1L advanced NSCLC, PD-L1 CPS ≥ 10</p>

         <h4>1. Purpose of meeting</h4>
         <p>Confirm Division alignment on (a) primary endpoint selection, (b) hierarchical
            testing strategy, and (c) the acceptability of an external control arm supplemented
            by a small concurrent randomised control.</p>

         <h4>2. Background and prior interactions</h4>
         <p>Type C meeting of February 2025 established Division agreement with the
            hierarchical testing plan (CPS ≥ 10 → all-comers). EMA CHMP have issued four
            consecutive opinions in this indication preferring OS as primary or co-primary.</p>

         <h4>3. Sponsor position</h4>
         <p>OS will be elevated to co-primary with a group-sequential design; BICR-adjudicated
            PFS is retained as the key secondary. The external control arm will be
            supplemented with a randomised sensitivity arm of approximately 40 patients,
            mirroring the design endorsed at the End-of-Phase-2 meeting on BI-0987.</p>

         <h4>4. Questions to the Agency</h4>
         <p>4.1 Does the Division agree that OS co-primary with hierarchical testing at
            CPS ≥ 10 preserves interpretability?<br>
            4.2 Does the Division agree that the proposed sensitivity arm adequately addresses
            residual-confounding concerns raised in CRL to a comparable competitor asset?</p>`,
    response:
        `<h3>Response to Complete Response Letter — BI-042</h3>
         <p>Sponsor acknowledges the deficiencies identified in the CRL of April 2026. This
            response addresses each item in the order raised.</p>
         <h4>Item 1 · External control interpretability</h4>
         <p>Sponsor has amended the protocol (Section 7) to include a randomised concurrent
            control arm as a sensitivity analysis. The revised design mirrors the pattern
            endorsed at the EOP2 meeting on BI-0987.</p>
         <h4>Item 2 · Estimand specification</h4>
         <p>The revised Statistical Analysis Plan (Section 9) explicitly pre-specifies the
            treatment-policy strategy for treatment discontinuation and a hypothetical
            strategy for treatment switching, consistent with ICH E9(R1).</p>`,
    label:
        `<h3>US Prescribing Information · draft</h3>
         <h4>1 INDICATIONS AND USAGE</h4>
         <p>BI-042 is indicated for the first-line treatment of adult patients with
            metastatic non-small cell lung cancer whose tumors express PD-L1
            (CPS ≥ 10) as determined by an FDA-approved test.</p>
         <h4>14 CLINICAL STUDIES</h4>
         <p>The efficacy of BI-042 was investigated in Study BI-042-301, a Phase III
            randomised trial. The primary endpoint was overall survival evaluated in the
            CPS ≥ 10 population.</p>`,
    qanda:
        `<h3>Anticipated Advisory Committee Questions</h3>
         <h4>Q1 · Population selection</h4>
         <p><strong>Anticipated question.</strong> Why did the sponsor not restrict enrolment
            to CPS ≥ 10 from the outset?<br>
            <strong>Prepared response.</strong> The hierarchical testing strategy preserves
            interpretability while allowing exploration of a broader population,
            consistent with the Type C outcome of February 2025.</p>
         <h4>Q2 · External control</h4>
         <p><strong>Anticipated question.</strong> How was residual confounding addressed?<br>
            <strong>Prepared response.</strong> A randomised concurrent sensitivity arm of
            approximately 40 patients was added to the protocol, mirroring the design
            endorsed at BI-0987 EOP2.</p>`,
    summary:
        `<h3>Executive impact summary — ICH E9(R1) addendum</h3>
         <p>The revised addendum clarifies estimand terminology and treatment-policy
            strategy expectations. Portfolio impact:</p>
         <ul>
            <li><strong>12 products</strong> require statistical-plan review.</li>
            <li><strong>7 active trials</strong> require SAP amendment; 2 require
                protocol amendment.</li>
            <li>Composite portfolio priority score: <strong>89 / 100</strong>.</li>
         </ul>
         <p>No manufacturing or safety impact identified. Approximate remediation window:
            8–10 weeks with current staffing.</p>`,
};

const OR_AGENTS = [
    'Planner', 'Extraction', 'Knowledge Graph', 'Ontology', 'Compliance',
    'FHIR', 'Validation', 'Reasoning', 'Content Generation', 'Human Approver',
];
const OR_WORKFLOW = [
    { agent: 'Planner',           task: 'Decompose task: build Type C briefing package', status: 'done' },
    { agent: 'Extraction',        task: 'Ingest prior Type C minutes and Section-4 of draft protocol', status: 'done' },
    { agent: 'Knowledge Graph',   task: 'Resolve entities: product · submission · authority · precedent', status: 'done' },
    { agent: 'Reasoning',         task: 'Score alignment across the six regulatory design domains', status: 'done' },
    { agent: 'Content Generation',task: 'Draft briefing package sections 1–4 with cited precedent', status: 'run' },
    { agent: 'Validation',        task: 'Fact-check every claim against source paragraph', status: 'wait' },
    { agent: 'Compliance',        task: 'Audit-log every decision · attach evidence lineage', status: 'wait' },
    { agent: 'Human Approver',    task: 'Regulatory Affairs Lead final review + sign-off', status: 'wait' },
];

const DH_STATS = [
    { label: 'Submissions',    value: '4,318',  delta: '+22 last 30 days' },
    { label: 'Studies',        value: '1,142',  delta: '+9 last 30 days' },
    { label: 'Labels',         value: '2,076',  delta: '+3 last 30 days' },
    { label: 'Correspondence', value: '38,910', delta: '+412 last 30 days' },
];
const DH_REPO = [
    { icon: '▤', name: 'Submissions (eCTD)',    count: '4,318 records', tag: 'FHIR' },
    { icon: '☰', name: 'Health-authority letters', count: '12,904 records', tag: 'FHIR' },
    { icon: '⎘', name: 'Prior protocols and CSRs', count: '1,142 records', tag: 'FHIR' },
    { icon: '⛨', name: 'Safety database (Argus)',   count: '89,441 cases', tag: 'HL7' },
    { icon: '◈', name: 'Labeling repository',     count: '2,076 records', tag: 'SPL' },
    { icon: '◐', name: 'Meeting transcripts',     count: '3,208 records', tag: 'transcribed' },
];

const CP_AUDIT = [
    { who: 'AK',        what: 'Approved D1 recommendation on BI-2026-042 · CPS ≥ 10 hierarchical', when: 'Just now', tone: 'ok' },
    { who: 'Agent',     what: 'Generated Type C briefing draft v3 · 12 sections · 27 citations', when: '2 min ago', tone: 'ok' },
    { who: 'Agent',     what: 'Flagged D2 endpoint divergence · EMA CHMP precedent', when: '4 min ago', tone: 'warn' },
    { who: 'MK (Legal)',what: 'Reviewed and signed evidence lineage bundle · bundle #4218', when: '18 min ago', tone: 'ok' },
    { who: 'Agent',     what: 'Refreshed EMA guidance corpus · 6 new documents', when: '1 h ago', tone: 'ok' },
    { who: 'Agent',     what: 'Denied auto-approve on label change · human-in-the-loop required', when: '3 h ago', tone: 'warn' },
    { who: 'System',    what: 'Rotated model version to v2026.07 · GxP re-validation passed', when: 'Yesterday', tone: 'ok' },
    { who: 'JB (QA)',   what: '21 CFR Part 11 quarterly audit closed · zero findings', when: '2 days ago', tone: 'ok' },
];

const PD_GAUGES = [
    { label: 'Approval probability',   value: 72, tone: 'warn',  unit: 'FDA · current draft' },
    { label: 'Submission readiness',   value: 84, tone: 'ok',    unit: 'BLA readiness · 30-day fwd' },
    { label: 'Timeline confidence',    value: 66, tone: 'warn',  unit: 'H1 2030 filing window' },
];

const QA_PROMPTS = [
    'What does EMA say about this indication?',
    'Show all submissions impacted by the new guidance.',
    'Which labels contain conflicting instructions?',
    'What is our Type C position on hierarchical testing?',
];

// -------------------------------------------------------------------
// Sidebar rendering + module switching
// -------------------------------------------------------------------
function renderSidebar() {
    const nav = $('#sidebarNav');
    if (!nav) return;
    // Group modules
    const groups = {};
    for (const m of MODULES) {
        if (!groups[m.group]) groups[m.group] = [];
        groups[m.group].push(m);
    }
    nav.innerHTML = Object.entries(groups)
        .map(
            ([g, items]) => `
        <div class="sidebar__group">
            <div class="sidebar__group-label">${g}</div>
        </div>
        ${items
            .map(
                (m) => `
            <button class="sidebar__item ${m.badge ? 'has-alert' : ''}" data-module-target="${m.id}"
                aria-label="${m.label}">
                <span class="sidebar__item-icon" aria-hidden="true">${m.icon}</span>
                <span class="sidebar__item-label">${m.label}</span>
                ${m.badge ? `<span class="sidebar__item-badge">${m.badge}</span>` : ''}
            </button>
        `
            )
            .join('')}
        `
        )
        .join('');

    nav.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-module-target]');
        if (!btn) return;
        activateModule(btn.dataset.moduleTarget);
        // Close mobile drawer
        $('#sidebar').classList.remove('is-open');
        $('#sidebarScrim').classList.remove('is-open');
    });
}

function activateModule(id) {
    // Hide all modules
    $$('.module').forEach((m) => m.classList.remove('is-active'));
    const target = document.querySelector(`.module[data-module="${id}"]`);
    if (target) target.classList.add('is-active');

    // Highlight sidebar
    $$('.sidebar__item').forEach((el) =>
        el.classList.toggle('is-active', el.dataset.moduleTarget === id)
    );

    // Update top nav title
    const mod = MODULES.find((m) => m.id === id);
    if (mod) {
        $('#navTitle').textContent = mod.label;
        $('#navSubtitle').textContent = mod.subtitle;
    }

    // Hide the floating chat FAB inside modules that already offer a chat
    const fab = $('#chatFab');
    if (fab) fab.style.display = (id === 'qa-copilot') ? 'none' : '';

    // Render on first activation
    switch (id) {
        case 'home':              renderHome(); break;
        case 'change-monitoring': renderChangeMonitoring(); break;
        case 'extraction':        renderExtraction(); break;
        case 'knowledge-graph':   renderKnowledgeGraph(); break;
        case 'qa-copilot':        renderQaCopilot(); break;
        case 'impact':            renderImpact(); break;
        case 'meetings':          renderMeetings(); break;
        case 'content':           renderContent(); break;
        case 'orchestrator':      renderOrchestrator(); break;
        case 'data-hub':          renderDataHub(); break;
        case 'compliance':        renderCompliance(); break;
        case 'predictive':        renderPredictive(); break;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function wireShell() {
    // Hamburger
    const ham = $('#hamburger');
    const scrim = $('#sidebarScrim');
    if (ham) {
        ham.addEventListener('click', () => {
            $('#sidebar').classList.add('is-open');
            scrim.classList.add('is-open');
        });
    }
    if (scrim) {
        scrim.addEventListener('click', () => {
            $('#sidebar').classList.remove('is-open');
            scrim.classList.remove('is-open');
        });
    }
    // Top-nav quick-goto
    $$('[data-goto]').forEach((el) =>
        el.addEventListener('click', () => activateModule(el.dataset.goto))
    );
}

// -------------------------------------------------------------------
// Home renderer
// -------------------------------------------------------------------
function renderHome() {
    const host = $('#homeGrid');
    if (!host || host.dataset.rendered) return;
    const modules = MODULES.filter((m) => m.id !== 'home');
    host.innerHTML = modules
        .map(
            (m, i) => `
        <button class="home-card" data-module-target="${m.id}" aria-label="Open ${m.label}">
            <div class="home-card__head">
                <span class="home-card__icon" aria-hidden="true">${m.icon}</span>
                <div>
                    <div class="home-card__num">Agent ${String(i).padStart(2, '0')}</div>
                    <h3>${m.label}</h3>
                </div>
            </div>
            <p>${m.subtitle}</p>
            <div class="home-card__foot">
                <span class="feat-chip">${m.group}</span>
                ${m.badge ? `<span class="feat-chip" style="color:var(--amber)">${m.badge} alerts</span>` : ''}
            </div>
        </button>
    `
        )
        .join('');
    host.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-module-target]');
        if (btn) activateModule(btn.dataset.moduleTarget);
    });
    host.dataset.rendered = '1';
}

// -------------------------------------------------------------------
// Change Monitoring
// -------------------------------------------------------------------
function renderChangeMonitoring() {
    const featHost = $('#cmFeats');
    const filterHost = $('#cmFilters');
    const feedHost = $('#cmFeed');
    const subsHost = $('#cmSubs');
    if (!feedHost) return;

    if (!featHost.dataset.rendered) {
        featHost.innerHTML = [
            'Continuous crawler', 'Version tracking', 'Change detection',
            'Alert subscriptions', 'Jurisdiction filters', 'Deadline detection',
            'Comment periods', 'Compliance-date monitoring',
        ].map((f) => `<span class="feat-chip">${f}</span>`).join('');
        featHost.dataset.rendered = '1';

        filterHost.innerHTML = ['All', ...CM_AGENCIES]
            .map((a, i) => `<button class="filter-chip ${i === 0 ? 'is-active' : ''}" data-agency="${a}">${a}</button>`)
            .join('');
        filterHost.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-chip');
            if (!btn) return;
            $$('.filter-chip', filterHost).forEach((b) => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            const agency = btn.dataset.agency;
            $$('.feed-row', feedHost).forEach((row) => {
                row.style.display = (agency === 'All' || row.dataset.agency === agency) ? '' : 'none';
            });
        });

        subsHost.innerHTML = CM_SUBS.map(
            (s) => `
            <div class="sidepanel__row"><span>${s.name}</span><span class="kbd">${s.kbd}</span></div>
        `
        ).join('');
    }

    feedHost.innerHTML = CM_FEED.map(
        (row) => `
        <article class="feed-row" role="listitem" data-tone="${row.tone}" data-agency="${row.agency}">
            <div class="feed-row__agency">${row.agency}<small>${row.region}</small></div>
            <div>
                <div class="feed-row__title">${row.title}</div>
                <div class="feed-row__meta"><span>${row.meta}</span></div>
            </div>
            <span class="feed-row__tag">${row.tag}</span>
        </article>
    `
    ).join('');
}

// -------------------------------------------------------------------
// Extraction Engine
// -------------------------------------------------------------------
function renderExtraction() {
    const featHost = $('#exFeats');
    const statsHost = $('#exStats');
    const itemsHost = $('#exItems');
    if (!itemsHost || itemsHost.dataset.rendered) return;

    featHost.innerHTML = [
        'PDF ingestion', 'Obligation extraction', 'Requirement extraction',
        'Entity recognition', 'Guidance extraction', 'Risk statements',
        'Authority positions', 'Precedent identification',
        'Structured requirements', 'Cross-document links',
    ].map((f) => `<span class="feat-chip">${f}</span>`).join('');

    statsHost.innerHTML = EX_STATS.map(
        (s) => `
        <div class="stat">
            <div class="stat__label">${s.label}</div>
            <div class="stat__value">${s.value}</div>
            <div class="stat__delta">${s.delta}</div>
        </div>
    `
    ).join('');

    itemsHost.innerHTML = EX_ITEMS.map(
        (it) => `
        <div class="extract-item">
            <h5>${it.kind} · ${it.title}</h5>
            <p>${it.sub}</p>
            <div class="extract-item__meta">${it.tags.map((t) => `<span>${t}</span>`).join('')}</div>
        </div>
    `
    ).join('');

    itemsHost.dataset.rendered = '1';
}

// -------------------------------------------------------------------
// Knowledge Graph
// -------------------------------------------------------------------
function renderKnowledgeGraph() {
    const svg = $('#kgSvg');
    const legend = $('#kgLegend');
    const detail = $('#kgDetail');
    const featHost = $('#kgFeats');
    if (!svg || svg.dataset.rendered) return;

    if (featHost) {
        featHost.innerHTML = [
            'Knowledge graph', 'Product↔regulation edges', 'Submission lineage',
            'Authority interaction graph', 'Label↔study links',
            'Safety↔submission maps', 'Precedent graph', 'Impact propagation',
        ].map((f) => `<span class="feat-chip">${f}</span>`).join('');
    }

    // Legend
    legend.innerHTML = Object.entries(KG_COLORS)
        .map(([t, c]) => `<span><em style="background:${c}"></em>${t}</span>`)
        .join('');

    // Edges
    const edgesG = KG_EDGES.map(([a, b]) => {
        const na = KG_NODES.find((n) => n.id === a);
        const nb = KG_NODES.find((n) => n.id === b);
        return `<path class="kg-edge" data-from="${a}" data-to="${b}"
            d="M ${na.x} ${na.y} Q ${(na.x + nb.x) / 2} ${(na.y + nb.y) / 2 - 30}
                ${nb.x} ${nb.y}" />`;
    }).join('');

    // Nodes
    const nodesG = KG_NODES.map((n) => {
        const color = KG_COLORS[n.type];
        return `<g class="kg-node" data-id="${n.id}" transform="translate(${n.x} ${n.y})">
            <circle r="26" fill="${color}" opacity="0.9" stroke="white" stroke-width="2" />
            <text y="4">${n.label}</text>
        </g>`;
    }).join('');

    svg.innerHTML = edgesG + nodesG;
    svg.dataset.rendered = '1';

    svg.addEventListener('click', (e) => {
        const g = e.target.closest('.kg-node');
        if (!g) return;
        const id = g.dataset.id;
        const node = KG_NODES.find((n) => n.id === id);
        // Highlight
        $$('.kg-node', svg).forEach((n) => n.classList.remove('is-selected'));
        $$('.kg-edge', svg).forEach((edge) => edge.classList.remove('is-active'));
        g.classList.add('is-selected');
        // Neighbours
        const neighbours = [];
        $$('.kg-edge', svg).forEach((edge) => {
            if (edge.dataset.from === id || edge.dataset.to === id) {
                edge.classList.add('is-active');
                const other = edge.dataset.from === id ? edge.dataset.to : edge.dataset.from;
                neighbours.push(KG_NODES.find((n) => n.id === other));
            }
        });
        detail.innerHTML = `
            <h4>${node.label} <span style="color:var(--text-muted); font-weight:500; font-size:12px;">${node.type}</span></h4>
            <p>Connected to <strong>${neighbours.length}</strong> entit${neighbours.length === 1 ? 'y' : 'ies'}.</p>
            <div class="agent-row" style="margin-top:10px">
                ${neighbours.map((nb) => `<span class="agent-pill">${nb.label} · ${nb.type}</span>`).join('')}
            </div>
            <p style="margin-top:14px; font-size:13px;">
                Impact propagation from this node would touch downstream submissions, labels
                and safety records connected via these edges.
            </p>
        `;
    });
}

// -------------------------------------------------------------------
// Q&A Copilot (full-page chat)
// -------------------------------------------------------------------
function renderQaCopilot() {
    const featHost = $('#qaFeats');
    const list = $('#qaList');
    const prompts = $('#qaPrompts');
    const form = $('#qaForm');
    const input = $('#qaInput');
    if (!list) return;

    if (!featHost.dataset.rendered) {
        featHost.innerHTML = [
            'Citation-grounded', 'Regulatory reasoning', 'Natural-language search',
            'Authority guidance interpretation', 'Cross-document questions',
            'Precedent retrieval', 'Explainable answers', 'Source-linked',
        ].map((f) => `<span class="feat-chip">${f}</span>`).join('');
        featHost.dataset.rendered = '1';
    }

    if (!prompts.dataset.rendered) {
        prompts.innerHTML = QA_PROMPTS.map(
            (p) => `<button type="button" class="chat-prompt" data-prompt="${p.replace(/"/g, '&quot;')}">${p}</button>`
        ).join('');
        prompts.addEventListener('click', (e) => {
            const btn = e.target.closest('.chat-prompt');
            if (!btn) return;
            input.value = btn.dataset.prompt;
            submit();
        });
        prompts.dataset.rendered = '1';
    }

    if (!list.dataset.seeded) {
        appendQa('agent',
            'I am grounded on our regulatory corpus (FDA, EMA, PMDA, ICH, and our internal ' +
            'archives). Ask any question — every answer will cite its source.');
        list.dataset.seeded = '1';
    }

    if (!form.dataset.wired) {
        form.addEventListener('submit', (e) => { e.preventDefault(); submit(); });
        form.dataset.wired = '1';
    }

    function submit() {
        const q = input.value.trim();
        if (!q) return;
        appendQa('user', q);
        input.value = '';
        const typing = document.createElement('li');
        typing.className = 'chat-msg chat-msg--agent chat-msg--typing';
        typing.innerHTML = '<div class="chat-msg__bubble"><span></span><span></span><span></span></div>';
        list.appendChild(typing);
        list.scrollTop = list.scrollHeight;
        setTimeout(() => {
            typing.remove();
            const { answer, cites } = mockAnswer(q);
            appendQa('agent', answer, cites);
        }, 720);
    }

    function appendQa(role, text, cites) {
        const li = document.createElement('li');
        li.className = `chat-msg chat-msg--${role}`;
        const bubble = document.createElement('div');
        bubble.className = 'chat-msg__bubble';
        bubble.textContent = text;
        li.appendChild(bubble);
        if (cites && cites.length) {
            const row = document.createElement('div');
            row.className = 'chat-msg__cites';
            row.innerHTML = cites.map((c) => `<span class="citation">${c}</span>`).join('');
            li.appendChild(row);
        }
        list.appendChild(li);
        list.scrollTop = list.scrollHeight;
    }
}

// -------------------------------------------------------------------
// Impact Assessment
// -------------------------------------------------------------------
function renderImpact() {
    const featHost = $('#imFeats');
    const grid = $('#impactGrid');
    if (!grid || grid.dataset.rendered) return;

    featHost.innerHTML = [
        'Impact scoring', 'Product impact', 'Trial impact', 'Manufacturing impact',
        'Safety impact', 'Supply-chain impact', 'Portfolio risk', 'Priority ranking',
    ].map((f) => `<span class="feat-chip">${f}</span>`).join('');

    grid.innerHTML = IMPACT.map(
        (im) => `
        <div class="impact" data-tone="${im.tone}">
            <div class="impact__label">${im.label}</div>
            <div class="impact__val">${im.value}${im.label === 'Portfolio' ? '' : ''}</div>
            <div class="impact__bar"><span style="width:${Math.min(100, im.value * (im.label === 'Portfolio' ? 1 : 8))}%"></span></div>
            <div class="impact__note">${im.note}</div>
        </div>
    `
    ).join('');
    grid.dataset.rendered = '1';
}

// -------------------------------------------------------------------
// Meetings
// -------------------------------------------------------------------
function renderMeetings() {
    const featHost = $('#mtFeats');
    const list = $('#mtList');
    if (!list || list.dataset.rendered) return;

    featHost.innerHTML = [
        'Transcript ingestion', 'Authority interaction analysis', 'Commitment tracking',
        'Agency feedback', 'Action items', 'Sentiment tracking',
        'Meeting → submission linkage', 'Veeva integration',
    ].map((f) => `<span class="feat-chip">${f}</span>`).join('');

    list.innerHTML = MEETINGS.map(
        (m) => `
        <article class="meeting">
            <div class="meeting__head">
                <div class="meeting__title">${m.title}</div>
                <div class="meeting__meta">${m.when}</div>
            </div>
            <span class="meeting__badge">${m.badge}</span>
            <div class="meeting__commit">
                ${m.commits.map((c) => `<span><b>${c.who}:</b> ${c.what}</span>`).join('')}
            </div>
        </article>
    `
    ).join('');
    list.dataset.rendered = '1';
}

// -------------------------------------------------------------------
// Content Generation
// -------------------------------------------------------------------
function renderContent() {
    const featHost = $('#ctFeats');
    const grid = $('#ctTemplates');
    const draft = $('#ctDraft');
    if (!grid || grid.dataset.rendered) return;

    featHost.innerHTML = [
        'Draft submission', 'Response letter', 'Label proposal',
        'Briefing package', 'Scientific justification', 'Regulatory briefing',
        'Anticipated Q&A', 'Regulatory summary',
    ].map((f) => `<span class="feat-chip">${f}</span>`).join('');

    grid.innerHTML = CT_TEMPLATES.map(
        (t, i) => `
        <button class="tpl ${i === 0 ? 'is-active' : ''}" data-tpl="${t.id}">
            <div class="tpl__name">${t.name}</div>
            <div class="tpl__meta">${t.meta}</div>
        </button>
    `
    ).join('');

    grid.addEventListener('click', (e) => {
        const btn = e.target.closest('.tpl');
        if (!btn) return;
        $$('.tpl', grid).forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        setDraft(btn.dataset.tpl);
    });

    function setDraft(id) {
        draft.innerHTML =
            '<span class="draft__watermark">Draft · human review required</span>' +
            (CT_DRAFTS[id] || '');
    }
    setDraft(CT_TEMPLATES[0].id);
    grid.dataset.rendered = '1';
}

// -------------------------------------------------------------------
// Orchestrator
// -------------------------------------------------------------------
function renderOrchestrator() {
    const featHost = $('#orFeats');
    const agents = $('#orAgents');
    const wf = $('#orWorkflow');
    if (!wf || wf.dataset.rendered) return;

    featHost.innerHTML = [
        'Master planner', 'Task planning', 'Agent delegation', 'Workflow execution',
        'Human approval checkpoints', 'Agent collaboration', 'Work queue', 'Audit trail',
    ].map((f) => `<span class="feat-chip">${f}</span>`).join('');

    agents.innerHTML = OR_AGENTS.map(
        (a) => `<span class="agent-pill">${a}</span>`
    ).join('');

    wf.innerHTML = OR_WORKFLOW.map(
        (row) => `
        <div class="orch__row">
            <span class="orch__agent">${row.agent}</span>
            <span class="orch__arrow">→</span>
            <span class="orch__task">${row.task}</span>
            <span class="orch__status" data-tone="${row.status}">${
                { done: 'Done', run: 'Running…', wait: 'Queued', ok: 'Ok' }[row.status] || row.status
            }</span>
        </div>
    `
    ).join('');
    wf.dataset.rendered = '1';
}

// -------------------------------------------------------------------
// Data Hub
// -------------------------------------------------------------------
function renderDataHub() {
    const featHost = $('#dhFeats');
    const stats = $('#dhStats');
    const repo = $('#dhRepo');
    if (!repo || repo.dataset.rendered) return;

    featHost.innerHTML = [
        'Regulatory data fabric', 'Unified repository', 'FHIR-native storage',
        'Metadata catalog', 'Archive mining', 'API access', 'Submission repo',
        'Source-of-truth management',
    ].map((f) => `<span class="feat-chip">${f}</span>`).join('');

    stats.innerHTML = DH_STATS.map(
        (s) => `
        <div class="stat">
            <div class="stat__label">${s.label}</div>
            <div class="stat__value">${s.value}</div>
            <div class="stat__delta">${s.delta}</div>
        </div>
    `
    ).join('');

    repo.innerHTML = DH_REPO.map(
        (r) => `
        <div class="repo__row">
            <span class="repo__icon">${r.icon}</span>
            <span class="repo__name">${r.name}</span>
            <span class="repo__count">${r.count}</span>
            <span class="repo__tag">${r.tag}</span>
        </div>
    `
    ).join('');
    repo.dataset.rendered = '1';
}

// -------------------------------------------------------------------
// Compliance & Audit
// -------------------------------------------------------------------
function renderCompliance() {
    const featHost = $('#cpFeats');
    const list = $('#cpAudit');
    if (!list || list.dataset.rendered) return;

    featHost.innerHTML = [
        'Source citations', 'Evidence lineage', 'Audit logs', 'Human approvals',
        'Decision traceability', 'Version history', 'GxP validation',
        '21 CFR Part 11', 'Model governance', 'Responsible AI',
    ].map((f) => `<span class="feat-chip">${f}</span>`).join('');

    list.innerHTML = CP_AUDIT.map(
        (r) => `
        <div class="audit__row" data-tone="${r.tone}">
            <span class="audit__who">${r.who}</span>
            <span class="audit__what">${r.what}</span>
            <span class="audit__when">${r.when}</span>
        </div>
    `
    ).join('');
    list.dataset.rendered = '1';
}

// -------------------------------------------------------------------
// Predictive Intelligence — gauges
// -------------------------------------------------------------------
function renderPredictive() {
    const featHost = $('#pdFeats');
    const host = $('#pdGauges');
    if (!host || host.dataset.rendered) return;

    featHost.innerHTML = [
        'Approval probability', 'Timeline forecasting', 'Label change prediction',
        'Submission readiness', 'Risk prediction', 'Scenario simulation',
        'Competitive monitoring', 'Authority behavior learning',
    ].map((f) => `<span class="feat-chip">${f}</span>`).join('');

    // Half-circle gauge: arc from (10,90) → (170,90), radius 80
    // Path length ≈ π * 80 ≈ 251.3
    const LEN = 251.3;
    host.innerHTML = PD_GAUGES.map(
        (g) => `
        <div class="gauge" data-tone="${g.tone}">
            <div class="gauge__label">${g.label}</div>
            <svg viewBox="0 0 180 100" aria-hidden="true">
                <path class="gauge__track" d="M 10 90 A 80 80 0 0 1 170 90" />
                <path class="gauge__fill"  d="M 10 90 A 80 80 0 0 1 170 90"
                    stroke-dasharray="${LEN}" stroke-dashoffset="${LEN * (1 - g.value / 100)}" />
            </svg>
            <div class="gauge__val">${g.value}%</div>
            <div class="gauge__unit">${g.unit}</div>
        </div>
    `
    ).join('');
    host.dataset.rendered = '1';
}

// -------------------------------------------------------------------
// Init
// -------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    renderSidebar();
    wireShell();
    renderDomainPreview();
    wireDropzone();
    wireNav();
    wireSegmented();
    wireSheet();
    wireChat();
    activateModule('home');
});
