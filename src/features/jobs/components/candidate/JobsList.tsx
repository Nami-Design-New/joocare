"use client";

import { CustomPagination } from "@/shared/components/CustomPagination";
import CandidateJobCard from "./CandidateJobCard";
import { useState } from "react";

export default function JobsList() {
  const [page, setPage] = useState(1);
  return (
    <>
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 6 }, (_, i) => (
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
    </>
  );
}
