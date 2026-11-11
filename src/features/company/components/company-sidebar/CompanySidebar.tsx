'use client';

import CompanySidebarContent from './CompanySidebarContent';

const CompanySidebarClient = () => {
  return (
    <>
      {/* sidebar */}
      <div
        className={`left-0 transition-transform duration-300 lg:sticky lg:top-19 lg:z-10 lg:h-[calc(100vh-76px)]`}
      >
        <CompanySidebarContent />
      </div>
    </>
  );
};

export default CompanySidebarClient;
