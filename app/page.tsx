'use client';

import { useMemo, useState } from 'react';
import { STAGES, STAGE_BY_ID, Depth, DealType } from '@/lib/workflow';
import { WorkflowDiagram } from '@/components/WorkflowDiagram';
import { StagePanel } from '@/components/StagePanel';
import { DepthToggle } from '@/components/DepthToggle';
import { DealTypeSelector } from '@/components/DealTypeSelector';

export default function Page() {
  const [depth, setDepth] = useState<Depth>('beginner');
  const [dealType, setDealType] = useState<DealType>('apa');
  const [selectedStageId, setSelectedStageId] = useState<string | null>('strategy');

  const enabledStageIds = useMemo(
    () => new Set(STAGES.filter((s) => s.dealTypes.includes(dealType)).map((s) => s.id)),
    [dealType]
  );

  const stages = useMemo(
    () => STAGES.filter((s) => s.dealTypes.includes(dealType)),
    [dealType]
  );

  const selected = selectedStageId ? STAGE_BY_ID[selectedStageId] : null;

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-semibold">Learning M&amp;A</h1>
          <p className="mt-1 text-sm text-muted">
            Interactive walkthrough of a U.S. private-company Asset Purchase Agreement.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <DealTypeSelector dealType={dealType} onChange={setDealType} />
          <DepthToggle depth={depth} onChange={setDepth} />
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <section>
          <WorkflowDiagram
            stages={stages}
            selectedStageId={selectedStageId}
            enabledStageIds={enabledStageIds}
            onSelectStage={setSelectedStageId}
          />
          <p className="mt-3 text-xs text-muted">
            Click any stage for documents, clauses, and glossary. SPA and
            Merger paths are coming soon — APA is the only complete deal
            type in v1.
          </p>
        </section>

        <section>
          {selected ? (
            <StagePanel stage={selected} depth={depth} />
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-muted">
              Click a stage in the diagram to open its details.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
