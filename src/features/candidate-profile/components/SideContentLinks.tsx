"use client"

import SidebarLinks from "@/shared/components/SidebarLinks";
import { links } from "../constants";

const CandidateSideContentLinks = () => {
    return (
        <aside className="no-scrollbar flex flex-col gap-5 overflow-y-auto bg-white px-3 py-6 rounded-2xl shadow min-h-[calc(100vh-250px)]">
            <SidebarLinks links={links} />

            <section className="bg-[#DC26260D]  rounded-2xl flex flex-col gap-3 py-3 px-4 mt-auto">
                <h3 className="text-destructive text-xl font-semibold">Please complete your details.</h3>
                <p className="text-base text-muted-foreground">
                    Please complete your account details so you can use the platform normally and benefit from all its features.
                </p>
            </section>

        </aside>
    );
};

export default CandidateSideContentLinks;
