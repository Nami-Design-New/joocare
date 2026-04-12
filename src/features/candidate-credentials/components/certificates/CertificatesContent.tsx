"use client";

import { Button } from "@/shared/components/ui/button";
import { useTranslations } from "next-intl";
import useGetCertificates from "../../hooks/useGetCertificates";
import { CredentialCardSkeletonList } from "../shared/CredentialCardSkeleton";
import CredentialsEmptyState from "../shared/CredentialsEmptyState";
import InfiniteScrollTrigger from "../shared/InfiniteScrollTrigger";
import CertificateCard from "./CertificateCard";

export default function CertificatesContent() {
  const t = useTranslations("Candidate");
  const {
    certificates,
    isInitialLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetCertificates();

  if (isInitialLoading) {
    return <CredentialCardSkeletonList />;
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700">
        <p>{error instanceof Error ? error.message : t("loadCertificatesError")}</p>
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

  if (certificates.length === 0) {
    return (
      <CredentialsEmptyState
        title={t("noCertificatesTitle")}
        description={t("noCertificatesDescription")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {certificates.map((certificate) => (
        <CertificateCard key={certificate.id} certificate={certificate} />
      ))}

      <InfiniteScrollTrigger
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => void fetchNextPage()}
      />
    </div>
  );
}
