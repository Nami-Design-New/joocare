"use client";

import React, { useState } from "react";
import CandidateJobCard from "./CandidateJobCard";
import { CustomPagination } from "@/shared/components/CustomPagination";

export default function SavedJobsList() {
  const [page, setPage] = useState(1);
  return (
    <section className="my-11">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
        {Array.from({ length: 9 }, (_, i) => (
          <CandidateJobCard key={i} />
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
