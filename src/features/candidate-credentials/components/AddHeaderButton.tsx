'use client';

import { useMemo, useState } from "react";
import { PlusCircle } from "lucide-react";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/components/ui/button";
import { QualificationModal } from "./qualifications/QualificationModal";
import { CertificateModal } from "./certificates/CertificateModal";
import { LicenseModal } from "./licenses/LicenseModal";

type ModalProps = {
    label: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

type ModalConfig = {
    key: string;
    label: string;
    Component: React.ComponentType<ModalProps>;
};

export default function AddHeaderButton() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const t = useTranslations("Candidate");

    const activeConfig = useMemo(() => {
        const modalConfigs: ModalConfig[] = [
            {
                key: "qualifications",
                label: t("addQualifications"),
                Component: QualificationModal,
            },
            {
                key: "certificates",
                label: t("addCertificates"),
                Component: CertificateModal,
            },
            {
                key: "licenses",
                label: t("addLicenses"),
                Component: LicenseModal,
            },
        ];
        return modalConfigs.find((item) =>
            pathname?.includes(item.key)
        );
    }, [pathname, t]);

    const ModalComponent = activeConfig?.Component;

    return (
        <>
            {open && ModalComponent && (
                <ModalComponent
                    label={activeConfig.label}
                    open={open}
                    onOpenChange={setOpen}
                />
            )}

            <Button
                variant="secondary"
                size="pill"
                className="flex gap-2 w-fit"
                onClick={() => setOpen(true)}
            >
                <PlusCircle size={32} />
                {activeConfig?.label ?? t("addItem")}
            </Button>
        </>
    );
}
