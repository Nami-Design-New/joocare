'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';
import { Input } from '@/shared/components/ui/input';
import { CV_BUILDER_ICONS, SKILLS_VISIBLE_COUNT } from '../../constants';
import { useGetSuggestedCvSkills } from '../../hooks/useGetSuggestedCvSkills';
import type { CvBuilderValues } from '../../types/cv-builder.types';
import CvAddButton from '../wizard/CvAddButton';
import CvStepCard from '../wizard/CvStepCard';

// Step 8: pick suggested skills or add another; selected skills show as chips.
export default function SkillsStep() {
  const t = useTranslations('candidatePage.buildCv.skills');
  const [showAll, setShowAll] = useState(false);
  const [customSkill, setCustomSkill] = useState('');
  const suggestions = useGetSuggestedCvSkills();
  const skillOptions = suggestions.data ?? [];

  return (
    <CvStepCard title={t('title')} description={t('description')}>
      <Controller<CvBuilderValues, 'skills'>
        name="skills"
        render={({ field: { value: selected, onChange } }) => {
          const selectedIds = selected.map((skill) => skill.id);
          const recommended = skillOptions.filter(
            (skill) => !selectedIds.includes(skill.id),
          );
          const visible = showAll
            ? recommended
            : recommended.slice(0, SKILLS_VISIBLE_COUNT);
          const addSkill = (skill: { id: string; label: string }) => {
            if (selectedIds.includes(skill.id)) return;
            onChange([...selected, skill]);
          };
          const addCustomSkill = () => {
            const label = customSkill.trim();
            if (!label) return;

            setCustomSkill('');

            const alreadySelected = selected.some(
              (skill) => skill.label.trim().toLowerCase() === label.toLowerCase(),
            );
            if (alreadySelected) return;

            // Custom skills have no lookup id, so they are sent by title.
            onChange([
              ...selected,
              { id: `custom-${label}`, label, isCustom: true },
            ]);
          };

          return (
            <>
              <section className="rounded-xl bg-muted p-3">
                <div className="flex flex-col items-start gap-4 rounded-2xl bg-cv-builder-primary/2 p-4">
                  <h3 className="text-base leading-5 text-foreground">
                    {t('recommended')}
                  </h3>
                  <ul className="flex flex-wrap gap-3">
                    {suggestions.isLoading && (
                      <li className="text-sm text-muted-foreground">
                        {t('suggestions-loading')}
                      </li>
                    )}
                    {suggestions.isError && (
                      <li className="flex items-center gap-3 text-sm text-destructive">
                        {t('suggestions-error')}
                        <button
                          type="button"
                          onClick={() => void suggestions.refetch()}
                          className="font-semibold underline"
                        >
                          {t('retry')}
                        </button>
                      </li>
                    )}
                    {suggestions.isSuccess && recommended.length === 0 && (
                      <li className="text-sm text-muted-foreground">
                        {t('suggestions-empty')}
                      </li>
                    )}
                    {visible.map((skill) => (
                      <li key={skill.id}>
                        <button
                          type="button"
                          onClick={() => addSkill(skill)}
                          aria-label={t('add-skill', { skill: skill.label })}
                          className="h-9 rounded-2xl border border-border px-4 text-base text-foreground transition-colors hover:border-cv-builder-primary hover:text-cv-builder-primary"
                        >
                          {skill.label}
                        </button>
                      </li>
                    ))}
                    {recommended.length > SKILLS_VISIBLE_COUNT && (
                      <li>
                        <button
                          type="button"
                          onClick={() => setShowAll((value) => !value)}
                          aria-expanded={showAll}
                          className="h-9 rounded-2xl border border-cv-builder-primary bg-cv-builder-primary px-4 text-base text-primary-foreground"
                        >
                          {t(showAll ? 'show-less' : 'show-more')}
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              </section>

              <section className="flex flex-col gap-3 rounded-xl bg-cv-builder-skill-surface p-4">
                <h3 className="flex items-center gap-2 text-[15px] font-semibold text-cv-builder-skill-text">
                  {t('selected')}
                  <span className="flex size-6 items-center justify-center rounded-full bg-card text-[13px] text-cv-builder-primary">
                    {selected.length}
                  </span>
                </h3>
                {selected.length > 0 && (
                  <ul className="flex flex-wrap gap-2">
                    {selected.map((skill) => (
                      <li
                        key={skill.id}
                        className="flex h-10 items-center gap-1.5 rounded-full border border-cv-builder-skill-border bg-cv-builder-skill-surface px-3.5 text-sm font-medium text-cv-builder-skill-text"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            onChange(
                              selected.filter((item) => item.id !== skill.id),
                            )
                          }
                          aria-label={t('remove-skill', {
                            skill: skill.label,
                          })}
                          className="rounded-full"
                        >
                          <Image
                            src={CV_BUILDER_ICONS.circleX}
                            alt=""
                            width={24}
                            height={24}
                          />
                        </button>
                        <bdi>{skill.label}</bdi>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex items-center gap-3">
                  <Input
                    value={customSkill}
                    onChange={(event) => setCustomSkill(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key !== 'Enter') return;
                      event.preventDefault();
                      addCustomSkill();
                    }}
                    placeholder={t('add-placeholder')}
                    aria-label={t('add-placeholder')}
                    className="bg-card"
                  />
                  <CvAddButton
                    variant="dark"
                    label={t('add')}
                    onClick={addCustomSkill}
                    disabled={!customSkill.trim()}
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
