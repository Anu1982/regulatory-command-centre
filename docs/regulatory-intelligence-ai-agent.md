# Regulatory Intelligence AI Agent

> Source: Boehringer Ingelheim — June 2026 Workshop, Build Collaboration deck, slide 90 (internal use only).

![Regulatory Intelligence AI Agent overview](./regulatory-intelligence-ai-agent.png)

> The rendered PNG above is captured from the pasted workshop slide. If the image is missing, save the pasted screenshot as `docs/regulatory-intelligence-ai-agent.png` (the demo also loads a text fallback).

## Purpose

Scores a draft protocol against regulatory precedent so trial design aligns with what FDA and EMA have accepted before.

## What it is

An AI agent that ingests a draft protocol and continuously scores each design element against a corpus of **FDA and EMA decision letters, guidance, AdCom transcripts, and internal regulatory dossiers**, producing a **Regulatory Alignment Score** with cited precedent on every finding.

## Data it draws on

### Internal — our prior agency dialogue

Type B/C and EOP2 minutes, FDA and EMA responses, prior protocols and CSRs — the agency's positions on our own molecules. This proprietary history is the edge public data cannot give.

### Public — the precedent base

FDA and EMA guidance, ICH, AdCom transcripts, ClinicalTrials.gov, EU CTR, FAERS.

## Six regulatory design domains it scores

| ID | Domain | Focus |
| -- | ------ | ----- |
| D1 | Patient Population | Inclusion/exclusion and biomarker fit versus label |
| D2 | Primary Endpoint | Surrogate versus clinical; COA/PRO status |
| D3 | Statistical Design | Multiplicity, interim, estimand |
| D4 | Comparator / Control | Standard of care, external and synthetic-control precedent |
| D5 | Innovative Design | Adaptive, Bayesian, platform |
| D6 | Safety Framework | Monitoring plan, DSMB, stopping rules |

## How it informs clinical trial design

- **Flags divergence early.** Catches design choices regulators have questioned, before first-patient-in.
- **Surfaces agency precedent.** Shows prior FDA and EMA positions on population, endpoints, and comparators.
- **De-risks and accelerates.** Lowers regulatory risk and shortens the path to approval readiness.

## Demo

A working Apple-style prototype of this agent lives in [demo/index.html](../demo/index.html). Open the file in any modern browser — no build step required.
