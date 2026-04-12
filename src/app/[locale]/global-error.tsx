"use client";

import RouteErrorFallback from "@/shared/components/RouteErrorFallback";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <RouteErrorFallback error={error} reset={reset} />
      </body>
    </html>
  );
}
