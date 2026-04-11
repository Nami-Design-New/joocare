"use client";

import { Bookmark } from "lucide-react";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import LoginAlertModal from "@/shared/components/modals/LoginAlertModal";
import { useToggleSavedJob } from "../../hooks/useToggleSavedJob";

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
          className={`h-13 w-13 rounded-[4px] p-4 ${
            isSaved
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-accent text-primary"
          } ${className}`}
          aria-pressed={isSaved}
          aria-label={isSaved ? "Unsave job" : "Save job"}
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
        className={`border-border h-9 px-4 py-2 text-sm ${
          isSaved
            ? "bg-accent text-primary hover:bg-accent/90"
            : "text-muted-foreground"
        } ${className}`}
        aria-pressed={isSaved}
      >
        <Bookmark fill={isSaved ? "currentColor" : "none"} />
        {isSaved ? "Saved" : "Save"}
      </Button>
    </>
  );
}
