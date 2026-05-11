import { ClauseRef } from '@/lib/workflow';
import { getClause, getCuadByCategory } from '@/lib/clauses';

interface Props {
  clause: ClauseRef;
}

export function ClauseCard({ clause }: Props) {
  if (clause.provenance === 'cuad') {
    const examples =
      getCuadByCategory(clause.category).length > 0
        ? getCuadByCategory(clause.category)
        : [];
    return (
      <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <header className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-semibold">{clause.category}</h4>
          <ProvenancePill provenance="cuad" />
        </header>
        {examples.length === 0 ? (
          <p className="mt-2 text-xs italic text-muted">
            CUAD excerpt not loaded yet (stub data). Will populate after running
            scripts/extract_cuad.py.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {examples.map((ex) => (
              <li key={ex.id} className="text-sm">
                <div className="text-xs text-muted">
                  {ex.contract_type ?? 'Contract'} · {ex.contract_title}
                </div>
                <blockquote className="mt-1 border-l-2 border-slate-200 pl-3 text-ink/90">
                  {ex.excerpt}
                </blockquote>
              </li>
            ))}
          </ul>
        )}
      </article>
    );
  }

  const gf = getClause(clause.id);
  if (!gf || gf.source !== 'hand-authored') {
    return (
      <article className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm">
        Missing gap-fill: <code>{clause.id}</code>
      </article>
    );
  }
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <header className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold">{gf.category}</h4>
        <ProvenancePill provenance="hand-authored" />
      </header>
      <p className="mt-2 text-sm text-muted">{gf.description}</p>
      <details className="mt-3">
        <summary className="cursor-pointer text-xs font-medium text-accent">
          Sample drafting
        </summary>
        <blockquote className="mt-2 border-l-2 border-slate-200 pl-3 text-sm text-ink/90">
          {gf.example_text}
        </blockquote>
      </details>
    </article>
  );
}

function ProvenancePill({ provenance }: { provenance: 'cuad' | 'hand-authored' }) {
  const isCuad = provenance === 'cuad';
  return (
    <span
      className={
        'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ' +
        (isCuad
          ? 'bg-blue-100 text-blue-700'
          : 'bg-amber-100 text-amber-800')
      }
      title={
        isCuad
          ? 'Excerpt drawn from the CUAD dataset (Atticus Project, CC BY 4.0).'
          : 'Hand-authored illustrative drafting — not legal advice.'
      }
    >
      {isCuad ? 'CUAD' : 'Hand-authored'}
    </span>
  );
}
