"use client";

import CompanySidebar from "@/features/company/components/company-sidebar/CompanySidebar";
import Header from "@/shared/components/header/Header";
import { Menu } from "lucide-react";
import React, { useState } from "react";

const CompanyLayout = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Header openSidebar={() => setOpen(true)} />

            <main className="flex min-h-dvh">

                <CompanySidebar
                    open={open}
                    closeSidebar={() => setOpen(false)}
                    setOpen={setOpen}

                />

                <section className="flex-1 bg-background">
                    <button
                        className="md:hidden p-4"
                        onClick={() => setOpen(!open)}
                    >
                        <Menu />
                    </button>
                    {children}
                </section>

            </main>
        </>
    );
};

export default CompanyLayout;