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
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 md:hidden ${open ? "visible opacity-100" : "invisible opacity-0"} `}
      />

      {/* sidebar */}
      <div
        className={`fixed top-21.75 left-0 z-40 h-[calc(100vh-87px)] w-[300px] transition-transform duration-300 md:sticky ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <CompanySidebarContent />
      </div>

      {/* toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed top-24 z-50 rounded-full bg-white p-2 shadow-md transition-all duration-300 ${open ? "left-[310px]" : "left-4"} md:hidden`}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
    </>
  );
};

export default CompanySidebarClient;
