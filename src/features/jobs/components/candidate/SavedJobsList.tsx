"use client";

import React, { useState } from "react";
import { JobListItem } from "@/features/jobs/types/jobs.types";
import CandidateJobCard from "./CandidateJobCard";
import { CustomPagination } from "@/shared/components/CustomPagination";

const mockJob: JobListItem = {
  id: 0,
  title: "Healthcare Opportunity",
  job_title_id: null,
  job_title: null,
  company: null,
  country: null,
  city: null,
  experience: null,
  employment_type: null,
  specialty: null,
  currency_id: null,
  currency: null,
  salary_type_id: null,
  salary_type: null,
  min_salary: null,
  max_salary: null,
  description: null,
  is_applied: false,
  is_saved: false,
  created_at: new Date(0).toISOString(),
  updated_at: new Date(0).toISOString(),
};

export default function SavedJobsList() {
  const [page, setPage] = useState(1);
  return (
    <section className="my-11">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
        {Array.from({ length: 9 }, (_, i) => (
          <CandidateJobCard key={i} job={{ ...mockJob, id: i + 1 }} />
        ))}
      </section>
      <section className="mt-4 w-full">
        <CustomPagination
          currentPage={page}
          totalItems={57}
          pageSize={10}
          onPageChange={setPage}
        />
      </section>
    </section>
  );
}
