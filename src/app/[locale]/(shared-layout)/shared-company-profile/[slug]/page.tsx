import AboutSection from '@/features/shared-company-profile/components/AboutSection';
import HeaderSection from '@/features/shared-company-profile/components/HeaderSection';
import JobsSections from '@/features/shared-company-profile/components/JobsSections';
import Breadcrumb from '@/shared/components/Breadcrumb';

export default function SharedCompanyProfileDetails() {
    return (

        <div className="bg-background min-h-screen pb-12">
            {/* Breadcrumb */}
            <Breadcrumb
                title="About Saudi German Hospital"
                items={[{ label: "Home", href: "/" }, { label: "About Saudi German Hospital" }]}
            />

            {/* Content */}
            <div className="bg-card shadow-soft mx-auto -mt-31  max-w-6xl gap-8 rounded-3xl border p-6 md:p-7">
                <HeaderSection />
                <AboutSection />
                <JobsSections />
            </div>

        </div>
    );
}
