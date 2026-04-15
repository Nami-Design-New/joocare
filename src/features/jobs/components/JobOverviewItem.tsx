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
        {Array.isArray(value) ? (
          value.map((item) => (
            <p className="text-foreground font-semibold" key={item.id}>
              {item.title}
            </p>
          ))
        ) : value ? (
          <p className="text-foreground font-semibold">{value}</p>
        ) : (
          <p className="text-foreground font-semibold">Not specified</p>
        )}
      </div>
    </div>
  );
};

export default JobOverviewItem;
