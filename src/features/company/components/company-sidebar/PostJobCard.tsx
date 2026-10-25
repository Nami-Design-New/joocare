"use client";

import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { Plus, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

type PostJobCardProps = {
  canPostJob: boolean;
};

export default function PostJobCard({ canPostJob }: PostJobCardProps) {
  const t = useTranslations();
  const tooltip = `${t("companyPage.sidebar.post-job-tooltip-line-1")} ${t("companyPage.sidebar.post-job-tooltip-line-2")}`;

  const buttonClassName = cn(
    buttonVariants({ variant: "default", size: "sm" }),
    "w-full justify-center gap-1 rounded-full text-xs",
  );

  return (
    <section className="order-3 mt-auto rounded-2xl bg-muted p-3">
      <span className="mb-2 flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Sparkles className="size-4" aria-hidden="true" />
      </span>
      <h2 className="text-xs font-semibold text-foreground">
        {t("companyPage.sidebar.post-job-card-title")}
      </h2>
      <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
        {t("companyPage.sidebar.post-job-card-subtitle")}
      </p>

      <div className="group/post-job relative mt-3">
        {canPostJob ? (
          <Link href="/company/post-job" className={buttonClassName}>
            <Plus aria-hidden="true" />
            {t("companyPage.sidebar.post-job")}
          </Link>
        ) : (
          <button
            type="button"
            disabled
            title={tooltip}
            aria-describedby="post-job-disabled-tooltip"
            className={buttonClassName}
          >
            <Plus aria-hidden="true" />
            {t("companyPage.sidebar.post-job")}
          </button>
        )}

        {!canPostJob ? (
          <span
            id="post-job-disabled-tooltip"
            role="tooltip"
            className="pointer-events-none absolute bottom-full start-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-3 py-1 text-xs text-background group-hover/post-job:block"
          >
            {tooltip}
          </span>
        ) : null}
      </div>
    </section>
  );
}
