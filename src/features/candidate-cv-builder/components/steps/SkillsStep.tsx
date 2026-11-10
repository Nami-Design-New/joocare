'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';
import { InputField } from '@/shared/components/InputField';
import { CV_BUILDER_ICONS, SKILLS_VISIBLE_COUNT } from '../../constants';
import { RECOMMENDED_SKILLS } from '../../constants/cv-builder-options';
import type { CvBuilderValues } from '../../types/cv-builder.types';
import CvAddButton from '../wizard/CvAddButton';
import CvStepCard from '../wizard/CvStepCard';

// Step 8: pick recommended skills or type new ones; selected skills show as removable chips.
export default function SkillsStep() {
  const t = useTranslations('candidatePage.buildCv.skills');
  const [input, setInput] = useState('');
  const [showAll, setShowAll] = useState(false);

  return (
    <CvStepCard title={t('title')} description={t('description')}>
      <Controller<CvBuilderValues, 'skills'>
        name="skills"
        render={({ field: { value: selected, onChange } }) => {
          const recommended = RECOMMENDED_SKILLS.filter(
            (skill) => !selected.includes(skill),
          );
          const visible = showAll
            ? recommended
            : recommended.slice(0, SKILLS_VISIBLE_COUNT);
          const addSkills = (skills: string[]) =>
            onChange([...new Set([...selected, ...skills])]);
          const addTyped = () => {
            addSkills(
              input
                .split(/[,،]/)
                .map((skill) => skill.trim())
                .filter(Boolean),
            );
            setInput('');
          };

          return (
            <>
              <section className="bg-muted rounded-xl p-3">
                <div className="bg-cv-builder-primary/2 flex flex-col items-start gap-4 rounded-2xl p-4">
                  <h3 className="text-foreground text-base leading-5">
                    {t('recommended')}
                  </h3>
                  <ul className="flex flex-wrap gap-3">
                    {visible.map((skill) => (
                      <li key={skill}>
                        <button
                          type="button"
                          onClick={() => addSkills([skill])}
                          aria-label={t('add-skill', { skill })}
                          className="border-border text-foreground hover:border-cv-builder-primary hover:text-cv-builder-primary h-9 rounded-2xl border px-4 text-base transition-colors"
                        >
                          {skill}
                        </button>
                      </li>
                    ))}
                    {recommended.length > SKILLS_VISIBLE_COUNT && (
                      <li>
                        <button
                          type="button"
                          onClick={() => setShowAll((value) => !value)}
                          aria-expanded={showAll}
                          className="bg-cv-builder-primary border-cv-builder-primary text-primary-foreground h-9 rounded-2xl border px-4 text-base"
                        >
                          {t(showAll ? 'show-less' : 'show-more')}
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              </section>

              <section className="bg-cv-builder-skill-surface flex flex-col gap-3 rounded-xl p-4">
                <h3 className="text-cv-builder-skill-text flex items-center gap-2 text-[15px] font-semibold">
                  {t('selected')}
                  <span className="bg-card text-cv-builder-primary flex size-6 items-center justify-center rounded-full text-[13px]">
                    {selected.length}
                  </span>
                </h3>
                {selected.length > 0 && (
                  <ul className="flex flex-wrap gap-2">
                    {selected.map((skill) => (
                      <li
                        key={skill}
                        className="border-cv-builder-skill-border bg-cv-builder-skill-surface text-cv-builder-skill-text flex h-10 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            onChange(selected.filter((item) => item !== skill))
                          }
                          aria-label={t('remove-skill', { skill })}
                          className="rounded-full"
                        >
                          <Image
                            src={CV_BUILDER_ICONS.circleX}
                            alt=""
                            width={24}
                            height={24}
                          />
                        </button>
                        <bdi>{skill}</bdi>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex items-center gap-2.5">
                  <InputField
                    id="skills-input"
                    aria-label={t('add-placeholder')}
                    placeholder={t('add-placeholder')}
                    value={input}
                    onChange={(event) => setInput(event.currentTarget.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        addTyped();
                      }
                    }}
                  />
                  <CvAddButton
                    variant="dark"
                    label={t('add')}
                    disabled={!input.trim()}
                    onClick={addTyped}
                  />
                </div>
              </section>
            </>
          );
        }}
      />
    </CvStepCard>
  );
}
