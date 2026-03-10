"use client";

import CompanySidebar from "@/features/company/components/company-sidebar/CompanySidebar";
import Header from "@/shared/components/header/Header";
import React from "react";

const CompanyLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />

      <main className="flex min-h-dvh">
        <CompanySidebar />

        <section className="bg-background flex-1 px-4 pt-6 pb-8 md:px-7 md:pt-12">
          {children}
        </section>
      </main>
    </>
  );
};

export default CompanyLayout;
