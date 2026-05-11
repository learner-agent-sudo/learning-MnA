import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Learning M&A — APA Workflow',
  description:
    'Interactive walkthrough of a U.S. private-company Asset Purchase Agreement.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
