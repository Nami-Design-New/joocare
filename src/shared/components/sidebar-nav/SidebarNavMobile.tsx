'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import { Link } from '@/i18n/navigation';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { cn } from '@/shared/lib/utils';
import { sidebarLinkVariants } from '../SidebarLinks';
import type { SidebarNavGroup, SidebarNavItem } from './types';
import { isSidebarNavItemActive, isSidebarNavLinkActive } from './utils';

type SidebarNavMobileProps = {
  groups: readonly SidebarNavGroup[];
  pathname: string;
};

type MobileItemProps = {
  item: SidebarNavItem;
  pathname: string;
};

// Pill with a dropdown of the item's sub-pages (e.g. Hiring Management → Jobs, Projects…).
function MobileMenuPill({ item, pathname }: MobileItemProps) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const Icon = item.icon;
  const isActive = isSidebarNavItemActive(item, pathname);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={sidebarLinkVariants({ variant: 'pill', active: isActive })}
      >
        <Icon aria-hidden="true" className="size-4 shrink-0" />
        <span>{t(item.label)}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            'size-4 shrink-0 transition-transform',
            open && 'rotate-180',
          )}
        />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 rounded-2xl p-2">
        <ul className="flex flex-col gap-1">
          {item.children?.map((child) => {
            const isChildActive = isSidebarNavLinkActive(child, pathname);

            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  onClick={() => setOpen(false)}
                  aria-current={isChildActive ? 'page' : undefined}
                  className={cn(
                    'block rounded-xl px-3 py-2 text-sm transition-colors',
                    isChildActive
                      ? 'bg-primary-bg font-semibold text-primary'
                      : 'text-muted-foreground hover:bg-primary-bg hover:text-primary',
                  )}
                >
                  {t(child.label)}
                </Link>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

function MobileLinkPill({ item, pathname }: MobileItemProps) {
  const t = useTranslations();
  const Icon = item.icon;
  const isActive = isSidebarNavItemActive(item, pathname);

  if (!item.href) return null;

  return (
    <Link
      href={item.href}
      aria-current={isActive ? 'page' : undefined}
      className={sidebarLinkVariants({ variant: 'pill', active: isActive })}
    >
      <Icon aria-hidden="true" className="size-4 shrink-0" />
      <span>{t(item.label)}</span>
    </Link>
  );
}

// Mobile sidebar: one swipeable row of pills (same look as the candidate sidebar);
// items with sub-pages open a dropdown.
export default function SidebarNavMobile({
  groups,
  pathname,
}: SidebarNavMobileProps) {
  const t = useTranslations();
  const items = groups.flatMap((group) => group.items);

  return (
    <nav aria-label={t('common.sidebar-navigation')} className="lg:hidden">
      <Swiper
        modules={[FreeMode]}
        spaceBetween={8}
        slidesPerView="auto"
        freeMode
        className="pb-1"
      >
        {items.map((item) => (
          <SwiperSlide key={item.label} className="w-auto!">
            {item.children?.length ? (
              <MobileMenuPill item={item} pathname={pathname} />
            ) : (
              <MobileLinkPill item={item} pathname={pathname} />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </nav>
  );
}
