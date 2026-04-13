import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  title: string;
  items: BreadcrumbItem[];
};

export default function Breadcrumb({ title, items }: BreadcrumbProps) {
  return (
    <div className="bg-primary-gradient px-3 py-4 text-white lg:px-25 lg:pt-12 lg:pb-38">
      <div className="container mx-auto flex items-center justify-between">
        <h6 className="text-lg font-semibold">{title}</h6>

        <nav aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-white/90">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;

              return (
                <li key={index} className="flex items-center space-x-2">
                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className="text-white/90 hover:underline"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      className={`${isLast ? "font-semibold text-white" : "text-white/70"
                        }`}
                      aria-current={isLast ? "page" : undefined}
                    >
                      {item.label}
                    </span>
                  )}

                  {!isLast && (
                    <ChevronRight className="text-white/70" size={20} />
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
