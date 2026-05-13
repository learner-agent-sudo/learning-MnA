import { Depth, Stage } from '@/lib/workflow';
import { ClauseCard } from './ClauseCard';
import { DocumentList } from './DocumentList';
import { GlossaryTooltip } from './GlossaryTooltip';
import { RichText } from './RichText';

interface Props {
  stage: Stage;
  depth: Depth;
  prev?: Stage | null;
  next?: Stage | null;
  onNavigate?: (id: string) => void;
}

export function StagePanel({ stage, depth, prev, next, onNavigate }: Props) {
  const cuad = stage.clauses.filter((c) => c.provenance === 'cuad');
  const gapFills = stage.clauses.filter((c) => c.provenance === 'hand-authored');

  return (
    <aside className="rounded-lg border border-slate-200 bg-panel p-6">
      <header className="border-b border-slate-200 pb-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted">
              Stage {stage.index}
              {stage.kind === 'pre-process' && ' · pre-process'}
              {stage.kind === 'branch' && ' · branch'}
            </div>
            <h2 className="mt-1 text-xl font-semibold">{stage.title}</h2>
          </div>
          {onNavigate && (
            <nav className="flex shrink-0 gap-1" aria-label="Stage navigation">
              <button
                type="button"
                onClick={() => prev && onNavigate(prev.id)}
                disabled={!prev}
                title={prev ? `Previous: ${prev.title}` : 'No previous stage'}
                className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-ink hover:border-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                ◀ Prev
              </button>
              <button
                type="button"
                onClick={() => next && onNavigate(next.id)}
                disabled={!next}
                title={next ? `Next: ${next.title}` : 'No next stage'}
                className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-ink hover:border-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next ▶
              </button>
            </nav>
          )}
        </div>
      </header>

      <section className="mt-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
          What happens
        </h3>
        <p className="mt-2 text-sm leading-relaxed">
          <RichText text={stage.description[depth]} />
        </p>
      </section>

      <DocumentList documents={stage.documents} />

      {stage.clauses.length > 0 && (
        <section className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Clauses
          </h3>
          {cuad.length > 0 && (
            <div className="mt-3">
              <div className="text-xs font-medium text-blue-700">
                From real contracts (CUAD) · {cuad.length}
              </div>
              <div className="mt-2 grid gap-3">
                {cuad.map((c) => (
                  <ClauseCard key={c.id} clause={c} />
                ))}
              </div>
            </div>
          )}
          {gapFills.length > 0 && (
            <div className="mt-4">
              <div className="text-xs font-medium text-amber-700">
                APA-specific drafting (hand-authored) · {gapFills.length}
              </div>
              <div className="mt-2 grid gap-3">
                {gapFills.map((c) => (
                  <ClauseCard key={c.id} clause={c} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {stage.glossary.length > 0 && (
        <section className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Glossary
          </h3>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
            {stage.glossary.map((g) => (
              <GlossaryTooltip key={g.term} term={g.term} />
            ))}
          </div>
        </section>
      )}
    </aside>
  );
}
