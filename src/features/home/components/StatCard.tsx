import { Plus } from 'lucide-react';

const StatCard = ({
  value,
  label,
  percentage = '',
  plus = true,
}: {
  value: number | undefined;
  label: string;
  percentage?: string;
  plus?: boolean;
}) => (
  <div className="flex flex-col items-center justify-start rounded-2xl border border-border bg-muted p-4 text-center transition-all hover:shadow-md sm:p-8">
    <span className="flex items-center gap-2 text-xl font-bold text-foreground md:text-4xl">
      {plus && (
        <Plus
          color="var(--primary)"
          size={20}
          className="font-extrabold"
          strokeWidth={6}
        />
      )}
      {value} <span className="text-primary">{percentage}</span>
    </span>
    <p className="mt-2 text-xs font-medium text-muted-foreground md:text-sm">
      {label}
    </p>
  </div>
);
export default StatCard;
