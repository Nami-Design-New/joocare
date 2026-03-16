type QA = { q: string; a: string };


export function AccordionItem({
  item,
  index,
  openIndex,
  setOpenIndex,
}: {
  item: QA;
  index: number;
  openIndex: number | null;
  setOpenIndex: (i: number | null) => void;
}) {
  const isOpen = openIndex === index;

  return (
    <div className="overflow-hidden rounded-xl">
      <div className={`rounded-xl border border-gray-100 bg-gray-50 shadow-sm`}>
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => setOpenIndex(isOpen ? null : index)}
          className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-gray-50"
        >
          <span className="text-base font-medium text-secondary">{item.q}</span>

          <span className="ml-4">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
              {isOpen ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M6 12h12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M12 6v12M6 12h12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
          </span>
        </button>

        {isOpen && (
          <div className="border-t border-gray-100 px-6 pb-5 text-sm text-gray-600">
            {item.a}
          </div>
        )}
      </div>
    </div>
  );
}
