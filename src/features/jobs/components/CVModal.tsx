"use client";

import PdfViewer from "@/shared/components/PdfViewer";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import Image from "next/image";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  pdfUrl?: string | null;
};
export default function CVModal({
  open,
  onOpenChange,
  title,
  pdfUrl,
}: ConfirmDialogProps) {
  console.log("pdfUrl", pdfUrl);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="mb-25 max-w-150 rounded-2xl p-8 text-center">
        <DialogHeader className="-mt-5 flex flex-row items-center justify-between pe-2">
          <DialogTitle className="text-foreground text-xl font-bold">
            {title}
          </DialogTitle>
          {pdfUrl ? (
            <Button asChild size="sm" variant="secondary" className="flex items-center gap-1.5 rounded-full px-4">
              <a href={pdfUrl} target="_blank" rel="noreferrer">
                <Image
                  src="/assets/icons/pdf-icon.svg"
                  width={14}
                  height={14}
                  alt="pdf icon"
                />
                Download
              </a>
            </Button>
          ) : null}
        </DialogHeader>

        {pdfUrl ? <PdfViewer url={pdfUrl} /> : <p className="text-muted-foreground">No CV available.</p>}
      </DialogContent>
    </Dialog>
  );
}
