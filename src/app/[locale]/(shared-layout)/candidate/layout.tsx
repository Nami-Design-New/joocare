import CandidateSideContentLinks from "@/features/candidate-profile/components/SideContentLinks";
import PlainBreadcrumb from "@/shared/components/PlainBreadcramb";

export default function CandidateProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (<>
        <PlainBreadcrumb
            items={[{ label: "Home", href: "/" }, { label: "Overview" }]}
        />
        <main className="container mx-auto px-3 lg:px-2 grid grid-cols-4 py-12 gap-8 items-start">
            <section className="col-span-1">
                < CandidateSideContentLinks />
            </section >
            <section className="col-span-3"> {children} </section>

        </main >
    </>
    );
}
