import { Fragment } from 'react';
import { GlossaryTooltip } from './GlossaryTooltip';

interface Props {
  text: string;
}

const MARKER = /\[\[([^\]]+)\]\]/g;

/**
 * Renders text with [[term]] or [[label|glossary-key]] markers wrapped in
 * GlossaryTooltip. Plain text segments are passed through unchanged.
 */
export function RichText({ text }: Props) {
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  MARKER.lastIndex = 0;
  while ((m = MARKER.exec(text)) !== null) {
    if (m.index > last) {
      out.push(<Fragment key={i++}>{text.slice(last, m.index)}</Fragment>);
    }
    const [label, key] = m[1].split('|');
    out.push(
      <GlossaryTooltip key={i++} term={key ?? label}>
        {label}
      </GlossaryTooltip>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    out.push(<Fragment key={i++}>{text.slice(last)}</Fragment>);
  }
  return <>{out}</>;
}
