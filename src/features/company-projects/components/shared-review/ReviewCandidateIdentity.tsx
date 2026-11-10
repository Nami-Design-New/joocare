import Image from 'next/image';
import { cn } from '@/shared/lib/utils';
import type { SharedReviewCandidate } from '../../types/shared-review.types';
import CandidateDecisionBadge from './CandidateDecisionBadge';

type ReviewCandidateIdentityProps = {
  candidate: SharedReviewCandidate;
  className?: string;
};

export default function ReviewCandidateIdentity({
  candidate,
  className,
}: ReviewCandidateIdentityProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Image
        src={candidate.image}
        alt=""
        width={52}
        height={52}
        className="size-13 shrink-0 rounded-2xl object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="text-foreground truncate font-semibold">
          {candidate.name}
        </h3>
        <p className="text-muted-foreground truncate text-sm">
          {candidate.specialty}
        </p>
      </div>
      <CandidateDecisionBadge decision={candidate.status} />
    </div>
  );
}
