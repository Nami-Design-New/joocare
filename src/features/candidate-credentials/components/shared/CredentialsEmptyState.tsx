"use client";

import EmptyDataState from "@/shared/components/EmptyDataState";

type CredentialsEmptyStateProps = {
  title: string;
  description: string;
};

export default function CredentialsEmptyState({
  title,
  description,
}: CredentialsEmptyStateProps) {
  return <EmptyDataState title={title} description={description} className="min-h-[360px]" />;
}
