import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { cn } from '@/shared/lib/utils';

type DashboardWidgetTitleProps = {
  title: string;
  description: string;
  className?: string;
};

export default function DashboardWidgetTitle({
  title,
  description,
  className,
}: DashboardWidgetTitleProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <h2
          tabIndex={0}
          className={cn(
            'w-fit text-base leading-5 font-semibold text-secondary outline-none focus-visible:ring-2 focus-visible:ring-ring',
            className,
          )}
        >
          {title}
        </h2>
      </TooltipTrigger>
      <TooltipContent className="max-w-72">{description}</TooltipContent>
    </Tooltip>
  );
}
