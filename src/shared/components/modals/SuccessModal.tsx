"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/components/ui/button";
import {
  DialogClose,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Check, Sparkles, X } from "lucide-react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { useEffect, useRef } from "react";
import animationData from "../../../../public/assets/lottie/successfully.json";

type SuccessModalAction = {
  label: string;
  href?: string;
  onClick?: () => void;
};

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  variant?: "default" | "submitted";
  primaryAction?: SuccessModalAction;
  secondaryAction?: SuccessModalAction;
};

export default function SuccessModal({
  open,
  onOpenChange,
  title,
  description,
  variant = "default",
  primaryAction,
  secondaryAction,
}: ConfirmDialogProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const isSubmittedVariant = variant === "submitted";

  const renderAction = (
    action: SuccessModalAction,
    buttonVariant: "default" | "outline",
  ) => {
    if (action.href) {
      return (
        <Button asChild variant={buttonVariant} size="pill" className="h-11 flex-1">
          <Link href={action.href} onClick={() => onOpenChange(false)}>
            {action.label}
          </Link>
        </Button>
      );
    }

    return (
      <Button
        type="button"
        variant={buttonVariant}
        size="pill"
        className="h-11 flex-1"
        onClick={() => {
          action.onClick?.();
          onOpenChange(false);
        }}
      >
        {action.label}
      </Button>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={!isSubmittedVariant}
        className="max-w-150 rounded-2xl p-8 text-center"
      >

        <div className="relative overflow-hidden rounded-[24px] bg-white px-6 pb-7 pt-12 text-center sm:px-8">
          <DialogClose asChild>
            <button
              type="button"
              className="absolute left-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogClose>







        </div>

        <div className="mt-15 mb-12 flex w-full items-center justify-center">
          <div className="h-50 w-50">
            <Lottie
              lottieRef={lottieRef}
              animationData={animationData}
              height={200}
              width={200}
              autoplay={true}
              loop={true}
            />
          </div>
        </div>
        <DialogHeader>
          <DialogTitle className="text-foreground text-center text-3xl font-bold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-foreground text-center text-lg leading-tight">
            {description}
          </DialogDescription>
        </DialogHeader>   {
          primaryAction || secondaryAction ? (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {primaryAction ? renderAction(primaryAction, "default") : null}
              {secondaryAction ? renderAction(secondaryAction, "outline") : null}
            </div>) : null
        }


      </DialogContent >
    </Dialog >
  );
}
