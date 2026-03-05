import { ReactNode } from "react";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { cn } from "../lib/utils";

type LabelCheckboxProps = {
  id: string;
  children: ReactNode;
  className?: string;
  error?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

const LabelCheckbox = ({
  id,
  children,
  error,
  className,
  checked,
  onCheckedChange,
}: LabelCheckboxProps) => {
  return (
    <section className={cn("flex flex-col gap-2", className)}>
      <div className="flex gap-2">
        <Checkbox
          id={id}
          name={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
        <Label className={"flex flex-wrap font-normal"} htmlFor={id}>
          {children}
        </Label>
      </div>
      {error && <span className="text-red-500 text-[12px] mt-1">{error}</span>}
    </section>
  );
};

export default LabelCheckbox;
