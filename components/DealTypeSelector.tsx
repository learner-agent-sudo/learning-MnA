'use client';

import { DealType } from '@/lib/workflow';

interface Props {
  dealType: DealType;
  onChange: (d: DealType) => void;
}

const OPTIONS: { value: DealType; label: string; disabled: boolean; tooltip: string }[] = [
  { value: 'apa', label: 'APA (Asset)', disabled: false, tooltip: 'Asset Purchase Agreement' },
  { value: 'spa', label: 'SPA (Stock)', disabled: true, tooltip: 'Stock Purchase Agreement — coming soon' },
  { value: 'merger', label: 'Merger', disabled: true, tooltip: 'Statutory merger — coming soon' },
];

export function DealTypeSelector({ dealType, onChange }: Props) {
  return (
    <div role="radiogroup" aria-label="Deal type" className="inline-flex gap-1">
      {OPTIONS.map((opt) => {
        const active = opt.value === dealType;
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={active}
            aria-disabled={opt.disabled}
            disabled={opt.disabled}
            title={opt.tooltip}
            onClick={() => !opt.disabled && onChange(opt.value)}
            className={
              'px-3 py-1 rounded border text-sm transition ' +
              (active
                ? 'border-accent bg-accent text-white'
                : opt.disabled
                ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                : 'border-slate-200 bg-white text-ink hover:border-accent')
            }
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
