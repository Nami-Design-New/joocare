"use client";

import { Button, buttonVariants } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { VariantProps } from "class-variance-authority";
import Image from "next/image";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmButtonVariant?: VariantProps<typeof buttonVariants>["variant"];
  onConfirm: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
};
export default function DeleteModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm deletion",
  cancelLabel = "Back",
  onConfirm,
  confirmButtonVariant = "destructive",
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-150 rounded-2xl p-8 text-center">
        <div className="flex w-full items-center justify-center">
          <div className="h-50 w-50">
            <Image
              src="/assets/gif/trash-icon.gif"
              alt=""
              width={200}
              height={200}
              className="h-full w-full object-contain"
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
              variant={confirmButtonVariant}
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
