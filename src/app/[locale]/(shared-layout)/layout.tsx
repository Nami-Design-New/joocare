import Footer from '@/shared/components/Footer';
import Header from '@/shared/components/header/Header';
import React from 'react';
import CandidateAssessmentSiteLayout from '@/features/candidate-assessment/components/CandidateAssessmentSiteLayout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CandidateAssessmentSiteLayout header={<Header />} footer={<Footer />}>
      {children}
    </CandidateAssessmentSiteLayout>
  );
}
