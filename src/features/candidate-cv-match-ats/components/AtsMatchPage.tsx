'use client';

import { ATS_PREVIEW_RESULT } from '../constants/cv-match-ats-preview-data';
import { useAtsMatch } from '../hooks/useAtsMatch';
import type { AtsMatchView } from '../types/cv-match-ats.types';
import AtsAnalyzing from './AtsAnalyzing';
import AtsComingSoonModal from './coming-soon/AtsComingSoonModal';
import AtsIntroCard from './intro/AtsIntroCard';
import AtsResultCard from './results/AtsResultCard';
import OptimizationPoints from './results/OptimizationPoints';

type AtsMatchPageProps = {
  initialView: AtsMatchView;
  /** File name of the candidate's profile CV (empty when there is none). */
  profileCvName: string;
};

// "CV match with ATS": intro → analyzing → results (design only, mock analysis).
export default function AtsMatchPage({
  initialView,
  profileCvName,
}: AtsMatchPageProps) {
  const ats = useAtsMatch(initialView);
  const result = {
    ...ATS_PREVIEW_RESULT,
    fileName: profileCvName || ATS_PREVIEW_RESULT.fileName,
  };

  return (
    <>
      {ats.step === 'intro' && <AtsIntroCard onAnalyze={ats.startAnalysis} />}
      {ats.step === 'analyzing' && <AtsAnalyzing />}
      {ats.step === 'results' && (
        <div className="flex flex-col gap-6">
          <AtsResultCard fileName={result.fileName} score={result.score} />
          <OptimizationPoints points={result.points} />
        </div>
      )}
      <AtsComingSoonModal
        open={ats.comingSoonOpen}
        onOpenChange={ats.setComingSoonOpen}
      />
    </>
  );
}
