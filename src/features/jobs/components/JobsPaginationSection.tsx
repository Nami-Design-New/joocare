"use client";

import { useState } from "react";
import { CustomPagination } from "@/shared/components/CustomPagination";

export default function JobsPaginationSection() {
  const [page, setPage] = useState(1);

  return (
    <CustomPagination
      currentPage={page}
      totalItems={57}
      pageSize={10}
      onPageChange={setPage}
    />
  );
}
