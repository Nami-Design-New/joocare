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
          className="bg-accent text-primary rounded-2xl px-2.5 py-1.5 text-sm font-semibold"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
