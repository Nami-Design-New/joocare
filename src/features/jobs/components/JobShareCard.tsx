"use client";

import { Button } from "@/shared/components/ui/button";
import { useJobShare } from "../hooks/useJobShare";
import Image from "next/image";

type JobShareCardProps = {
  title?: string;
  path?: string;
};

export default function JobShareCard({ title, path }: JobShareCardProps) {
  const { shareUrl, copyLink } = useJobShare({ title, path });
  const encodedShareUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title || "Check out this job");

  return (
    <div className="card border-border shadow-card min-h-36 rounded-2xl border-2 bg-white p-8">
      <h2 className="text-foreground mb-4 text-lg font-semibold">
        Share this job:
      </h2>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="ghost"
          className="text-primary bg-accent hover:bg-accent flex h-auto items-center gap-2 rounded-lg px-4 py-2"
          onClick={() => void copyLink()}
        >
          <Image
            src="/assets/icons/pin-link-icon.svg"
            alt="link icon"
            width={24}
            height={24}
          />
          <span className="text-lg">Copy Link</span>
        </Button>
        <div className="flex gap-2">
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}`}
            target="_blank"
            rel="noreferrer"
            className="bg-accent flex items-center justify-center rounded-lg p-2.5"
            aria-label="Share on LinkedIn"
          >
            <Image
              src="/assets/icons/linkedin-filled.svg"
              width={20}
              height={20}
              alt="Linked in icon"
            />
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`}
            target="_blank"
            rel="noreferrer"
            className="bg-accent flex items-center justify-center rounded-lg p-2.5"
            aria-label="Share on Facebook"
          >
            <Image
              src="/assets/icons/facebook-filled.svg"
              width={20}
              height={20}
              alt="Facebook icon"
            />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodedShareUrl}&text=${encodedTitle}`}
            target="_blank"
            rel="noreferrer"
            className="bg-accent flex items-center justify-center rounded-lg p-2.5"
            aria-label="Share on X"
          >
            <Image
              src="/assets/icons/x-filled.svg"
              width={20}
              height={20}
              alt="Linked in icon"
            />
          </a>

          <a
            href={`mailto:?subject=${encodedTitle}&body=${encodedShareUrl}`}
            className="bg-accent flex items-center justify-center rounded-lg p-2.5"
            aria-label="Share by email"
          >
            <Image
              src="/assets/icons/envelope.svg"
              width={20}
              height={20}
              alt="envelope icon"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
