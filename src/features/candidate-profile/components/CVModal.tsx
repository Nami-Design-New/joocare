"use client";

import PdfViewer from "@/shared/components/PdfViewer";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { RefreshCw, Trash } from "lucide-react";
import Image from "next/image";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  url?: string;
  handleDownload: () => void;
  handleUploadClick: () => void;
  handleDelete: () => void;
};
export default function CVModal({
  open,
  onOpenChange,
  title,
  url,
  handleDownload,
  handleUploadClick,
  handleDelete,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="mb-25 max-w-150 rounded-2xl p-8 text-center">
        <DialogHeader className="-mt-5 flex flex-row items-center justify-between pe-2">
          <DialogTitle className="text-foreground text-xl font-bold">
            {title}
          </DialogTitle>
          <Button
            size="sm"
            variant="secondary"
            className="flex items-center gap-1.5 rounded-full px-4"
            onClick={() => handleDownload()}
          >
            <Image
              src="/assets/icons/pdf-icon.svg"
              width={14}
              height={14}
              alt="pdf icon"
            />
            Download
          </Button>
        </DialogHeader>

        <PdfViewer url={url ? url : "/cv.pdf"} />

        <div className="flex justify-center items-center gap-2">
          <Button
            size="sm"
            variant="destructive"
            className="flex items-center gap-1.5 rounded-full px-4 h-10"
            onClick={() => handleDelete()}
          >
            <Trash className="h-4 w-4" />
            Delete
          </Button>
          <Button
            size="sm"
            variant="default"
            className="flex items-center gap-1.5 rounded-full px-4 h-10"
            onClick={() => handleUploadClick()}
          >
            <RefreshCw className="h-4 w-4" />
            Update
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
