"use client";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import DeleteModal from "@/shared/components/modals/DeleteModal";
import { LicenseModal } from "./LicenseModal";

export default function LicenseCard({ imgSrc }: { imgSrc: string }) {
  const [open, setOpen] = useState(false);
  const [deleteLicense, setDeleteLicense] = useState(false);
  const handleDeleteLicense = () => {
    setDeleteLicense(false);
  };

  return (
    <>
      <section className="flex flex-col items-center justify-start gap-2 rounded-2xl border bg-white p-2 shadow">
        <div className="w-full grow">
          <Image
            className="h-full w-full rounded-lg object-cover"
            width={100}
            height={100}
            src={imgSrc}
            alt="credentials"
          />
        </div>
        <div className="flex flex-col gap-2  p-2 items-start justify-start w-full">
          <h2 className="text-lg font-semibold text-black">
            Infection Control Diploma
          </h2>
          <div className="flex w-full justify-between items-center">
            <p className="text-sm text-muted-foreground">23542345</p>
            <div className="flex items-center gap-3">
              <Edit
                onClick={() => setOpen(true)}
                width={22}
                height={22}
                className="text-muted-foreground cursor-pointer"
              />
              <Trash2
                onClick={() => setDeleteLicense(true)}
                width={22}
                height={22}
                className="cursor-pointer text-red-400"
              />
            </div>
          </div>
        </div>

      </section>

      {open && (
        <LicenseModal
          label="Edit License"
          open={open}
          onOpenChange={setOpen}
        />
      )}

      <DeleteModal
        open={deleteLicense}
        onOpenChange={setDeleteLicense}
        title="Do you want to delete this License?"
        description="The License will be permanently deleted from your account and you will not be able to recover it later. Please ensure before proceeding, as this action cannot be undone."
        cancelLabel="Back"
        onConfirm={handleDeleteLicense}
      />
    </>
  );
}
