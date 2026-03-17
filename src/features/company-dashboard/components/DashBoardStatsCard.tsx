export type statCardBadge = {
  label: string;
};
export type addStatValue = {
  label: string;
  value: string;
};

export type dashboardStatCardType = {
  /** Card title shown at the top */
  title: string;

  /** Primary numeric / text value  e.g. "327" or "+12" */
  primaryValue: string;

  /** Supporting description shown below the primary value */
  description: string;

  /** Optional SVG icon component rendered on the right side */
  icon?: React.ReactNode;

  /** Optional inline badge next to the primary value (e.g. "+12 this week") */
  badge?: statCardBadge;

  addState?: addStatValue;

  /** Extra Tailwind classes forwarded to the root element */
  className?: string;
};

export default function DashBoardStatsCard({
  title,
  primaryValue,
  description,
  icon,
  badge,
  addState,
  className = "",
}: dashboardStatCardType) {
  return (
    <section
      className={`flex h-full items-center gap-4 rounded-xl bg-white p-6 ${className}`}
    >
      <div className="flex grow flex-col gap-4">
        <h5 className="text-md text-secondary font-semibold">{title}</h5>
        <div className="flex items-center justify-between gap-2">
          <p>
            <span className="text-primary text-3xl font-extrabold">
              {primaryValue}{" "}
            </span>
            {badge && (
              <span className="text-md text-muted-foreground font-normal">
                {badge.label}
              </span>
            )}
          </p>
          {addState && (
            <p className="">
              <span className="text-secondary text-xl font-semibold">
                {addState.value}
              </span>{" "}
              <span className="text-muted-foreground">
                {addState.label}
              </span>{" "}
            </p>
          )}
        </div>
        <p className="text-muted-foreground text-md">{description}</p>
      </div>
      {icon}
    </section>
  );
}
