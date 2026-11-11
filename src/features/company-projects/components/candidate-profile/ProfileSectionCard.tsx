import type { ReactNode } from 'react';

type ProfileSectionCardProps = {
  title: ReactNode;
  children: ReactNode;
};

export default function ProfileSectionCard({
  title,
  children,
}: ProfileSectionCardProps) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border bg-card p-4">
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      {children}
    </section>
  );
}
