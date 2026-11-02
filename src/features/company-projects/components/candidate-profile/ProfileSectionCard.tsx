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
    <section className="bg-card flex flex-col gap-3 rounded-2xl border p-4">
      <h3 className="text-foreground text-xl font-semibold">{title}</h3>
      {children}
    </section>
  );
}
