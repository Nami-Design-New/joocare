'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Card } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import CvFileModal from '@/shared/components/modals/CvFileModal';
import SuccessModal from '@/shared/components/modals/SuccessModal';
import { useAssessmentResults } from '../../hooks/useAssessmentResults';
import CandidatePreviewDialog from '../shared/CandidatePreviewDialog';
import AssessmentResultsList from './AssessmentResultsList';
import AssessmentResultsSelectors from './AssessmentResultsSelectors';
import CandidateLinkDialog from './CandidateLinkDialog';

type AssessmentResultsPageProps = { initialAssessmentId?: string };

export default function AssessmentResultsPage({
  initialAssessmentId,
}: AssessmentResultsPageProps) {
  const t = useTranslations('companyPage.assessments.results');
  const results = useAssessmentResults(initialAssessmentId);

  return (
    <div className="mx-auto flex w-full flex-col gap-8 lg:pt-3">
      <header className="space-y-1">
        <h1 className="text-2xl leading-normal font-bold text-assessment-dark sm:text-[28px]">
          {t('title')}
        </h1>
        <p className="text-sm leading-5 text-muted-foreground">
          {t('description')}
        </p>
      </header>

      <AssessmentResultsSelectors
        categoryId={results.categoryId}
        categoryOptions={results.categoryOptions}
        categories={results.categories}
        onCategoryChange={results.setCategoryId}
        onCategorySearch={results.setCategorySearch}
        assessmentId={results.assessmentId}
        assessmentOptions={results.assessmentOptions}
        assessments={results.assessments}
        onAssessmentChange={results.setAssessmentId}
      />

      {results.isLoadingInitialAssessment ? (
        <Skeleton aria-busy="true" className="min-h-80 rounded-2xl" />
      ) : !results.hasSelection ? (
        <Card className="min-h-80 items-center justify-center gap-3 rounded-2xl border-0 px-6 py-10 text-center shadow-none sm:min-h-90">
          <span className="flex size-14 items-center justify-center rounded-full bg-assessment-info">
            <Search
              aria-hidden="true"
              className="size-7 text-assessment-primary"
            />
          </span>
          <h2 className="text-base leading-6 font-semibold text-assessment-heading">
            {t('empty-title')}
          </h2>
          <p className="max-w-130 text-xs leading-5 text-assessment-muted">
            {t('empty-description')}
          </p>
        </Card>
      ) : (
        <AssessmentResultsList results={results} />
      )}

      <CandidateLinkDialog
        kind={results.linkKind}
        candidate={results.linkCandidate}
        search={results.linkSearch}
        onSearchChange={results.setLinkSearch}
        targets={results.linkTargets}
        selectedTargetId={results.selectedTargetId}
        onTargetSelect={results.setSelectedTargetId}
        onOpenChange={(open) => {
          if (!open) results.closeLinkDialog();
        }}
        onConfirm={results.confirmLink}
      />
      <SuccessModal
        open={results.successKind !== null}
        title={
          results.successKind === 'job'
            ? t('candidate-linked-to-job')
            : t('candidate-linked-to-project')
        }
        description={t('link-success-description')}
        onOpenChange={(open) => {
          if (!open) results.closeSuccessDialog();
        }}
      />

      <CvFileModal
        open={results.cvCandidate !== null}
        onOpenChange={(open) => {
          if (!open) results.setCvCandidate(null);
        }}
        title={t('cv-title', { name: results.cvCandidate?.name ?? '' })}
        pdfUrl={results.cvCandidate?.cv}
      />

      <CandidatePreviewDialog
        candidate={results.inspectedCandidate}
        onOpenChange={(open) => {
          if (!open) results.setInspectedCandidate(null);
        }}
      />
    </div>
  );
}
