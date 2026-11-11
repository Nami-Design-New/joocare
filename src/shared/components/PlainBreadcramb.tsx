import { Link } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';

type Crumb = {
  label: string;
  href?: string;
};

export default function PlainBreadcrumb({ items }: { items: Crumb[] }) {
  const last = items.length - 1;
  const title = items[last]?.label || '';

  return (
    <div className="layout-shell border-b border-[#e6e6e6] bg-[#0D0D0D0D] py-2">
      <div className="layout-content flex items-center justify-between gap-3 py-3">
        <h1 className="min-w-0 text-sm font-semibold text-black sm:text-base md:text-lg">
          {title}
        </h1>

        <nav aria-label="Breadcrumb" className="shrink-0">
          <ol className="flex items-center space-x-2 text-xs whitespace-nowrap text-gray-600 md:text-sm">
            {items.map((it, idx) => {
              const isLast = idx === last;
              return (
                <li key={idx} className="flex items-center">
                  {!isLast && it.href ? (
                    <Link
                      href={it.href}
                      className="text-xs font-semibold text-secondary hover:text-gray-600 md:text-sm"
                    >
                      {it.label}
                    </Link>
                  ) : (
                    <span
                      className={`text-xs md:text-sm ${isLast ? 'font-semibold text-secondary' : 'text-gray-600'}`}
                    >
                      {it.label}
                    </span>
                  )}

                  {idx < last && (
                    <span className="mx-2 text-[#0D0D0DA6]">
                      <ChevronRight
                        width={20}
                        height={20}
                        className="rtl:rotate-180"
                      />
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
