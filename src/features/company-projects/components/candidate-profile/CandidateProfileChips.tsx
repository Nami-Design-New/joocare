import type { CandidateProfileList } from '../../types/candidate-profile.types';

type CandidateProfileChipsProps = {
  items: CandidateProfileList;
};

export default function CandidateProfileChips({
  items,
}: CandidateProfileChipsProps) {
  if (typeof items === 'string' || !items.length) {
    return (
      <p className="text-sm text-muted-foreground">
        {typeof items === 'string' ? items : '-'}
      </p>
    );
  }

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
