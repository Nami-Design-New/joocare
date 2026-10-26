import type { ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

type CountPageHeaderProps = {
  count: number;
  title: ReactNode;
  action?: {
    label: ReactNode;
    onClick: () => void;
    icon?: ReactNode;
  };
  className?: string;
};

export default function CountPageHeader({
  count,
  title,
  action,
  className,
}: CountPageHeaderProps) {
  return (
    <header className={cn("flex w-full items-center justify-between gap-4", className)}>
      <h1 className="flex items-center gap-2 leading-[1.2]">
        <span className="text-[38px] font-bold text-secondary">{count}</span>
        <span className="text-[28px] font-semibold tracking-[-0.28px] text-muted-foreground">
          {title}
        </span>
      </h1>
      {action ? (
        <Button
          type="button"
          onClick={action.onClick}
          className="h-9 rounded-full px-5 text-xs"
        >
          {action.icon}
          {action.label}
        </Button>
      ) : null}
    </header>
  );
}
