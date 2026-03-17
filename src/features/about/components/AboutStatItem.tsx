type AboutStatItemProps = {
  value: string;
  label: string;
};

export default function AboutStatItem({ value, label }: AboutStatItemProps) {
  const hasPlus = value.startsWith("+");
  const hasPercent = value.endsWith("%");
  const normalizedValue = value.replace("+", "").replace("%", "");

  return (
    <div className="px-2">
      <h4 className="text-2xl font-bold sm:text-4xl">
        {hasPlus && <span className="text-primary">+</span>}
        <span className="text-foreground">{normalizedValue}</span>
        {hasPercent && <span className="text-primary">%</span>}
      </h4>
      <p className="mt-2 text-xs leading-relaxed text-gray-500 sm:text-sm">
        {label}
      </p>
    </div>
  );
}
