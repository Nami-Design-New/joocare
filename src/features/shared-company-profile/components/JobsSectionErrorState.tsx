"use client";

import { Button } from "@/shared/components/ui/button";
import { getHttpErrorMessage, getHttpStatusCode } from "@/shared/lib/http-error";
import { useTranslations } from "next-intl";

type JobsSectionErrorStateProps = {
  error?: unknown;
  onRetry?: () => void;
};

export default function JobsSectionErrorState({
  error,
  onRetry,
}: JobsSectionErrorStateProps) {
  const t = useTranslations();
  const statusCode = getHttpStatusCode(error);
  const message =
    getHttpErrorMessage(error) ||
    t("sharedCompanyProfilePage.jobs-load-failed");

  return (
    <div className="col-span-full rounded-[28px] border bg-white px-6 py-10 text-center">
      {statusCode ? (
        <p className="text-primary text-sm font-semibold">{statusCode}</p>
      ) : null}
      <h3 className="mt-3 text-base md:text-lg font-semibold text-secondary">
        {t("sharedCompanyProfilePage.jobs-unavailable")}
      </h3>
      <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
        {message}
      </p>
      {onRetry ? (
        <div className="mt-6 flex justify-center">
          <Button size="pill" onClick={onRetry}>
            {t("candidatePage.common.try-again")}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
