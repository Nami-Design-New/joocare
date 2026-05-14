import { Link } from "@/i18n/navigation";
import { Locale } from "ckeditor5";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getLocale } from "next-intl/server";

type Crumb = {
  label: string;
  href?: string;
};

export default async function PlainBreadcrumb({ items }: { items: Crumb[] }) {
  const locale = await getLocale()
  const last = items.length - 1;
  const title = items[last]?.label || "";
  console.log(locale);

  return (
    <div className="layout-shell border-b border-[#e6e6e6] bg-[#0D0D0D0D] py-2">
      <div className="layout-content flex items-center justify-between py-3">
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
                      className="hover:text-gray-600 text-secondary text-sm font-semibold"
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

                  {idx < last && (
                    <span className="mx-2 text-[#0D0D0DA6]">
                      {locale === 'ar' ? (
                        <ChevronLeft width={20} hanging={20} />
                      ) : (
                        <ChevronRight width={20} hanging={20} />
                      )}
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
