import type { ReactNode } from 'react';

// A titled group of fields inside a section (e.g. "Experience & Seniority").
export default function InfoSubsection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5">
      <h3 className="font-semibold">{title}</h3>
      {children}
    </div>
  );
}
