import React from "react";
import { Search } from "lucide-react";

const PopularSearchItem = ({ label }: { label: string }) => {
  return (
    <div className="flex items-center bg-white border-border border   justify-center gap-2  py-2 px-3 rounded-full w-full">
      <Search className="w-6 h-6  text-[#0D0D0D73]" strokeWidth={1.5} />
      <p className="text-md text-primary  font-normal ">{label} </p>
    </div>
  );
};

export default PopularSearchItem;
