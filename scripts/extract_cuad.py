#!/usr/bin/env python3
"""Extract a small, deduped subset of CUAD-QA into public/clauses.json.

Source: chenghao/cuad_qa on Hugging Face, a parquet-backed mirror of CUAD
(Contract Understanding Atticus Dataset; 510 commercial contracts annotated
by lawyers across 41 clause categories). The mirror is used instead of the
official `theatticusproject/cuad-qa` because the latter ships a Python
loading script that requires `trust_remote_code=True` and is not exposed
via the HF Dataset Viewer.

Schema: each row has `question` (the bare category label, e.g.
"Anti-Assignment"), `answers.text` (list of labeled spans), and `title`
(contract filename). Many rows have empty answers — that simply means the
category was not present in that contract.

We keep up to MAX_PER_CATEGORY non-empty answers per category, capped at
MAX_EXCERPT_CHARS chars, and write them to public/clauses.json with stable
sha1-derived ids.

Run:
    pip install datasets
    python scripts/extract_cuad.py
"""

from __future__ import annotations

import hashlib
import json
import pathlib
import re
import sys

CUAD_CATEGORIES_WE_USE = [
    "Governing Law",
    "Anti-Assignment",
    "Change Of Control",
    "Most Favored Nation",
    "Exclusivity",
    "Non-Compete",
    "No-Solicit Of Employees",
    "No-Solicit Of Customers",
    "Termination For Convenience",
    "Audit Rights",
    "Insurance",
    "IP Ownership Assignment",
    "License Grant",
    "Cap On Liability",
    "Non-Disparagement",
    "Notice Period To Terminate Renewal",
]

MAX_PER_CATEGORY = 3
MAX_EXCERPT_CHARS = 1200
CONTEXT_BEFORE_CHARS = 250
CONTEXT_AFTER_CHARS = 450
OUT_PATH = pathlib.Path(__file__).resolve().parent.parent / "public" / "clauses.json"


def slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def stable_id(category: str, title: str, excerpt: str) -> str:
    digest = hashlib.sha1(
        f"{category}|{title}|{excerpt[:200]}".encode("utf-8")
    ).hexdigest()[:10]
    return f"cuad-{slug(category)}-{digest}"


def extract_category(question: str) -> str | None:
    """Accept either the trimmed mirror format (bare category) or the
    original CUAD-QA prompt ('... related to "X" that should be ...').
    """
    if not question:
        return None
    match = re.search(r'related to\s+"([^"]+)"', question)
    if match:
        return match.group(1)
    return question.strip()


def looks_like_dup(existing: list[dict], excerpt: str) -> bool:
    prefix = excerpt[:200].strip().lower()
    return any(e["excerpt"][:200].strip().lower() == prefix for e in existing)


def contract_type_from_title(title: str) -> str | None:
    """Best-effort tag from CUAD's filename-style titles."""
    t = title.lower()
    patterns = [
        ("license", "License Agreement"),
        ("distribution", "Distribution Agreement"),
        ("supply", "Supply Agreement"),
        ("services", "Services Agreement"),
        ("consult", "Consulting Agreement"),
        ("employ", "Employment Agreement"),
        ("marketing", "Marketing Agreement"),
        ("manufactur", "Manufacturing Agreement"),
        ("reseller", "Reseller Agreement"),
        ("hosting", "Hosting Agreement"),
        ("development", "Development Agreement"),
        ("franchise", "Franchise Agreement"),
        ("joint venture", "Joint Venture Agreement"),
        ("partnership", "Partnership Agreement"),
        ("settlement", "Settlement Agreement"),
        ("merger", "Merger Agreement"),
        ("purchase", "Purchase Agreement"),
        ("agency", "Agency Agreement"),
    ]
    for needle, label in patterns:
        if needle in t:
            return label
    return None


def main() -> int:
    try:
        from datasets import load_dataset
    except ImportError:
        print("ERROR: `datasets` not installed. Run: pip install datasets", file=sys.stderr)
        return 1

    print("Loading chenghao/cuad_qa (parquet mirror of CUAD-QA) ...", file=sys.stderr)
    ds = load_dataset("chenghao/cuad_qa", split="train")

    # Case-insensitive lookup: many CUAD category labels use unusual casing
    # (e.g., "Ip Ownership Assignment"). Match flexibly, write canonical.
    wanted_lc = {c.lower(): c for c in CUAD_CATEGORIES_WE_USE}
    by_cat: dict[str, list[dict]] = {}

    for row in ds:
        raw_category = extract_category(row["question"])
        if not raw_category:
            continue
        canonical = wanted_lc.get(raw_category.lower())
        if canonical is None:
            continue
        category = canonical
        answers_field = row.get("answers", {}) or {}
        answers = answers_field.get("text", []) or []
        starts = answers_field.get("answer_start", []) or []
        if not answers:
            continue
        bucket = by_cat.setdefault(category, [])
        context = row.get("context") or ""
        for idx, raw in enumerate(answers):
            ans = (raw or "").strip()
            if not ans or len(bucket) >= MAX_PER_CATEGORY:
                continue
            if looks_like_dup(bucket, ans):
                continue
            excerpt = ans[:MAX_EXCERPT_CHARS]
            title = row.get("title") or "Contract"
            entry = {
                "id": stable_id(category, title, excerpt),
                "category": category,
                "contract_title": title,
                "excerpt": excerpt,
                "source": "cuad",
            }
            ctype = contract_type_from_title(title)
            if ctype:
                entry["contract_type"] = ctype
            # Pull a context window from the contract around the excerpt.
            start = starts[idx] if idx < len(starts) else -1
            if context and isinstance(start, int) and start >= 0:
                before_start = max(0, start - CONTEXT_BEFORE_CHARS)
                after_end = min(len(context), start + len(ans) + CONTEXT_AFTER_CHARS)
                before = context[before_start:start]
                after = context[start + len(ans):after_end]
                if before.strip():
                    entry["context_before"] = before
                if after.strip():
                    entry["context_after"] = after
            bucket.append(entry)
        if all(len(by_cat.get(c, [])) >= MAX_PER_CATEGORY for c in CUAD_CATEGORIES_WE_USE):
            break

    out: list[dict] = []
    for cat in CUAD_CATEGORIES_WE_USE:
        for entry in by_cat.get(cat, []):
            ordered = {"id": entry["id"], "category": entry["category"]}
            if "contract_type" in entry:
                ordered["contract_type"] = entry["contract_type"]
            ordered["contract_title"] = entry["contract_title"]
            if "context_before" in entry:
                ordered["context_before"] = entry["context_before"]
            ordered["excerpt"] = entry["excerpt"]
            if "context_after" in entry:
                ordered["context_after"] = entry["context_after"]
            ordered["source"] = entry["source"]
            out.append(ordered)

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(out, indent=2) + "\n", encoding="utf-8")

    print(f"Wrote {len(out)} clauses across {len(by_cat)} categories to {OUT_PATH}", file=sys.stderr)
    for cat in CUAD_CATEGORIES_WE_USE:
        print(f"  {cat}: {len(by_cat.get(cat, []))}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
