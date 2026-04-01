"use client";

import CompanySidebarContent from "./CompanySidebarContent";

const CompanySidebarClient = () => {


  return (
    <>
      {/* sidebar */}
      <div
        className={`sticky top-21.75 left-0 z-40 lg:h-[calc(100vh-87px)] transition-transform duration-300 `}

      >
        <CompanySidebarContent />
      </div >


    </>
  );
};

export default CompanySidebarClient;
