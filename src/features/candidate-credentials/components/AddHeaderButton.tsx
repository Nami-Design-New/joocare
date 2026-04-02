'use client';

import { useMemo, useState } from "react";
import { PlusCircle } from "lucide-react";
import { usePathname } from "@/i18n/navigation";

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

const MODAL_CONFIGS: ModalConfig[] = [
    {
        key: "qualifications",
        label: "Add Qualifications",
        Component: QualificationModal,
    },
    {
        key: "certificates",
        label: "Add Certificates",
        Component: CertificateModal,
    },
    {
        key: "licenses",
        label: "Add Licenses",
        Component: LicenseModal,
    },
];

export default function AddHeaderButton() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const activeConfig = useMemo(() => {
        return MODAL_CONFIGS.find((item) =>
            pathname?.includes(item.key)
        );
    }, [pathname]);

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
                {activeConfig?.label ?? "Add Item"}
            </Button>
        </>
    );
}