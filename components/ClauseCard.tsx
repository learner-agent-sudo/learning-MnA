import { ClauseRef } from '@/lib/workflow';
import { getClause, getCuadByCategory } from '@/lib/clauses';

interface Props {
  clause: ClauseRef;
}

const CARD =
  'group rounded-md bg-white ring-1 ring-slate-200/70 [&[open]]:ring-slate-300';
const SUMMARY =
  'flex cursor-pointer list-none items-center justify-between gap-2 p-3 hover:bg-slate-50 [&::-webkit-details-marker]:hidden';
const CHEVRON =
  'inline-block w-3 shrink-0 text-muted transition-transform group-open:rotate-90';
const TITLE = 'flex-1 text-sm font-semibold leading-snug';
const PILL_BASE =
  'shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider';
const BODY = 'border-t border-slate-200/70 px-3 pb-3 pt-2';
const INNER_DISCLOSURE =
  'mt-2 inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-ink hover:border-accent hover:text-accent';

export function ClauseCard({ clause }: Props) {
  if (clause.provenance === 'cuad') {
    const examples = getCuadByCategory(clause.category);
    const empty = examples.length === 0;
    return (
      <details className={CARD}>
        <summary className={SUMMARY}>
          <span className={CHEVRON}>▸</span>
          <span className={TITLE}>{clause.category}</span>
          {empty && (
            <span className="shrink-0 text-[10px] italic text-muted">
              no data
            </span>
          )}
          <ProvenancePill provenance="cuad" />
        </summary>
        <div className={BODY}>
          {empty ? (
            <p className="text-xs italic text-muted">
              CUAD excerpt not loaded for this category.
            </p>
          ) : (
            <ul className="space-y-3.5">
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
                      <details className="group/ctx">
                        <summary className={INNER_DISCLOSURE + ' list-none'}>
                          <span className="transition group-open/ctx:rotate-90">▸</span>
                          <span className="group-open/ctx:hidden">Show in context</span>
                          <span className="hidden group-open/ctx:inline">Hide context</span>
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
        </div>
      </details>
    );
  }

  const gf = getClause(clause.id);
  if (!gf || gf.source !== 'hand-authored') {
    return (
      <article className="rounded-md bg-amber-50 p-3 text-sm ring-1 ring-amber-300">
        Missing gap-fill: <code>{clause.id}</code>
      </article>
    );
  }
  return (
    <details className={CARD}>
      <summary className={SUMMARY}>
        <span className={CHEVRON}>▸</span>
        <span className={TITLE}>{gf.category}</span>
        <ProvenancePill provenance="hand-authored" />
      </summary>
      <div className={BODY}>
        <p className="text-sm leading-relaxed text-muted">{gf.description}</p>
        <details className="group/sd">
          <summary className={INNER_DISCLOSURE + ' list-none'}>
            <span className="transition group-open/sd:rotate-90">▸</span>
            <span className="group-open/sd:hidden">Sample drafting</span>
            <span className="hidden group-open/sd:inline">Hide sample</span>
          </summary>
          <blockquote className="mt-2 border-l-2 border-amber-200 pl-3 text-sm text-ink/90">
            {gf.example_text}
          </blockquote>
        </details>
      </div>
    </details>
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
