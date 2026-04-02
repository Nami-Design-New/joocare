"use client";

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
import { AccordionSection, FilterState } from "../../index.types";
import FilterAccordion from "./FilterAccordion";

// ─── Constants ───────────────────────────────────────────────────────────────

const ACCORDION_SECTIONS: AccordionSection[] = [
  {
    key: "professionalLicense",
    label: "Professional License",
    options: ["With Medical license", "Without Medical license"],
  },
  {
    key: "roleCategory",
    label: "Role category",
    options: [
      "Nurse",
      "Doctor",
      "Pharmacist",
      "Lab Technician",
      "Physiotherapist",
    ],
  },
  {
    key: "seniorityLevel",
    label: "Seniority Level",
    options: [
      "Hospital",
      "Medical Center",
      "Clinic / Mobile Clinic",
      "Telemedicine",
      "Pharmaceutical",
      "Supply Chain",
      "Insurance",
      "TPA",
      "Provider",
    ],
  },
  {
    key: "byDomain",
    label: "By Domain",
    options: ["Clinical", "Non-Clinical", "Administrative"],
  },
  {
    key: "speciality",
    label: "Speciality",
    options: ["Cardiology", "Oncology", "Pediatrics", "Orthopedics"],
  },
  {
    key: "experienceLevel",
    label: "Experience Level",
    options: ["Entry Level", "Mid Level", "Senior Level", "Executive"],
  },
  {
    key: "availability",
    label: "Availability",
    options: ["Full Time", "Part Time", "Contract", "Freelance"],
  },
  {
    key: "employerType",
    label: "Employer Type",
    options: ["Government", "Private", "NGO", "International"],
  },
];

const DEFAULT_OPEN = new Set(["professionalLicense", "seniorityLevel"]);

const INITIAL_STATE: FilterState = {
  professionalLicense: [],
  roleCategory: [],
  seniorityLevel: [],
  byDomain: [],
  speciality: [],
  experienceLevel: [],
  availability: [],
  employerType: [],
  salaryMin: "100",
  salaryMax: "500",
  salaryType: "monthly",
};

export default function JobFilterSidebar() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_STATE);
  const [openSections, setOpenSections] = useState<Set<string>>(DEFAULT_OPEN);
  const [filter, setIsOpen] = useState<Set<string>>(DEFAULT_OPEN);

  // ── Handlers ────────────────────────────────────────────────────────────────

  function toggleSection(key: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function handleCheck(
    key: keyof Omit<FilterState, "salaryMin" | "salaryMax" | "salaryType">,
    value: string,
    checked: boolean,
  ) {
    setFilters((prev) => {
      const current = prev[key] as string[];
      return {
        ...prev,
        [key]: checked
          ? [...current, value]
          : current.filter((v) => v !== value),
      };
    });
  }

  function handleReset() {
    setFilters(INITIAL_STATE);
    setOpenSections(DEFAULT_OPEN);
  }

  return (
    <aside className="bg-card shadow-card hidden h-fit w-full flex-col rounded-2xl px-4 py-2 lg:flex">
      {/* Accordion sections */}
      {ACCORDION_SECTIONS.map((section) => (
        <FilterAccordion
          key={section.key}
          section={section}
          isOpen={openSections.has(section.key)}
          selected={filters[section.key] as string[]}
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
            value={filters.salaryType}
            onValueChange={(v) =>
              setFilters((prev) => ({ ...prev, salaryType: v }))
            }
          >
            <SelectTrigger className="text-primary h-6 w-auto gap-1 border-none bg-transparent p-0 text-xs font-medium shadow-none focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="hourly">Hourly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Min / Max inputs */}
        <div className="flex gap-3">
          <div className="flex flex-1 flex-col gap-1">
            <Label className="text-muted-foreground text-xs">Min</Label>
            <Input
              type="number"
              value={filters.salaryMin}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, salaryMin: e.target.value }))
              }
              className="border-border bg-muted focus-visible:ring-primary h-9 rounded-lg text-sm"
            />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <Label className="text-muted-foreground text-xs">Max</Label>
            <Input
              type="number"
              value={filters.salaryMax}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, salaryMax: e.target.value }))
              }
              className="border-border bg-muted focus-visible:ring-primary h-9 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {/* ── Reset Button ───────────────────────────────────────────────────── */}
      <div className="pt-4 pb-2">
        <Button
          type="button"
          onClick={handleReset}
          variant="default"
          size="pill"
          className="bg-success w-full"
        >
          Reset
        </Button>
      </div>
    </aside>
  );
}
