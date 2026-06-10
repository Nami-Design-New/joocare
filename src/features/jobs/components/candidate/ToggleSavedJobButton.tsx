"use client";

import { Bookmark } from "lucide-react";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import LoginAlertModal from "@/shared/components/modals/LoginAlertModal";
import { useToggleSavedJob } from "../../hooks/useToggleSavedJob";
import { useTranslations } from "next-intl";

type ToggleSavedJobButtonProps = {
  jobId: number;
  initialIsSaved: boolean;
  variant?: "icon" | "pill";
  className?: string;
  onSavedChange?: (nextSavedState: boolean) => void;
};

export default function ToggleSavedJobButton({
  jobId,
  initialIsSaved,
  variant = "pill",
  className = "",
  onSavedChange,
}: ToggleSavedJobButtonProps) {
  const t = useTranslations()
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { isSaved, toggleSaved, isPending } = useToggleSavedJob(
    jobId,
    initialIsSaved,
    {
      onSavedChange,
      onAuthRequired: () => setLoginModalOpen(true),
    },
  );

  if (variant === "icon") {
    return (
      <>
        <LoginAlertModal
          open={loginModalOpen}
          onOpenChange={setLoginModalOpen}
        />
        <Button
          type="button"
          size="icon"
          disabled={isPending}
          onClick={toggleSaved}
          className={`h-13 w-13 rounded-[4px] p-4 ${isSaved
            ? "bg-primary text-white hover:bg-primary/90"
            : "bg-accent text-primary"
            } ${className}`}
          aria-pressed={isSaved}
          aria-label={isSaved ? t('common.unSave-job') : t('common.save-job')}
        >
          <Bookmark size={24} fill={isSaved ? "currentColor" : "none"} />
        </Button>
      </>
    );
  }

  return (
    <>
      <LoginAlertModal
        open={loginModalOpen}
        onOpenChange={setLoginModalOpen}
      />
      <Button
        type="button"
        variant="outline"
        size="pill"
        disabled={isPending}
        onClick={toggleSaved}
        className={`border-border h-9 px-4 py-2 text-xs md:text-sm ${isSaved
          ? "bg-accent text-primary hover:bg-accent/90"
          : "text-muted-foreground"
          } ${className}`}
        aria-pressed={isSaved}
      >
        <Bookmark className="size-4 md:size-5" fill={isSaved ? "currentColor" : "none"} />
        {isSaved ? t('common.saved') : t('common.save')}
      </Button>
    </>
  );
}
