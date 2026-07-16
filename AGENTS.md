# Agents Quick Start — Regulatory Copilot

## Repository Overview

Working repository for the Boehringer Ingelheim Regulatory Copilot engagement.

## Where Things Live

- `inputs/` — raw source materials from the customer (guidance, templates, prior submissions).
- `docs/` — curated outputs, design notes, decisions, compliance notes.
- `.github/copilot-instructions.md` — project context loaded into every Copilot session.
- `.copilot-tracking/` — RPI research, plan, and implementation artifacts, plus PR drafts.

## Common Workflows

- Draft a commit message: `/git-commit`
- Plan a feature: `/task-research` → `/task-plan` → `/task-implement`
- Prepare a pull request: `/pull-request`
- Review a pull request: invoke the `PR Review` agent

## Build, Test, Lint

To be defined once the tech stack is chosen.

## House Rules

- Follow `microsoft/hve-core` instructions (auto-loaded via the ISE HVE Essentials extension).
- Never commit unredacted submissions, patient data, or customer-confidential content.
- Cite health-authority guidance precisely when generating regulatory language.
- Ask before making destructive changes to shared branches.
