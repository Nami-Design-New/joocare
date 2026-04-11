"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/shared/components/ui/button";
import { File, Eye } from "lucide-react";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { storeUploadedFile } from "@/shared/services/store-uploaded-file-service";
import CVModal from "./CVModal";
import { deleteCvAction, updateCvAction } from "../actions/cv-actions";
import { cvSchema } from "../validation/cv-schema";

function getShortFileName(fileName: string) {
  const trimmedName = fileName.trim();

  if (!trimmedName) {
    return "CV";
  }

  const lastDotIndex = trimmedName.lastIndexOf(".");
  const hasExtension = lastDotIndex > 0;
  const extension = hasExtension ? trimmedName.slice(lastDotIndex + 1) : "";
  const baseName = hasExtension
    ? trimmedName.slice(0, lastDotIndex)
    : trimmedName;

  if (baseName.length <= 14) {
    return trimmedName;
  }

  const shortBase = `${baseName.slice(0, 6)}...${baseName.slice(-4)}`;

  return extension ? `${shortBase}.${extension}` : shortBase;
}

function resolveStoredFileUrl(path: string | null) {
  if (!path) {
    return null;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `https://joocare.nami-tec.com/storage/${path.replace(/^\/+/, "")}`;
}

const UploadCvSection = ({ cvUrl }: { cvUrl: string | null }) => {
  const [currentCvUrl, setCurrentCvUrl] = useState<string | null>(cvUrl);
  const [selectedCvFile, setSelectedCvFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const { data: session } = useSession();
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    setCurrentCvUrl(cvUrl);
  }, [cvUrl]);

  useEffect(() => {
    if (!selectedCvFile) {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      return;
    }

    const nextObjectUrl = URL.createObjectURL(selectedCvFile);

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    objectUrlRef.current = nextObjectUrl;

    return () => {
      if (objectUrlRef.current === nextObjectUrl) {
        URL.revokeObjectURL(nextObjectUrl);
        objectUrlRef.current = null;
      }
    };
  }, [selectedCvFile]);

  const displayUrl = objectUrlRef.current ?? resolveStoredFileUrl(currentCvUrl);
  const hasCv = Boolean(selectedCvFile || currentCvUrl);
  const displayFileName = useMemo(() => {
    if (selectedCvFile) {
      return getShortFileName(selectedCvFile.name);
    }

    if (!currentCvUrl) {
      return "";
    }

    const cleanUrl = currentCvUrl.split("?")[0];
    return getShortFileName(
      decodeURIComponent(cleanUrl.split("/").pop() || "CV"),
    );
  }, [currentCvUrl, selectedCvFile]);

  const displayFileSize = selectedCvFile
    ? `${(selectedCvFile.size / (1024 * 1024)).toFixed(1)}MB`
    : null;

  // open file picker
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // handle file change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = cvSchema.safeParse({ cv: file });
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message || "Invalid CV file.");
      e.target.value = "";
      return;
    }

    try {
      setIsUploading(true);
      const uploadedFile = await storeUploadedFile({
        file,
        locale,
      });

      const payload = new FormData();
      payload.append("cv", uploadedFile.path);
      payload.append("locale", locale);
      const response = await updateCvAction(payload, session?.accessToken);

      setSelectedCvFile(file);
      setCurrentCvUrl(uploadedFile.path);
      setOpen(false);
      toast.success(response.message);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to upload CV.";
      toast.error(message);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  // view file
  const handleView = () => {
    if (!hasCv) return;
    setOpen(true);
  };

  // download file
  const handleDownload = () => {
    if (!displayUrl) return;
    const url = displayUrl;

    const a = document.createElement("a");
    a.href = url;
    a.download = displayFileName || "cv";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteCvAction(locale, session?.accessToken);

      setSelectedCvFile(null);
      setCurrentCvUrl(null);
      setOpen(false);
      toast.success(response.message);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete CV.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* hidden input */}
      <input
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {!hasCv ? (
        // ================= NO CV =================
        <Button
          variant="outline"
          size="pill"
          onClick={handleUploadClick}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload CV"}
        </Button>
      ) : (
        // ================= HAS CV =================
        <section className="flex flex-col gap-2 bg-[#09760A05] p-6">
          {/* File Info */}
          <div className="flex items-center justify-center gap-2 rounded-[8px] bg-white p-5 shadow">
            <Image
              src={"/assets/pdf_file.svg"}
              alt="pdf"
              width={24}
              height={24}
            />

            <span className="text-sm">{displayFileName}</span>

            {displayFileSize && (
              <span className="text-primary text-sm font-semibold">
                {displayFileSize}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleDownload}
              className="flex h-8 flex-1 items-center justify-center gap-1 rounded-full text-[12px]"
            >
              <File className="h-3 w-3" />
              Download
            </Button>

            <Button
              variant="outline"
              onClick={handleView}
              className="flex h-8 flex-1 items-center justify-center gap-1 rounded-full text-[12px]"
            >
              <Eye className="h-3 w-3" />
              View
            </Button>
          </div>
        </section>
      )}

      {hasCv && (
        <CVModal
          open={open}
          onOpenChange={setOpen}
          title={"View Cv"}
          url={displayUrl ?? undefined}
          fileName={displayFileName}
          handleDownload={handleDownload}
          handleUploadClick={handleUploadClick}
          handleDelete={handleDelete}
          isDeleting={isDeleting}
          isUploading={isUploading}
        />
      )}
    </>
  );
};

export default UploadCvSection;
