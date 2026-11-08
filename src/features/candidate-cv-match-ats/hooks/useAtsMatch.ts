'use client';

import { useEffect, useRef, useState } from 'react';
import { ATS_ANALYZING_DURATION_MS, CV_MATCH_ATS_MODE } from '../constants';
import type { AtsMatchStep, AtsMatchView } from '../types/cv-match-ats.types';

// Page-only state of CV match with ATS: the current step, the mock analysis and the Coming Soon modal.
export function useAtsMatch(initialView: AtsMatchView) {
  const [step, setStep] = useState<AtsMatchStep>(
    initialView === 'coming-soon' ? 'intro' : initialView,
  );
  const [comingSoonOpen, setComingSoonOpen] = useState(
    initialView === 'coming-soon',
  );
  const analysisTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(analysisTimer.current), []);

  const startAnalysis = () => {
    if (CV_MATCH_ATS_MODE === 'coming-soon') {
      setComingSoonOpen(true);
      return;
    }

    // Design only: no API yet, so the results show after a short delay.
    setStep('analyzing');
    analysisTimer.current = setTimeout(
      () => setStep('results'),
      ATS_ANALYZING_DURATION_MS,
    );
  };

  return { step, startAnalysis, comingSoonOpen, setComingSoonOpen };
}
