import { ReactNode } from "react";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";

type LabelCheckboxProps = {
  id: string;
  children: ReactNode;
};

const LabelCheckbox = ({ id, children }: LabelCheckboxProps) => {
  return (
    <section className="flex gap-2 items-center">
      <Checkbox id={id} name={id} />
      <Label htmlFor={id}>
        {children}
      </Label>
    </section>
  );
};

export default LabelCheckbox;