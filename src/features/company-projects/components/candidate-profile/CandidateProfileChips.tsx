type CandidateProfileChipsProps = {
  items: string[];
};

export default function CandidateProfileChips({
  items,
}: CandidateProfileChipsProps) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-2xl bg-accent px-2.5 py-1.5 text-sm font-semibold text-primary"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
