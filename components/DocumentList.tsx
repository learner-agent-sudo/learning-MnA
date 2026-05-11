import { DocumentItem } from '@/lib/workflow';

interface Props {
  documents: DocumentItem[];
}

export function DocumentList({ documents }: Props) {
  if (documents.length === 0) return null;
  return (
    <section className="mt-6">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
        Documents produced
      </h3>
      <ul className="mt-2 space-y-1.5">
        {documents.map((d) => (
          <li key={d.name} className="text-sm">
            <span className="font-medium">{d.name}</span>
            {d.description && (
              <span className="text-muted"> — {d.description}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
