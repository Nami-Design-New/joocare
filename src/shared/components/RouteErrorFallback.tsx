"use client";

import { Button } from "@/shared/components/ui/button";
import {
  getHttpErrorMessage,
  getHttpStatusCode,
  getHttpStatusMeta,
} from "@/shared/lib/http-error";

type RouteErrorFallbackProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RouteErrorFallback({
  error,
  reset,
}: RouteErrorFallbackProps) {
  const statusCode = getHttpStatusCode(error) ?? 500;
  const meta = getHttpStatusMeta(statusCode, getHttpErrorMessage(error));

  return (
    <section className="flex min-h-[50vh] items-center justify-center px-3 py-16 lg:px-25">
      <div className="bg-card w-full max-w-2xl rounded-3xl border p-8 text-center shadow-sm">
        <p className="text-primary text-sm font-semibold">{statusCode}</p>
        <h1 className="text-foreground mt-3 text-3xl font-semibold">
          {meta.title}
        </h1>
        <p className="text-muted-foreground mt-4 text-base">
          {meta.description}
        </p>
        <div className="mt-8 flex justify-center">
          <Button size="pill" onClick={reset}>
            Try again
          </Button>
        </div>
      </div>
    </section>
  );
}
