import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/components/ui/button";
import {
  getHttpErrorMessage,
  getHttpStatusMeta,
} from "@/shared/lib/http-error";

type HttpStatusStateProps = {
  statusCode: number;
  error?: unknown;
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export default function HttpStatusState({
  statusCode,
  error,
  title,
  description,
  primaryHref = "/",
  primaryLabel = "Back to home",
  secondaryHref,
  secondaryLabel,
}: HttpStatusStateProps) {
  const message = getHttpErrorMessage(error);
  const meta = getHttpStatusMeta(statusCode, message);

  return (
    <section className="layout-shell flex min-h-[50vh] items-center justify-center py-16">
      <div className="bg-card w-full max-w-2xl rounded-3xl border p-8 text-center shadow-sm">
        <p className="text-primary text-sm font-semibold">{statusCode}</p>
        <h1 className="text-foreground mt-3 text-3xl font-semibold">
          {title ?? meta.title}
        </h1>
        <p className="text-muted-foreground mt-4 text-base">
          {description ?? meta.description}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="pill">
            <Link href={primaryHref}>{primaryLabel}</Link>
          </Button>
          {secondaryHref && secondaryLabel ? (
            <Button asChild variant="outline" size="pill">
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
