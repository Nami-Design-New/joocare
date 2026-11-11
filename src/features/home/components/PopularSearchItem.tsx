import React from 'react';
import { Search } from 'lucide-react';

interface PopularSearchItemProps {
  label: string;
  onClick?: () => void;
}

const PopularSearchItem = ({ label, onClick }: PopularSearchItemProps) => {
  return (
    <button
      onClick={onClick}
      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-white px-3 py-2"
    >
      <Search
        className="h-4 w-4 text-[#0D0D0D73] md:h-6 md:w-6"
        strokeWidth={1.5}
      />
      <p className="text-xs font-normal text-primary md:text-base">{label}</p>
    </button>
  );
};

export default PopularSearchItem;
