"use client";

import { Button } from "@/shared/components/ui/button";
import { getHttpErrorMessage, getHttpStatusCode } from "@/shared/lib/http-error";

type JobsSectionErrorStateProps = {
  error?: unknown;
  onRetry?: () => void;
};

export default function JobsSectionErrorState({
  error,
  onRetry,
}: JobsSectionErrorStateProps) {
  const statusCode = getHttpStatusCode(error);
  const message =
    getHttpErrorMessage(error) ||
    "We could not load jobs for this company right now.";

  return (
    <div className="col-span-full rounded-[28px] border bg-white px-6 py-10 text-center">
      {statusCode ? (
        <p className="text-primary text-sm font-semibold">{statusCode}</p>
      ) : null}
      <h3 className="mt-3 text-lg font-semibold text-secondary">
        Jobs are unavailable
      </h3>
      <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
        {message}
      </p>
      {onRetry ? (
        <div className="mt-6 flex justify-center">
          <Button size="pill" onClick={onRetry}>
            Try again
          </Button>
        </div>
      ) : null}
    </div>
  );
}
