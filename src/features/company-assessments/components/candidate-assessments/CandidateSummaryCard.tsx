import Image from 'next/image';
import type { AssessmentCandidateSummary } from '../../types/candidate-assessment.types';

type CandidateSummaryCardProps = {
  candidate: AssessmentCandidateSummary;
};

export default function CandidateSummaryCard({
  candidate,
}: CandidateSummaryCardProps) {
  return (
    <div className="border-primary bg-primary-bg flex items-center gap-3 rounded-2xl border p-3">
      <Image
        src={candidate.image}
        alt=""
        width={48}
        height={48}
        className="size-12 shrink-0 rounded-full object-cover"
      />
      <div className="flex min-w-0 flex-col gap-1">
        <p className="truncate font-semibold">{candidate.name}</p>
        <p className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
          {candidate.location && (
            <>
              <span>{candidate.location}</span>
              <span aria-hidden className="bg-muted-foreground/50 size-1 rounded-full" />
            </>
          )}
          <bdi className="truncate">{candidate.email}</bdi>
        </p>
      </div>
    </div>
  );
}
