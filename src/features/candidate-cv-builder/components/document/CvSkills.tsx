import { Stethoscope } from 'lucide-react';
import CvSectionTitle from './CvSectionTitle';

type CvSkillsProps = {
  title: string;
  skills: string[];
};

export default function CvSkills({ title, skills }: CvSkillsProps) {
  return (
    <section className="flex flex-col gap-4 px-2">
      <CvSectionTitle icon={Stethoscope} title={title} size="lg" />
      <ul className="flex flex-wrap gap-2.5">
        {skills.map((skill) => (
          <li
            key={skill}
            className="bg-muted text-secondary rounded-md px-3.5 py-2 text-sm"
          >
            {skill}
          </li>
        ))}
      </ul>
    </section>
  );
}
