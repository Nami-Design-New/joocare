'use client';

import { Button } from '@/shared/components/ui/button';
import {
  getHttpErrorMessage,
  getHttpStatusCode,
  getHttpStatusMeta,
} from '@/shared/lib/http-error';

type RouteErrorFallbackProps = {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
  retryLabel?: string;
};

export default function RouteErrorFallback({
  error,
  reset,
  title,
  description,
  retryLabel = 'Try again',
}: RouteErrorFallbackProps) {
  const statusCode = getHttpStatusCode(error) ?? 500;
  const meta = getHttpStatusMeta(statusCode, getHttpErrorMessage(error));

  return (
    <section className="layout-shell flex min-h-[50vh] items-center justify-center py-8 sm:py-16">
      <div className="w-full max-w-2xl rounded-3xl border bg-card p-5 text-center shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-primary">{statusCode}</p>
        <h1 className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl">
          {title ?? meta.title}
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          {description ?? meta.description}
        </p>
        <div className="mt-8 flex justify-center">
          <Button size="pill" onClick={reset}>
            {retryLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
