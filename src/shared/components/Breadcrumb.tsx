import { Link } from "@/i18n/navigation";
import { ChevronRight } from 'lucide-react';

type Crumb = {
  label: string;
  href?: string;
};

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  const last = items.length - 1;
  const title = items[last]?.label || "";

  return (
    <div className="border-b border-[#e6e6e6] bg-[#0D0D0D0D]">
      <div className="container mx-auto max-w-7xl flex items-center justify-between px-4 py-3 sm:px-6">
        <h1 className="text-lg font-semibold text-black">{title}</h1>

        <nav aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            {items.map((it, idx) => {
              const isLast = idx === last;
              return (
                <li key={idx} className="flex items-center">
                  {!isLast && it.href ? (
                    <Link
                      href={it.href}
                      className="hover:text-secondary text-sm text-gray-600"
                    >
                      {it.label}
                    </Link>
                  ) : (
                    <span
                      className={`text-sm ${isLast ? "text-secondary font-semibold" : "text-gray-600"}`}
                    >
                      {it.label}
                    </span>
                  )}

                  {idx < last && <span className="mx-2 text-[#0D0D0DA6]"><ChevronRight width={20} hanging={20} /></span>}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
