import Image from "next/image";
import React from "react";

type valueProps = {
  id: number | string;
  title: string;
};
type JobOverviewItemProps = {
  label: string;
  value: valueProps[] | string | undefined;
  icon?: string;
  emptyValueLabel?: string;
};

const JobOverviewItem: React.FC<JobOverviewItemProps> = ({
  label,
  value,
  icon,
  emptyValueLabel = "Not specified",
}) => {
  return (
    <div>
      <div className="flex items-start gap-2">
        {icon && <Image src={icon} width={20} height={20} alt="" />}
        <p className="text-muted-foreground text-sm md:text-base">{label}</p>
      </div>
      <div>
        {Array.isArray(value) ? (
          value.map((item) => (
            <p className="text-foreground font-semibold" key={item.id}>
              {item.title}
            </p>
          ))
        ) : value ? (
          <p className="text-foreground font-semibold text-base md:text-lg mt-2">{value}</p>
        ) : (
          <p className="text-foreground font-semibold text-base md:text-lg mt-2">{emptyValueLabel}</p>
        )}
      </div>
    </div>
  );
};

export default JobOverviewItem;
