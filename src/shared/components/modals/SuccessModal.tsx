"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { useRef } from "react";
import animationData from "../../../../public/assets/lottie/successfully.json";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
};

export default function SuccessModal({
  open,
  onOpenChange,
  title,
  description,
}: ConfirmDialogProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

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
      </DialogContent>
    </Dialog>
  );
}
