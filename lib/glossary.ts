import { STAGES, GlossaryTerm } from './workflow';

const seen = new Set<string>();
const collected: GlossaryTerm[] = [];
for (const stage of STAGES) {
  for (const t of stage.glossary) {
    const key = t.term.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    collected.push(t);
  }
}

export const GLOSSARY: GlossaryTerm[] = collected;

export const GLOSSARY_BY_TERM: Record<string, string> = Object.fromEntries(
  collected.map((g) => [g.term.toLowerCase(), g.definition])
);

export function defineTerm(term: string): string | undefined {
  return GLOSSARY_BY_TERM[term.toLowerCase()];
}
