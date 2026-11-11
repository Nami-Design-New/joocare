import type { ReactNode } from 'react';

type PreferenceFieldsetProps = {
  legend: string;
  children: ReactNode;
};

export default function PreferenceFieldset({
  legend,
  children,
}: PreferenceFieldsetProps) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 font-semibold text-secondary">{legend}</legend>
      {children}
    </fieldset>
  );
}
