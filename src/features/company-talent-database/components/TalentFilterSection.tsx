import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

type TalentFilterSectionProps = { title: string; children: ReactNode };

export default function TalentFilterSection({
  title,
  children,
}: TalentFilterSectionProps) {
  return (
    <details open className="group bg-muted rounded-2xl p-3">
      <summary className="text-muted-foreground focus-visible:outline-ring flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg p-2 text-[21px] font-semibold focus-visible:outline-2 [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown
          aria-hidden
          className="size-5 shrink-0 transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="pt-5">{children}</div>
    </details>
  );
}
