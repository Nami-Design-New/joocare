import type { Assessment, CategorySeed } from '../types/assessment.types';

export const CATEGORY_PREVIEW_SIZE = 3;
export const ASSESSMENT_PAGE_SIZE = 4;

const categoryNames = [
  'Language assessment',
  'Psychometric Assessment',
  'Clinical Assessment',
  'Leadership Assessment',
  'Patient Safety Assessment',
  'Technical Assessment',
];

// Preview fixtures until the assessments API contract is available.
export const categorySeeds: CategorySeed[] = categoryNames.flatMap(
  (name, index) => [
    {
      id: `joocare-${index}`,
      source: 'joocare',
      name,
      description: `${name} measures relevant professional knowledge, practical skills, and workplace capabilities.`,
      assessmentCount: 2,
    },
    {
      id: `company-${index}`,
      source: 'company',
      name,
      description: `${name} measures relevant professional knowledge, practical skills, and workplace capabilities.`,
      assessmentCount: index === 0 ? 18 : 6,
    },
  ],
);

const titles = [
  'Emergency Physician Assessment',
  'Triage Assessment',
  'Emergency Nursing Assessment',
  'Clinical Competency Assessment',
];

export const assessmentSeeds: Assessment[] = categorySeeds.flatMap((category) =>
  Array.from({ length: category.assessmentCount }, (_, index) => ({
    id: `${category.id}-${index + 1}`,
    categoryId: category.id,
    title: titles[index % titles.length],
    description:
      'Evaluate clinical knowledge, decision-making, and professional practice through a structured assessment.',
    createdAt: '2025-04-02T09:00:00Z',
    questionCount: 52,
    durationMinutes: 60,
    passScore: 70,
    associatedJobs: index % 4 === 2 ? 0 : 12,
    externalInvitations: index % 4 === 2 ? 0 : 8,
    pausedAt:
      category.source === 'company' && index % 4 === 0
        ? '2026-09-21T09:00:00Z'
        : null,
  })),
);
