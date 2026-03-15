"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import React, { useRef } from "react";
import { Button } from "../ui/button";
import animationData from "../../../../public/assets/lottie/warning.json";
import Lottie, { LottieRefCurrentProps } from "lottie-react";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
};

export default function AlertModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Back",
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-175 rounded-2xl p-8 text-center">
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
        <DialogHeader className="">
          <DialogTitle className="text-foreground text-center text-3xl font-bold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-foreground text-center text-lg leading-tight">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="mt-6 flex w-full gap-2">
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              size="pill"
              className="grow"
            >
              {isLoading ? "Saving..." : confirmLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="pill"
              onClick={handleCancel}
              disabled={isLoading}
              className="grow"
            >
              {cancelLabel}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
