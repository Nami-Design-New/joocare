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

                <section className="flex-1 bg-background">

                    {children}
                </section>

            </main>
        </>
    );
};

export default CompanyLayout;