import Image from 'next/image';
import React from 'react';

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
  emptyValueLabel = 'Not specified',
}) => {
  return (
    <div>
      <div className="flex items-start gap-2">
        {icon && <Image src={icon} width={20} height={20} alt="" />}
        <p className="text-sm text-muted-foreground max-md:text-xs max-md:leading-4 md:text-base">
          {label}
        </p>
      </div>
      <div>
        {Array.isArray(value) ? (
          value.map((item) => (
            <p
              className="font-semibold text-foreground max-md:text-sm max-md:leading-5"
              key={item.id}
            >
              {item.title}
            </p>
          ))
        ) : value ? (
          <p className="mt-2 text-base font-semibold text-foreground max-md:text-sm max-md:leading-5 md:text-lg">
            {value}
          </p>
        ) : (
          <p className="mt-2 text-base font-semibold text-foreground max-md:text-sm max-md:leading-5 md:text-lg">
            {emptyValueLabel}
          </p>
        )}
      </div>
    </div>
  );
};

export default JobOverviewItem;
