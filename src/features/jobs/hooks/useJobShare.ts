"use client";

import { usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type UseJobShareOptions = {
  title?: string;
  path?: string;
};

function normalizeSharePath(path: string, locale: string) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  if (path.startsWith(`/${locale}/`) || path === `/${locale}`) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalizedPath}`;
}

function buildAbsoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  if (typeof window === "undefined") {
    return path;
  }

  return new URL(path, window.location.origin).toString();
}

export function useJobShare({ title = "Check out this job", path }: UseJobShareOptions = {}) {
  const locale = useLocale();
  const pathname = usePathname();
  const [shareUrl, setShareUrl] = useState("");

  const resolvedPath = useMemo(
    () => normalizeSharePath(path ?? pathname, locale),
    [locale, path, pathname],
  );

  useEffect(() => {
    setShareUrl(buildAbsoluteUrl(resolvedPath));
  }, [resolvedPath]);

  const copyLink = async () => {
    const fallbackUrl = buildAbsoluteUrl(resolvedPath);
    const urlToCopy = shareUrl || fallbackUrl;

    try {
      await navigator.clipboard.writeText(urlToCopy);
      toast.success("Job link copied successfully.");
    } catch {
      toast.error("Unable to copy the job link.");
    }
  };

  const shareJob = async () => {
    const fallbackUrl = buildAbsoluteUrl(resolvedPath);
    const urlToShare = shareUrl || fallbackUrl;

    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({
          title,
          text: title,
          url: urlToShare,
        });
        return;
      }

      await navigator.clipboard.writeText(urlToShare);
      toast.success("Job link copied successfully.");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      toast.error("Unable to share the job link.");
    }
  };

  return {
    shareUrl: shareUrl || resolvedPath,
    copyLink,
    shareJob,
  };
}
