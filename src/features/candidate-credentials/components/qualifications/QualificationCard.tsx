"use client";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { QualificationModal } from "./QualificationModal";
import DeleteModal from "@/shared/components/modals/DeleteModal";

export default function QualificationCard() {
  const [open, setOpen] = useState(false);
  const [deleteQualification, setDeleteQualification] = useState(false);
  const handleDeleteQualification = () => {
    setDeleteQualification(false);
  };

  return (
    <>
      <section className="flex flex-col sm:flex-row sm:items-center justify-start gap-2 rounded-2xl border bg-white p-2 shadow">
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
              Bachelor&apos;s degree, Medicine and Surgery
            </h2>
            <div className="flex items-center gap-3">
              <Edit
                onClick={() => setOpen(true)}
                width={22}
                height={22}
                className="text-muted-foreground cursor-pointer"
              />
              <Trash2
                onClick={() => setDeleteQualification(true)}
                width={22}
                height={22}
                className="cursor-pointer text-red-400"
              />
            </div>
          </div>
          <p className="text-base">Egypt</p>
          <p className="text-base">Tanta University</p>
          <p className="text-base">21 December 2023 - 21 December 2026</p>
        </div>
      </section>

      {open && (
        <QualificationModal
          label="Edit Qualification"
          open={open}
          onOpenChange={setOpen}
        />
      )}

      <DeleteModal
        open={deleteQualification}
        onOpenChange={setDeleteQualification}
        title="Do you want to delete this Qualification?"
        description="The Qualification will be permanently deleted from your account and you will not be able to recover it later. Please ensure before proceeding, as this action cannot be undone."
        cancelLabel="Back"
        onConfirm={handleDeleteQualification}
      />
    </>
  );
}
