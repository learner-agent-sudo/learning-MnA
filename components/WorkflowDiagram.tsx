'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Stage } from '@/lib/workflow';

interface Props {
  stages: Stage[];
  selectedStageId: string | null;
  enabledStageIds: Set<string>;
  onSelectStage: (stageId: string) => void;
}

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  flowchart: { htmlLabels: true, curve: 'basis' },
  themeVariables: {
    primaryColor: '#ffffff',
    primaryTextColor: '#0f172a',
    primaryBorderColor: '#cbd5e1',
    lineColor: '#94a3b8',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
  },
});

function phaseFor(index: number): 'pre' | 'active' | 'post' {
  if (index <= 3) return 'pre';
  if (index <= 6) return 'active';
  return 'post';
}

function buildSpec(stages: Stage[]): string {
  const lines: string[] = ['flowchart TD'];
  for (const s of stages) {
    lines.push(`  ${s.id}["${s.title}"]`);
  }
  for (let i = 0; i < stages.length - 1; i++) {
    lines.push(`  ${stages[i].id} --> ${stages[i + 1].id}`);
  }
  lines.push('  classDef phasePre fill:#eff6ff,stroke:#93c5fd,color:#0f172a');
  lines.push('  classDef phaseActive fill:#fffbeb,stroke:#fcd34d,color:#0f172a');
  lines.push('  classDef phasePost fill:#ecfdf5,stroke:#6ee7b7,color:#0f172a');
  lines.push('  classDef preProcess stroke-dasharray: 5 5');
  const groups: Record<string, string[]> = { pre: [], active: [], post: [] };
  for (const s of stages) groups[phaseFor(s.index)].push(s.id);
  if (groups.pre.length) lines.push(`  class ${groups.pre.join(',')} phasePre`);
  if (groups.active.length) lines.push(`  class ${groups.active.join(',')} phaseActive`);
  if (groups.post.length) lines.push(`  class ${groups.post.join(',')} phasePost`);
  const dashed = stages.filter((s) => s.kind === 'pre-process').map((s) => s.id);
  if (dashed.length) lines.push(`  class ${dashed.join(',')} preProcess`);
  return lines.join('\n');
}

export function WorkflowDiagram({
  stages,
  selectedStageId,
  enabledStageIds,
  onSelectStage,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef('mermaid-' + Math.random().toString(36).slice(2, 9));

  useEffect(() => {
    let cancelled = false;
    const spec = buildSpec(stages);
    mermaid
      .render(idRef.current, spec)
      .then(({ svg }) => {
        if (cancelled || !containerRef.current) return;
        containerRef.current.innerHTML = svg;
        wireUp(containerRef.current, stages, enabledStageIds, onSelectStage, selectedStageId);
      })
      .catch((err) => {
        console.error('Mermaid render error', err);
      });
    return () => {
      cancelled = true;
    };
  }, [stages, selectedStageId, enabledStageIds, onSelectStage]);

  return (
    <div
      ref={containerRef}
      className="mermaid-host overflow-x-auto rounded-lg border border-slate-200 bg-white p-4"
      role="img"
      aria-label="M&A workflow diagram"
    >
      <div
        className="mx-auto flex w-40 animate-pulse flex-col items-center gap-3 py-2"
        aria-hidden
      >
        {Array.from({ length: stages.length }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="h-7 w-40 rounded bg-slate-100" />
            {i < stages.length - 1 && <div className="h-3 w-px bg-slate-200" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function wireUp(
  host: HTMLElement,
  stages: Stage[],
  enabledIds: Set<string>,
  onSelect: (id: string) => void,
  selectedId: string | null
) {
  const svg = host.querySelector('svg');
  if (!svg) return;
  svg.style.maxWidth = '100%';
  svg.style.height = 'auto';

  // Build a title -> stage map for matching nodes by their rendered text.
  const byTitle = new Map<string, Stage>();
  for (const s of stages) byTitle.set(s.title.trim().toLowerCase(), s);

  const nodes = svg.querySelectorAll<SVGGElement>('g.node');
  for (const node of Array.from(nodes)) {
    const text = (node.textContent || '').trim().toLowerCase();
    const stage = byTitle.get(text);
    if (!stage) continue;
    node.dataset.stageId = stage.id;

    const enabled = enabledIds.has(stage.id);
    const selected = selectedId === stage.id;
    node.style.cursor = enabled ? 'pointer' : 'not-allowed';
    node.style.opacity = enabled ? '1' : '0.4';
    node.setAttribute('tabindex', enabled ? '0' : '-1');
    node.setAttribute('role', 'button');
    node.setAttribute(
      'aria-label',
      `${stage.title}${enabled ? '' : ' (coming soon)'}`
    );
    if (selected) {
      const shape = node.querySelector<SVGElement>('rect, polygon, path');
      if (shape) {
        shape.setAttribute('stroke', '#2563eb');
        shape.setAttribute('stroke-width', '3');
      }
    }
  }

  // Single delegated click handler on the SVG root.
  const handleClick = (e: Event) => {
    const target = e.target as Element | null;
    const nodeEl = target?.closest('g.node') as SVGGElement | null;
    const id = nodeEl?.dataset.stageId;
    if (id && enabledIds.has(id)) onSelect(id);
  };
  const handleKey = (e: Event) => {
    const ke = e as KeyboardEvent;
    if (ke.key !== 'Enter' && ke.key !== ' ') return;
    const target = ke.target as Element | null;
    const nodeEl = target?.closest('g.node') as SVGGElement | null;
    const id = nodeEl?.dataset.stageId;
    if (id && enabledIds.has(id)) {
      ke.preventDefault();
      onSelect(id);
    }
  };
  svg.addEventListener('click', handleClick);
  svg.addEventListener('keydown', handleKey);
}
