import CompanySidebar from "@/features/company/components/company-sidebar/CompanySidebar";
import Header from "@/shared/components/header/Header";
import React from "react";

const CompanyLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />

      <main className="grid grid-cols-12 min-h-dvh">

        {/* Sidebar */}
        <aside
          className="
            col-span-12 
            lg:col-span-3 
            xl:col-span-2
            lg:block
          "
        >
          <CompanySidebar />
        </aside>

        {/* Content */}
        <section
          className="
            col-span-12 
            lg:col-span-9 
            xl:col-span-10
            px-4 pt-6 pb-8 
            md:px-7 md:pt-12
             bg-body-bg
          "
        >
          {children}
        </section>

      </main>
    </>
  );
};

export default CompanyLayout;
