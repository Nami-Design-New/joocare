import CvBuilderWizard from '@/features/candidate-cv-builder/components/wizard/CvBuilderWizard';
import { CV_BUILDER_MODES } from '@/features/candidate-cv-builder/constants';

type PageProps = {
  searchParams: Promise<{ mode?: string }>;
};

// `?mode=draft` continues the draft, `?mode=edit` edits the finished CV (design only).
export default async function Page({ searchParams }: PageProps) {
  const { mode } = await searchParams;
  const view = CV_BUILDER_MODES.find((item) => item === mode) ?? 'new';

  return <CvBuilderWizard key={view} mode={view} />;
}
