type Feature = { title: string; desc: string };

export function FeatureItem({ title, desc }: Feature) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full">
          <img src="/assets/employers/award.svg" alt="award" />
        </div>

        <div className="min-w-0">
          <h3 className="text-base font-semibold text-secondary md:text-lg">
            {title}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-pretty text-gray-600 md:text-sm">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}
