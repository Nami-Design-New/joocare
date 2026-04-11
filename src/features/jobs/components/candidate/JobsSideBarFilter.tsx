"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useState } from "react";
import { AccordionSection, FilterState } from "../../types/index.types";
import FilterAccordion from "./FilterAccordion";

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_OPEN = new Set(["professionalLicense", "roleCategories", "domains"]);

type JobsSidebarFilterProps = {
  actionPath: string;
  search: string;
  country: string;
  filters: FilterState;
  sections: AccordionSection[];
  salaryTypeOptions: AccordionSection["options"];
};

export default function JobFilterSidebar({
  actionPath,
  search,
  country,
  filters: initialFilters,
  sections,
  salaryTypeOptions,
}: JobsSidebarFilterProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [openSections, setOpenSections] = useState<Set<string>>(DEFAULT_OPEN);

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
    key: keyof Omit<FilterState, "salaryMin" | "salaryMax">,
    value: string,
    checked: boolean,
  ) {
    setFilters((prev) => {
      if (key === "professionalLicense") {
        return {
          ...prev,
          professionalLicense: checked ? value : "",
        };
      }

      if (key === "domains") {
        return {
          ...prev,
          domains: checked ? [value] : [],
        };
      }

      const current = prev[key] as string[];
      return {
        ...prev,
        [key]: checked
          ? [...current, value]
          : current.filter((currentValue) => currentValue !== value),
      };
    });
  }

  return (
    <aside className="bg-card shadow-card hidden h-fit w-full flex-col rounded-2xl px-4 py-2 lg:flex">
      <form action={actionPath} method="get" className="flex flex-col">
        <input type="hidden" name="search" value={search} />
        <input type="hidden" name="country" value={country} />
        {filters.salaryTypes.map((salaryType) => (
          <input key={salaryType} type="hidden" name="salary_types[]" value={salaryType} />
        ))}
        {/* Accordion sections */}
        {sections.map((section) => (
          <FilterAccordion
            key={section.key}
            section={section}
            isOpen={openSections.has(section.key)}
            selected={
              section.key === "professionalLicense"
                ? (filters.professionalLicense ? [filters.professionalLicense] : [])
                : ((filters[section.key] as string[]) ?? [])
            }
            onToggle={() => toggleSection(section.key)}
            onCheck={(value, checked) => handleCheck(section.key, value, checked)}
          />
        ))}

        {/* ── Salary Range ───────────────────────────────────────────────────── */}
        <div className="border-border border-b py-3.5">
          {/* Row: label + salary type */}
          <div className="mb-3 flex items-center justify-between">
            <span className="text-foreground/80 text-sm font-semibold">
              Salary range
            </span>
            <Select
              value={filters.salaryTypes[0] ?? "__all__"}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  salaryTypes: value === "__all__" ? [] : [value],
                }))
              }
            >
              <SelectTrigger className="border-border bg-muted h-9 rounded-lg text-sm">
                <SelectValue placeholder="Any salary type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Any salary type</SelectItem>
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
              <Label className="text-muted-foreground text-xs" htmlFor="min-salary">
                Min
              </Label>
              <Input
                id="min-salary"
                type="number"
                name="min_salary"
                value={filters.salaryMin}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, salaryMin: event.target.value }))
                }
                className="border-border bg-muted focus-visible:ring-primary h-9 rounded-lg text-sm"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <Label className="text-muted-foreground text-xs" htmlFor="max-salary">
                Max
              </Label>
              <Input
                id="max-salary"
                type="number"
                name="max_salary"
                value={filters.salaryMax}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, salaryMax: event.target.value }))
                }
                className="border-border bg-muted focus-visible:ring-primary h-9 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* ── Reset Button ───────────────────────────────────────────────────── */}
        <div className="flex gap-3 pt-4 pb-2">
          <Button type="submit" variant="default" size="pill" className="bg-success flex-1">
            Apply Filters
          </Button>
          <Link
            href={actionPath}
            className="border-border text-foreground flex h-11 items-center justify-center rounded-full border px-4 text-sm font-medium"
          >
            Reset
          </Link>
        </div>
      </form>
    </aside>
  );
}
