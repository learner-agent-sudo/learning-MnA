import clausesJson from '@/public/clauses.json';
import gapFillsJson from '@/data/apa-gap-fills.json';

export interface CuadClause {
  id: string;
  category: string;
  contract_title: string;
  contract_type?: string;
  excerpt: string;
  context_before?: string;
  context_after?: string;
  source: 'cuad';
}

export interface GapFillClause {
  id: string;
  category: string;
  description: string;
  example_text: string;
  source: 'hand-authored';
}

export type AnyClause = CuadClause | GapFillClause;

const CUAD: CuadClause[] = clausesJson as CuadClause[];
const GAP_FILLS: GapFillClause[] = gapFillsJson as GapFillClause[];

const BY_ID: Record<string, AnyClause> = {};
for (const c of CUAD) BY_ID[c.id] = c;
for (const g of GAP_FILLS) BY_ID[g.id] = g;

const CUAD_BY_CATEGORY: Record<string, CuadClause[]> = {};
for (const c of CUAD) {
  (CUAD_BY_CATEGORY[c.category] ||= []).push(c);
}

export function getClause(id: string): AnyClause | undefined {
  return BY_ID[id];
}

export function getCuadByCategory(category: string): CuadClause[] {
  return CUAD_BY_CATEGORY[category] ?? [];
}
