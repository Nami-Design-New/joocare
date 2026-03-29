import CandidateSideContentLinks from "@/features/candidate-profile/components/SideContentLinks";
import PlainBreadcrumb from "@/shared/components/PlainBreadcramb";

export default function CandidateProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (<main className=" bg-body-bg min-h-dvh">
        <PlainBreadcrumb
            items={[{ label: "Home", href: "/" }, { label: "Overview" }]}
        />
        <main className="container mx-auto px-3 lg:px-2 grid grid-cols-12 py-12 gap-8 items-start ">

            <section className="col-span-3">
                <CandidateSideContentLinks />
            </section>

            <section className="col-span-9">
                {children}
            </section>

        </main>
    </main>
    );
}
