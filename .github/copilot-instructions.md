# Copilot Instructions — Regulatory Copilot

## Project Context

Boehringer Ingelheim Regulatory Copilot. The system helps Regulatory Affairs teams draft, review, and manage submissions to global health authorities (FDA, EMA, PMDA, and others).

## Primary Personas

- Regulatory Affairs lead preparing an IND, NDA, MAA, or CTD module
- Regulatory writer authoring or reviewing submission narratives
- Regulatory strategist mapping requirements across jurisdictions

## Source Materials

- Raw inputs live in `inputs/`.
- Curated outputs and design docs live in `docs/`.
- Research, planning, and implementation artifacts land in `.copilot-tracking/`.

## Conventions

- Follow commit-message, PR, markdown, and writing-style rules from `microsoft/hve-core` (auto-loaded via the ISE HVE Essentials extension).
- Use the RPI workflow for non-trivial features: `/task-research` → `/task-plan` → `/task-implement` → `/task-review`.
- Draft commits with `/git-commit` and pull requests with `/pull-request`.
- Cite health-authority guidance by document name, version, and section when generating regulatory content.
- Keep product features user-centric. Separate enabler work (APIs, document ingestion, infrastructure) into its own backlog items.

## Compliance Notes

- Content generated for regulatory submissions must be reviewed by qualified personnel.
- Do not commit confidential customer data or unredacted prior submissions.

## Domain Terms

Add glossary entries (CTD, eCTD, IND, NDA, MAA, ICH, SPL, and others) as they emerge during workshops.

## Tech Stack

To be decided during discovery.
