import CvBuilderPage from '@/features/candidate-cv-builder/components/landing/CvBuilderPage';
import { CV_BUILDER_STATES } from '@/features/candidate-cv-builder/constants';

type PageProps = {
  searchParams: Promise<{ state?: string }>;
};

// `?state=exists` / `?state=draft` show the other landing states (design only).
export default async function Page({ searchParams }: PageProps) {
  const { state } = await searchParams;
  const view = CV_BUILDER_STATES.find((item) => item === state) ?? 'intro';

  return <CvBuilderPage key={view} initialState={view} />;
}
