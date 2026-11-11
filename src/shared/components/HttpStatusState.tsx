import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import {
  getHttpErrorMessage,
  getHttpStatusMeta,
} from '@/shared/lib/http-error';

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
  primaryHref = '/',
  primaryLabel = 'Back to home',
  secondaryHref,
  secondaryLabel,
}: HttpStatusStateProps) {
  const message = getHttpErrorMessage(error);
  const meta = getHttpStatusMeta(statusCode, message);

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
