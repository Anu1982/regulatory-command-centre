# Regulatory Intelligence AI Agent — Demo

Apple-inspired, no-build prototype of the concept on
[docs/regulatory-intelligence-ai-agent.md](../docs/regulatory-intelligence-ai-agent.md).

## Run it

Double-click [index.html](./index.html) — or, from a terminal:

```powershell
Start-Process .\index.html
```

No dependencies. No build step. Works offline.

For a live-reload developer experience, serve the folder from any static server:

```powershell
# From the repo root
npx --yes serve demo
```

## Run it on GitHub Codespaces

The repository ships with a `.devcontainer` that auto-starts the demo on port 8080.

1. On the GitHub repo page, click **Code** → **Codespaces** → **Create codespace on main**.
2. Wait for the container to build (~2 min on first launch).
3. The Simple Browser preview opens automatically on port 8080.
4. Share the `https://…-8080.app.github.dev` URL from the Ports tab if you want
   other people to try the demo.

See [.devcontainer/README.md](../.devcontainer/README.md) for details.

## What it demonstrates

- Drop or select a draft protocol (any file — the demo does not read its contents).
- A simulated analysis pipeline scores the protocol across the six regulatory
  design domains from the workshop slide:
  - **D1** Patient Population
  - **D2** Primary Endpoint
  - **D3** Statistical Design
  - **D4** Comparator / Control
  - **D5** Innovative Design
  - **D6** Safety Framework
- Results dashboard shows the **Regulatory Alignment Score** with:
  - Per-domain scores and status (Aligned, Needs attention, Divergent).
  - Cited precedent chips on every finding.
  - Bottom-sheet detail view listing the actual FDA / EMA / internal source
    quotations behind each score.
  - Data-lineage panel separating **internal** (Type B/C and EOP2 minutes, FDA
    and EMA responses, prior protocols and CSRs) from **public** (FDA and EMA
    guidance, ICH, AdCom transcripts, ClinicalTrials.gov, EU CTR, FAERS).

## Design system

- System font stack (`-apple-system`, `SF Pro Display`, `Inter` fallback).
- iOS 17 / macOS Sonoma system palette (`#0A84FF`, `#30D158`, `#FF9F0A`, ...).
- Frosted-glass navigation, spring easing, iOS-style bottom sheet, segmented
  control, and pill buttons.
- Automatic light and dark mode via `prefers-color-scheme`.
- Respects `prefers-reduced-motion`.
- Responsive down to phone widths.

## Compliance note

Every finding, precedent quotation, and score in the demo is **illustrative
only** — placeholder content for the workshop conversation. No real
submissions, patient data, or agency correspondence are included.
