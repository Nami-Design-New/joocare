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
    return <span className="block text-center text-muted-foreground">-</span>;
  }

  return (
    <span
      className={cn(
        'mx-auto flex size-12 items-center justify-center rounded-full border-2 border-primary text-sm text-primary',
        className,
      )}
    >
      {score}%
    </span>
  );
}
