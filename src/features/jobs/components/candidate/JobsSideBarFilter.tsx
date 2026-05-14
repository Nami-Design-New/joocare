'use client';

import { Link } from '@/i18n/navigation';
import useGetSeniorityLevels from '@/shared/hooks/useGetSeniorityLevels';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useEffect, useMemo, useState } from 'react';
import { AccordionSection, FilterState } from '../../types/index.types';
import FilterAccordion from './FilterAccordion';
import { useTranslations } from 'next-intl';

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_OPEN = new Set([]);

type JobsSidebarFilterProps = {
  actionPath: string;
  search: string;
  country: string;
  filters: FilterState;
  sections: AccordionSection[];
  salaryTypeOptions: AccordionSection['options'];
};

type LookupOptionItem = {
  id?: number | string | null;
  title?: string | null;
  name?: string | null;
};

export default function JobFilterSidebar({
  actionPath,
  search,
  country,
  filters: initialFilters,
  sections,
  salaryTypeOptions,
}: JobsSidebarFilterProps) {
  const t = useTranslations();
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [openSections, setOpenSections] = useState<Set<string>>(DEFAULT_OPEN);
  const selectedRoleCategoryIds = useMemo(
    () =>
      filters.roleCategories
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value) && value > 0),
    [filters.roleCategories],
  );
  const hasSelectedRoleCategory = selectedRoleCategoryIds.length > 0;
  const { seniorityLevels, isLoading: seniorityLevelsLoading } =
    useGetSeniorityLevels('', selectedRoleCategoryIds);
  const normalizedSeniorityOptions = useMemo(
    () =>
      (seniorityLevels as LookupOptionItem[])
        .map((item) => ({
          value: item.id != null ? String(item.id) : '',
          label: item.title ?? item.name ?? '',
        }))
        .filter((item) => item.value && item.label),
    [seniorityLevels],
  );

  // ── Handlers ────────────────────────────────────────────────────────────────

  function toggleSection(key: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  function handleCheck(
    key: keyof Omit<FilterState, 'salaryMin' | 'salaryMax'>,
    value: string,
    checked: boolean,
  ) {
    setFilters((prev) => {
      if (key === 'roleCategories') {
        const nextRoleCategories = checked
          ? prev.roleCategories.includes(value)
            ? prev.roleCategories
            : [...prev.roleCategories, value]
          : prev.roleCategories.filter(
              (currentValue) => currentValue !== value,
            );

        return {
          ...prev,
          roleCategories: nextRoleCategories,
          seniorityLevels: [],
        };
      }

      const current = prev[key] as string[];
      return {
        ...prev,
        [key]: checked
          ? current.includes(value)
            ? current
            : [...current, value]
          : current.filter((currentValue) => currentValue !== value),
      };
    });
  }

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const sectionsWithDependencies = useMemo(
    () =>
      sections.map((section) => {
        if (section.key !== 'seniorityLevels') {
          return section;
        }

        return {
          ...section,
          options: hasSelectedRoleCategory ? normalizedSeniorityOptions : [],
          disabled: !hasSelectedRoleCategory || seniorityLevelsLoading,
          helperText: !hasSelectedRoleCategory
            ? t('jobsPage.filters.choose-role-category-first')
            : seniorityLevelsLoading
              ? t('jobsPage.filters.loading-seniority-levels')
              : undefined,
        };
      }),
    [
      sections,
      hasSelectedRoleCategory,
      normalizedSeniorityOptions,
      seniorityLevelsLoading,
      t,
    ],
  );

  return (
    <aside className="bg-card shadow-card hidden h-fit w-full flex-col rounded-2xl px-4 py-2 lg:flex">
      <form action={actionPath} method="get" className="flex flex-col">
        <input type="hidden" name="search" value={search} />
        <input type="hidden" name="country" value={country} />
        {filters.salaryTypes.map((salaryType) => (
          <input
            key={salaryType}
            type="hidden"
            name="salary_types[]"
            value={salaryType}
          />
        ))}
        {/* Accordion sections */}
        {sectionsWithDependencies.map((section) => (
          <FilterAccordion
            key={section.key}
            section={section}
            isOpen={openSections.has(section.key)}
            selected={(filters[section.key] as string[]) ?? []}
            onToggle={() => toggleSection(section.key)}
            onCheck={(value, checked) =>
              handleCheck(section.key, value, checked)
            }
          />
        ))}

        {/* ── Salary Range ───────────────────────────────────────────────────── */}
        <div className="border-border border-b py-3.5">
          {/* Row: label + salary type */}
          <div className="mb-3 flex items-center justify-between">
            <span className="text-foreground/80 text-sm font-semibold">
              {t('jobsPage.filters.salary-range')}
            </span>
            <Select
              value={filters.salaryTypes[0] ?? '__all__'}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  salaryTypes: value === '__all__' ? [] : [value],
                }))
              }
            >
              <SelectTrigger className="border-border bg-muted h-9 rounded-lg text-sm">
                <SelectValue placeholder={t('jobsPage.filters.any-salary-type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">{t('jobsPage.filters.any-salary-type')}</SelectItem>
                {salaryTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Min / Max inputs */}
          <div className="flex gap-3">
            <div className="flex flex-1 flex-col gap-1">
              <Label
                className="text-muted-foreground text-xs"
                htmlFor="min-salary"
              >
                {t('jobsPage.filters.min')}
              </Label>
              <Input
                id="min-salary"
                type="number"
                name="min_salary"
                value={filters.salaryMin}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    salaryMin: event.target.value,
                  }))
                }
                className="border-border bg-muted focus-visible:ring-primary h-9 rounded-lg text-sm"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <Label
                className="text-muted-foreground text-xs"
                htmlFor="max-salary"
              >
                {t('jobsPage.filters.max')}
              </Label>
              <Input
                id="max-salary"
                type="number"
                name="max_salary"
                value={filters.salaryMax}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    salaryMax: event.target.value,
                  }))
                }
                className="border-border bg-muted focus-visible:ring-primary h-9 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* ── Reset Button ───────────────────────────────────────────────────── */}
        <div className="flex gap-3 pt-4 pb-2">
          <Button
            type="submit"
            variant="default"
            size="pill"
            className="bg-success flex-1"
          >
            {t('jobsPage.filters.apply-filters')}
          </Button>
          <Link
            href={actionPath}
            className="border-border text-foreground flex h-11 items-center justify-center rounded-full border px-4 text-sm font-medium"
          >
            {t('jobsPage.filters.reset')}
          </Link>
        </div>
      </form>
    </aside>
  );
}
