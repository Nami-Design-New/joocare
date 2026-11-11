import Image from 'next/image';
import type { AssessmentCandidateSummary } from '../../types/candidate-assessment.types';

type CandidateSummaryCardProps = {
  candidate: AssessmentCandidateSummary;
};

export default function CandidateSummaryCard({
  candidate,
}: CandidateSummaryCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-primary bg-primary-bg p-3">
      <Image
        src={candidate.image}
        alt=""
        width={48}
        height={48}
        className="size-12 shrink-0 rounded-full object-cover"
      />
      <div className="flex min-w-0 flex-col gap-1">
        <p className="truncate font-semibold">{candidate.name}</p>
        <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {candidate.location && (
            <>
              <span>{candidate.location}</span>
              <span
                aria-hidden
                className="size-1 rounded-full bg-muted-foreground/50"
              />
            </>
          )}
          <bdi className="truncate">{candidate.email}</bdi>
        </p>
      </div>
    </div>
  );
}
