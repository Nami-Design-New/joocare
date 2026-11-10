import { cn } from '@/shared/lib/utils';

type CandidateScoreCircleProps = {
  score: number | null;
  className?: string;
};

export default function CandidateScoreCircle({
  score,
  className,
}: CandidateScoreCircleProps) {
  if (score === null) {
    return <span className="text-muted-foreground block text-center">-</span>;
  }

  return (
    <span
      className={cn(
        'border-primary text-primary mx-auto flex size-12 items-center justify-center rounded-full border-2 text-sm',
        className,
      )}
    >
      {score}%
    </span>
  );
}
