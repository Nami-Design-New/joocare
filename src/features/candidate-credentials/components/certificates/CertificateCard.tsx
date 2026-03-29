"use client";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import DeleteModal from "@/shared/components/modals/DeleteModal";
import { CertificateModal } from "./CertificateModal";

export default function CertificateCard() {
  const [open, setOpen] = useState(false);
  const [deleteCertificate, setDeleteCertificate] = useState(false);
  const handleDeleteCertificate = () => {
    setDeleteCertificate(false);
  };

  return (
    <>
      <section className="flex items-center justify-start gap-2 rounded-2xl border bg-white p-2 shadow">
        <div className="h-38 w-40">
          <Image
            className="h-full w-full rounded-lg"
            width={100}
            height={100}
            src={"/assets/credentials.svg"}
            alt="credentials"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-black">
              Infection Control Diploma
            </h2>
            <div className="flex items-center gap-3">
              <Edit
                onClick={() => setOpen(true)}
                width={22}
                height={22}
                className="text-muted-foreground cursor-pointer"
              />
              <Trash2
                onClick={() => setDeleteCertificate(true)}
                width={22}
                height={22}
                className="cursor-pointer text-red-400"
              />
            </div>
          </div>
          <p className="text-base">Egypt</p>
          <p className="text-base">American Heart Association</p>
          <p className="text-base">21 December 2023 - 21 December 2026</p>
        </div>
      </section>

      {open && (
        <CertificateModal
          label="Edit Certificate"
          open={open}
          onOpenChange={setOpen}
        />
      )}

      <DeleteModal
        open={deleteCertificate}
        onOpenChange={setDeleteCertificate}
        title="Do you want to delete this Certificate?"
        description="The Certificate will be permanently deleted from your account and you will not be able to recover it later. Please ensure before proceeding, as this action cannot be undone."
        cancelLabel="Back"
        onConfirm={handleDeleteCertificate}
      />
    </>
  );
}
