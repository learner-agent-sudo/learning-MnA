# Learning M&A — Interactive APA Workflow Visualizer

An interactive, browser-based walkthrough of a U.S. private-company **Asset
Purchase Agreement (APA)** transaction, from strategy through post-closing.
The site renders the deal as a 9-stage flow diagram; clicking any stage opens
a side panel with the documents produced at that stage, the contract clauses
that typically appear, and a glossary for jargon.

The clause content is grounded in the [CUAD](https://huggingface.co/datasets/theatticusproject/cuad-qa)
(Contract Understanding Atticus Dataset) corpus, augmented with hand-authored
clauses for APA-specific provisions that CUAD under-represents.

## v1 scope

- **Deal type:** Asset Purchase Agreement only. SPA and Merger paths are shown
  greyed-out at the LOI branching node ("coming soon").
- **Audience:** mixed beginner / practitioner. A depth toggle controls how
  much detail the side panel shows.
- **Hosting:** static site (Next.js `output: 'export'`), no backend.
- **Data:** CUAD pre-processed at build time into `public/clauses.json` plus
  hand-authored gap-fill clauses in `data/apa-gap-fills.json`.

## The 9 stages

1. **Strategy** *(pre-process, dashed border)*
2. **NDA** — confidentiality
3. **LOI / Term Sheet** — non-binding intent (deal-type branch point)
4. **Due Diligence** — single node in v1; sub-streams later
5. **APA Drafting & Negotiation**
6. **Signing**
7. **Pre-Closing** — covenants, regulatory, conditions
8. **Closing** — bill of sale, assignments, funds flow
9. **Post-Closing** — true-up, indemnification, integration

See `docs/workflow-mapping.md` for the per-stage documents, clauses, and
glossary terms, and `docs/architecture.md` for the tech stack and file
layout.

## Disclaimer

This is an **educational visualizer**, not legal advice. Clause text shown
on the site is excerpted from the public CUAD dataset (CC BY 4.0) or
hand-authored as illustrative examples. Real transactions involve
jurisdiction-specific drafting and counsel.

## Status

Pre-implementation. The kickoff prompt for the build session is in
`PROMPT.md`.
