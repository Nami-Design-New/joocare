"use client";

import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { SidebarNavItem as SidebarNavItemType } from "./types";
import { isSidebarNavItemActive, isSidebarNavLinkActive } from "./utils";

type SidebarNavItemProps = {
  item: SidebarNavItemType;
  pathname: string;
  label: string;
  childLabels: readonly string[];
};

export default function SidebarNavItem({
  item,
  pathname,
  label,
  childLabels,
}: SidebarNavItemProps) {
  const Icon = item.icon;
  const hasChildren = Boolean(item.children?.length);
  const isActive = isSidebarNavItemActive(item, pathname);
  const [isOpen, setIsOpen] = useState(isActive);
  const submenuId = `sidebar-submenu-${item.label.replace(/[^a-z0-9]+/gi, "-")}`;

  const itemClassName = cn(
    "group flex min-h-10 w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm transition-colors",
    isActive
      ? "bg-primary-bg font-semibold text-primary"
      : "text-muted-foreground hover:bg-primary-bg hover:text-primary",
  );
  const iconClassName = cn(
    "flex size-6 shrink-0 items-center justify-center rounded-md transition-colors",
    isActive
      ? "bg-primary text-primary-foreground"
      : "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground",
  );

  const content = (
    <>
      <span className={iconClassName} aria-hidden="true">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">{label}</span>
      {hasChildren ? (
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-4 shrink-0 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      ) : null}
    </>
  );

  return (
    <li>
      {hasChildren ? (
        <button
          type="button"
          className={itemClassName}
          aria-expanded={isOpen}
          aria-controls={submenuId}
          onClick={() => setIsOpen((open) => !open)}
        >
          {content}
        </button>
      ) : item.href ? (
        <Link
          href={item.href}
          className={itemClassName}
          aria-current={isActive ? "page" : undefined}
        >
          {content}
        </Link>
      ) : null}

      {hasChildren ? (
        <ul
          id={submenuId}
          hidden={!isOpen}
          className="ms-5 mt-1 flex flex-col gap-1 border-s border-border ps-2"
        >
          {item.children?.map((child, index) => {
            const isChildActive = isSidebarNavLinkActive(child, pathname);

            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  className={cn(
                    "block rounded-md px-2 py-1.5 text-xs transition-colors hover:text-primary",
                    isChildActive
                      ? "font-semibold text-primary"
                      : "text-muted-foreground",
                  )}
                  aria-current={isChildActive ? "page" : undefined}
                >
                  {childLabels[index]}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </li>
  );
}
