"use client";

import { useRouter } from "@/i18n/navigation";
import LoginAlertModal from "@/shared/components/modals/LoginAlertModal";
import { StoredFilepondUpload } from "@/shared/components/StoredFilepondUpload";
import { storeUploadedFile } from "@/shared/services/store-uploaded-file-service";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/shared/components/ui/dialog";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import SuccessModal from "@/shared/components/modals/SuccessModal";
import {
  applyToJobService,
  getCandidateCvProfile,
} from "../services/apply-job-service";

interface ApplyNowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: number;
  onApplySuccess?: () => void;
}
function getCvFileName(path: string | null) {
  if (!path) {
    return "";
  }

  const normalizedPath = path.split("?")[0] ?? path;

  return decodeURIComponent(normalizedPath.split("/").pop() || "CV");
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

export function ApplyNowModal({
  open,
  onOpenChange,
  jobId,
  onApplySuccess,
}: ApplyNowModalProps) {
  const locale = useLocale();
  const t = useTranslations("Job");
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [existingCvPath, setExistingCvPath] = useState<string | null>(null);
  const [uploadedCvPath, setUploadedCvPath] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [cvError, setCvError] = useState<string | null>(null);
  const [isLoadingCv, setIsLoadingCv] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const isCandidate = session?.authRole === "candidate";
  const existingCvUrl = useMemo(
    () => resolveStoredFileUrl(existingCvPath),
    [existingCvPath],
  );
  const existingCvFileName = useMemo(
    () => getCvFileName(existingCvPath),
    [existingCvPath],
  );
  const hasExistingCv = Boolean(existingCvPath);
  const hasUploadedCv = Boolean(uploadedCvPath);
  const canApply = hasExistingCv || hasUploadedCv;

  useEffect(() => {
    if (!open) {
      setCvError(null);
      setUploadedCvPath(null);
      setUploadedFiles([]);
      return;
    }

    if (status === "loading") {
      return;
    }

    if (!session?.accessToken) {
      onOpenChange(false);
      setLoginModalOpen(true);
      return;
    }

    if (!isCandidate) {
      onOpenChange(false);
      toast.error(t("onlyCandidatesCanApply"));
      return;
    }

    let active = true;
    const accessToken = session.accessToken;

    async function loadCurrentCv() {
      try {
        setIsLoadingCv(true);
        setCvError(null);

        const profile = await getCandidateCvProfile({
          token: accessToken,
          locale,
        });

        if (active) {
          setExistingCvPath(profile.cv);
        }
      } catch (error) {
        if (active) {
          const message =
            error instanceof Error ? error.message : t("failedToLoadCv");
          setCvError(message);
        }
      } finally {
        if (active) {
          setIsLoadingCv(false);
        }
      }
    }

    void loadCurrentCv();

    return () => {
      active = false;
    };
  }, [open, status, session?.accessToken, isCandidate, locale, onOpenChange, t]);

  async function handleApply() {
    if (isApplying) {
      return;
    }

    if (status === "loading") {
      toast.error(t("pleaseWait"));
      return;
    }

    if (!session?.accessToken) {
      onOpenChange(false);
      setLoginModalOpen(true);
      return;
    }

    if (!isCandidate) {
      toast.error(t("onlyCandidatesCanApply"));
      return;
    }

    if (!canApply) {
      setCvError(t("uploadCvFirst"));
      return;
    }

    try {
      setIsApplying(true);
      setCvError(null);

      const response = await applyToJobService({
        jobId,
        cvPath: uploadedCvPath,
        token: session.accessToken,
        locale,
      });

      onOpenChange(false);
      onApplySuccess?.();
      setIsOpenSuccessModal(true);
      toast.success(response.message ?? t("applySuccess"));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : t("applyFailure");
      toast.error(message);
    } finally {
      setIsApplying(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-175">
          <div className="flex flex-col gap-6">
            <DialogHeader>
              <DialogTitle className="text-[28px] text-black">
                {t("cvSubmissionTitle")}
              </DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-muted-foreground text-lg">
              {t("cvSubmissionDescription")}
            </DialogDescription>

            <div className="flex flex-col gap-5 rounded-b-[4px] border border-[#D9D9D9]">
              <div className="px-6 pt-2">
                {isLoadingCv ? (
                  <div className="rounded-xl border border-[#0B7A75] bg-[#F8FBFB] px-4 py-5 text-sm text-muted-foreground">
                    {t("loadingCv")}
                  </div>
                ) : hasExistingCv ? (
                  <div className="rounded-xl border border-[#0B7A75] bg-[#F8FBFB] px-4 py-5">
                    <button
                      type="button"
                      className="flex items-center gap-3 text-left"
                      onClick={() =>
                        existingCvUrl
                          ? window.open(existingCvUrl, "_blank", "noopener,noreferrer")
                          : undefined
                      }
                    >
                      <Image
                        src="/assets/pdf_file.svg"
                        alt={t("cvFileAlt")}
                        width={24}
                        height={24}
                      />
                      <span className="text-sm text-foreground">{existingCvFileName}</span>
                    </button>
                  </div>
                ) : null}
              </div>

              {hasExistingCv ? (
                <div className="flex items-center gap-4 px-6">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-sm font-medium text-foreground">{t("or")}</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
              ) : null}

              <div className="px-6 pb-6">
                <StoredFilepondUpload
                  label={hasExistingCv ? t("uploadNewCv") : t("uploadCv")}
                  files={uploadedFiles}
                  onChange={setUploadedFiles}
                  maxFiles={1}
                  acceptedFileTypes={[
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  ]}
                  existingFileUrl={null}
                  processFile={(file) => storeUploadedFile({ file, locale })}
                  onStoredPathChange={(path) => {
                    setUploadedCvPath(path);
                    setCvError(null);
                  }}
                  onUploadError={(message) => setCvError(message)}
                  className="[&_.filepond--root]:mb-0 [&_.filepond--drop-label]:bg-[#FAFAFA] [&_.filepond--panel-root]:border [&_.filepond--panel-root]:border-[#D9D9D9] [&_.filepond--panel-root]:bg-[#FAFAFA]"
                  error={cvError ?? undefined}
                />
                {!hasExistingCv ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="pill"
                    className="mt-3"
                    onClick={() => {
                      onOpenChange(false);
                      router.push("/candidate/profile");
                    }}
                  >
                    {t("goToProfile")}
                  </Button>
                ) : null}
              </div>
            </div>

            <DialogFooter className="flex justify-center!">
              <Button
                className="w-1/3"
                size="pill"
                type="button"
                disabled={isApplying || isLoadingCv}
                onClick={() => void handleApply()}
              >
                {isApplying ? t("applying") : t("applyNow")}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <LoginAlertModal
        open={loginModalOpen}
        onOpenChange={setLoginModalOpen}
      />

      <SuccessModal
        open={isOpenSuccessModal}
        onOpenChange={setIsOpenSuccessModal}
        variant="submitted"
        title={t("applicationSubmittedTitle")}
        description={t("applicationSubmittedDescription")}
        primaryAction={{
          label: t("goToApplications"),
          href: "/candidate/applications",
        }}
        secondaryAction={{
          label: t("exploreMoreJobs"),
          href: "/jobs",
        }}
      />
    </>
  );
}
