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

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static export to ./out/
```

## Populating CUAD clauses

`public/clauses.json` ships with a 3-entry stub. To replace it with real
CUAD excerpts (~16 categories × up to 3 examples each):

```bash
pip install datasets
python scripts/extract_cuad.py
```

The script downloads `chenghao/cuad_qa` (a parquet mirror of CUAD-QA)
from Hugging Face and writes deduped excerpts to `public/clauses.json`.
It needs network access to `huggingface.co`.

A GitHub Actions workflow at `.github/workflows/extract-cuad.yml`
performs the same extraction on demand (`workflow_dispatch`) or when the
script changes, and commits the result back to the branch. Trigger it
from the Actions tab in the GitHub UI when you want a fresh pull.
