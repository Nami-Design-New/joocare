"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import CompanySidebarContent from "./CompanySidebarContent";

const CompanySidebarClient = () => {
  const [open, setOpen] = useState(false);

  // return setOpen state to false when screen be small in any time
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");

    const handleResize = () => {
      if (!media.matches) setOpen(false);
    };

    handleResize();
    media.addEventListener("change", handleResize);
    return () => media.removeEventListener("change", handleResize);
  }, []);

  return (
    <>
      {/* overlay mobile */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/40 md:hidden transition-opacity duration-300
          ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />

      {/* sidebar */}
      <div
        className={`fixed md:sticky top-[87px] left-0 z-40
          w-[300px] h-[calc(100vh-87px)]
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <CompanySidebarContent />
      </div>

      {/* toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed top-24 z-50 bg-white shadow-md rounded-full p-2 transition-all duration-300
          ${open ? "left-[310px]" : "left-4"} md:hidden`}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
    </>
  );
};

export default CompanySidebarClient;