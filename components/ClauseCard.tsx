import { ClauseRef } from '@/lib/workflow';
import { getClause, getCuadByCategory } from '@/lib/clauses';

interface Props {
  clause: ClauseRef;
}

const CARD = 'rounded-md bg-white p-4 ring-1 ring-slate-200/70';
const HEADER = 'flex items-start justify-between gap-2';
const TITLE = 'text-sm font-semibold leading-snug';
const PILL_BASE =
  'shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider';
const DISCLOSURE =
  'mt-2 inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-ink hover:border-accent hover:text-accent';

export function ClauseCard({ clause }: Props) {
  if (clause.provenance === 'cuad') {
    const examples = getCuadByCategory(clause.category);
    return (
      <article className={CARD}>
        <header className={HEADER}>
          <h4 className={TITLE}>{clause.category}</h4>
          <ProvenancePill provenance="cuad" />
        </header>
        {examples.length === 0 ? (
          <p className="mt-2 text-xs italic text-muted">
            CUAD excerpt not loaded yet for this category.
          </p>
        ) : (
          <ul className="mt-3 space-y-3.5">
            {examples.map((ex) => {
              const hasContext = !!(ex.context_before || ex.context_after);
              return (
                <li key={ex.id} className="text-sm">
                  <div className="text-[11px] uppercase tracking-wide text-muted">
                    {ex.contract_type ?? 'Contract'} · {ex.contract_title}
                  </div>
                  <blockquote className="mt-1.5 border-l-2 border-blue-200 pl-3 text-ink/90">
                    {ex.excerpt}
                  </blockquote>
                  {hasContext && (
                    <details className="group">
                      <summary className={DISCLOSURE + ' list-none'}>
                        <span className="transition group-open:rotate-90">▸</span>
                        <span className="group-open:hidden">Show in context</span>
                        <span className="hidden group-open:inline">Hide context</span>
                      </summary>
                      <div className="mt-2 whitespace-pre-wrap rounded bg-slate-50 p-3 text-xs leading-relaxed text-ink/80">
                        {ex.context_before && (
                          <span className="text-muted">…{ex.context_before}</span>
                        )}
                        <mark className="rounded bg-amber-100 px-0.5">
                          {ex.excerpt}
                        </mark>
                        {ex.context_after && (
                          <span className="text-muted">{ex.context_after}…</span>
                        )}
                      </div>
                    </details>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </article>
    );
  }

  const gf = getClause(clause.id);
  if (!gf || gf.source !== 'hand-authored') {
    return (
      <article className="rounded-md bg-amber-50 p-4 text-sm ring-1 ring-amber-300">
        Missing gap-fill: <code>{clause.id}</code>
      </article>
    );
  }
  return (
    <article className={CARD}>
      <header className={HEADER}>
        <h4 className={TITLE}>{gf.category}</h4>
        <ProvenancePill provenance="hand-authored" />
      </header>
      <p className="mt-2 text-sm leading-relaxed text-muted">{gf.description}</p>
      <details className="group">
        <summary className={DISCLOSURE + ' list-none'}>
          <span className="transition group-open:rotate-90">▸</span>
          <span className="group-open:hidden">Sample drafting</span>
          <span className="hidden group-open:inline">Hide sample</span>
        </summary>
        <blockquote className="mt-2 border-l-2 border-amber-200 pl-3 text-sm text-ink/90">
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
        PILL_BASE +
        ' ' +
        (isCuad ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-800')
      }
      title={
        isCuad
          ? 'Excerpt drawn from the CUAD dataset (Atticus Project, CC BY 4.0).'
          : 'Hand-authored illustrative drafting — not legal advice.'
      }
    >
      {isCuad ? 'CUAD' : 'Hand'}
    </span>
  );
}
