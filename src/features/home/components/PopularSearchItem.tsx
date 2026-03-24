import React from "react";
import { Search } from "lucide-react";

interface PopularSearchItemProps {
  label: string;
  onClick?: () => void;
}

const PopularSearchItem = ({ label, onClick }: PopularSearchItemProps) => {
  return (
    <button
      onClick={onClick}
      className="border-border flex w-full items-center justify-center gap-2 rounded-full border bg-white px-3 py-2"
    >
      <Search className="h-6 w-6 text-[#0D0D0D73]" strokeWidth={1.5} />
      <p className="text-md text-primary font-normal">{label}</p>
    </button>
  );
};

export default PopularSearchItem;
