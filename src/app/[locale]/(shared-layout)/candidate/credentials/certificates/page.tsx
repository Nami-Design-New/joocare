import CertificateCard from "@/features/candidate-credentials/components/certificates/CertificateCard";

export default function CertificatesPage() {
    return (
        <div className="flex flex-col gap-3">
            <CertificateCard />
            <CertificateCard />
            <CertificateCard />
        </div>

    )
}
