"use client";

import { Button } from "@/shared/components/ui/button";
import { useTranslations } from "next-intl";
import useGetQualifications from "../../hooks/useGetQualifications";
import { CredentialCardSkeletonList } from "../shared/CredentialCardSkeleton";
import CredentialsEmptyState from "../shared/CredentialsEmptyState";
import InfiniteScrollTrigger from "../shared/InfiniteScrollTrigger";
import QualificationCard from "./QualificationCard";

export default function QualificationsContent() {
  const t = useTranslations("Candidate");
  const {
    qualifications,
    isInitialLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetQualifications();

  if (isInitialLoading) {
    return <CredentialCardSkeletonList />;
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700">
        <p>{error instanceof Error ? error.message : t("loadQualificationsError")}</p>
        <Button
          type="button"
          variant="outline"
          size="pill"
          className="mt-4"
          onClick={() => void refetch()}
        >
          {t("retry")}
        </Button>
      </div>
    );
  }

  if (qualifications.length === 0) {
    return (
      <CredentialsEmptyState
        title={t("noQualificationsTitle")}
        description={t("noQualificationsDescription")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {qualifications.map((qualification) => (
        <QualificationCard key={qualification.id} qualification={qualification} />
      ))}

      <InfiniteScrollTrigger
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => void fetchNextPage()}
      />
    </div>
  );
}
