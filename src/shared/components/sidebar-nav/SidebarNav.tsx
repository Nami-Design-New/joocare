"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import SidebarNavItem from "./SidebarNavItem";
import type { SidebarNavGroup } from "./types";

type SidebarNavProps = {
  groups: readonly SidebarNavGroup[];
};

export default function SidebarNav({ groups }: SidebarNavProps) {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <nav aria-label={t("common.sidebar-navigation")}>
      <div className="flex flex-col gap-5">
        {groups.map((group) => (
          <section key={group.title} aria-labelledby={`sidebar-group-${group.title}`}>
            <h2
              id={`sidebar-group-${group.title}`}
              className="mb-2 px-3 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground"
            >
              {t(group.title)}
            </h2>
            <ul className="flex flex-col gap-1">
              {group.items.map((item) => (
                <SidebarNavItem
                  key={`${item.label}-${pathname}`}
                  item={item}
                  pathname={pathname}
                  label={t(item.label)}
                  childLabels={(item.children ?? []).map((child) =>
                    t(child.label),
                  )}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </nav>
  );
}
