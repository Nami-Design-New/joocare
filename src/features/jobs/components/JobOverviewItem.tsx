import Image from "next/image";
import React from "react";

type JobOverviewItemProps = {
  label: string;
  value: string;
  icon?: string;
};

const JobOverviewItem: React.FC<JobOverviewItemProps> = ({
  label,
  value,
  icon,
}) => {
  return (
    <div>
      <div className="flex items-center gap-2">
        {icon && <Image src={icon} width={20} height={20} alt="icon"></Image>}
        <p className="text-muted-foreground text-md">{label}</p>
      </div>
      <div>
        <p className="text-foreground font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default JobOverviewItem;
