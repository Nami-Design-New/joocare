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
      <legend className="text-secondary mb-3 font-semibold">{legend}</legend>
      {children}
    </fieldset>
  );
}
