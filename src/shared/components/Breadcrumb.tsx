import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  title: string;
  items: BreadcrumbItem[];
  gradient?: boolean;
};

export default function Breadcrumb({
  title,
  items,
  gradient = true,
}: BreadcrumbProps) {
  return (
    <div
      className={`layout-shell py-4 lg:pt-12 lg:pb-38 ${gradient ? "bg-primary-gradient text-white" : "bg-transparent text-secondary"
        }`}
    >
      <div className="layout-content flex items-center justify-between">
        <h6 className="text-lg font-semibold">{title}</h6>

        <nav aria-label="Breadcrumb">
          <ol
            className={`flex items-center space-x-2 text-sm ${gradient ? "text-white/90" : "text-muted-foreground"
              }`}
          >
            {items.map((item, index) => {
              const isLast = index === items.length - 1;

              return (
                <li key={index} className="flex items-center space-x-2">
                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className={gradient ? "text-white/90 hover:underline" : "hover:text-secondary hover:underline"}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      className={`${isLast
                          ? gradient
                            ? "font-semibold text-white"
                            : "font-semibold text-secondary"
                          : gradient
                            ? "text-white/70"
                            : "text-muted-foreground"
                        }`}
                      aria-current={isLast ? "page" : undefined}
                    >
                      {item.label}
                    </span>
                  )}

                  {!isLast && (
                    <ChevronRight
                      className={gradient ? "text-white/70" : "text-muted-foreground"}
                      size={20}
                    />
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
