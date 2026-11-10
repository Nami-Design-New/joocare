import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

type TalentFilterSectionProps = { title: string; children: ReactNode };

export default function TalentFilterSection({
  title,
  children,
}: TalentFilterSectionProps) {
  return (
    <details open className="group bg-muted rounded-2xl p-2 sm:p-3">
      <summary className="text-muted-foreground focus-visible:outline-ring flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg p-2 text-lg font-semibold sm:text-[21px] focus-visible:outline-2 [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown
          aria-hidden
          className="size-5 shrink-0 transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="px-1 pt-3 sm:px-0 sm:pt-5">{children}</div>
    </details>
  );
}
