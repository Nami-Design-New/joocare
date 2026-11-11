import { StarIcon } from 'lucide-react';

const OneSkillSection = ({ label }: { label: string }) => {
  return (
    <div className="flex items-center gap-2 rounded-full bg-accent p-2">
      <StarIcon size={16} className="fill-current text-primary" />
      <span className="text-xs font-semibold text-primary md:text-sm">
        {label}
      </span>
    </div>
  );
};

export default OneSkillSection;
