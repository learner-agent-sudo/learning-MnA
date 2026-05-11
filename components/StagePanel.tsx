import { Depth, Stage } from '@/lib/workflow';
import { ClauseCard } from './ClauseCard';
import { DocumentList } from './DocumentList';
import { GlossaryTooltip } from './GlossaryTooltip';

interface Props {
  stage: Stage;
  depth: Depth;
}

export function StagePanel({ stage, depth }: Props) {
  const cuad = stage.clauses.filter((c) => c.provenance === 'cuad');
  const gapFills = stage.clauses.filter((c) => c.provenance === 'hand-authored');

  return (
    <aside className="rounded-lg border border-slate-200 bg-panel p-6">
      <header className="border-b border-slate-200 pb-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted">
          Stage {stage.index}
          {stage.kind === 'pre-process' && ' · pre-process'}
          {stage.kind === 'branch' && ' · branch'}
        </div>
        <h2 className="mt-1 text-xl font-semibold">{stage.title}</h2>
      </header>

      <section className="mt-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
          What happens
        </h3>
        <p className="mt-2 text-sm leading-relaxed">{stage.description[depth]}</p>
      </section>

      <DocumentList documents={stage.documents} />

      {stage.clauses.length > 0 && (
        <section className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Clauses
          </h3>
          <div className="mt-3 grid gap-3">
            {[...cuad, ...gapFills].map((c) => (
              <ClauseCard key={c.id} clause={c} />
            ))}
          </div>
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
