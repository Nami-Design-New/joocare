import LicenseCard from "@/features/candidate-credentials/components/licenses/LicenseCard";

export default function LicensesPage() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <LicenseCard imgSrc={"/assets/cover.svg"} />
            <LicenseCard imgSrc={"/assets/credentials.svg"} />
            <LicenseCard imgSrc={"/assets/profile_image.svg"} />
        </div>
    )
}
