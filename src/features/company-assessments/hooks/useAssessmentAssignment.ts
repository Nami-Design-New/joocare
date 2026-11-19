'use client';

import { useState } from 'react';
import type { AssignmentCandidate } from '../types/assessment-invitation.types';
import { useAssignAssessment } from './useAssignAssessment';

export function useAssessmentAssignment(assessmentId: string) {
  const [selectedCandidates, setSelectedCandidates] = useState<
    AssignmentCandidate[]
  >([]);
  const [emails, setEmails] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [assigned, setAssigned] = useState(false);
  const mutation = useAssignAssessment(() => setAssigned(true));
  const selectedIds = selectedCandidates.map((candidate) => candidate.id);

  const toggleCandidate = (candidate: AssignmentCandidate) =>
    setSelectedCandidates((current) =>
      current.some((item) => item.id === candidate.id)
        ? current.filter((item) => item.id !== candidate.id)
        : [...current, candidate],
    );
  const reset = () => {
    setSelectedCandidates([]);
    setEmails([]);
    setPickerOpen(false);
    setEmailOpen(false);
    setAssigned(false);
    mutation.reset();
  };

  return {
    selectedIds,
    emails,
    pickerOpen,
    emailOpen,
    assigned,
    setPickerOpen,
    setEmailOpen,
    selectedCandidates,
    isPending: mutation.isPending,
    assign: () =>
      mutation.assign({ assessmentId, userIds: selectedIds, emails }),
    totalRecipients: selectedIds.length + emails.length,
    toggleCandidate,
    reset,
    addEmail: (email: string) => {
      const normalizedEmail = email.trim().toLowerCase();
      setEmails((current) =>
        current.includes(normalizedEmail)
          ? current
          : [...current, normalizedEmail],
      );
      setEmailOpen(false);
    },
    removeEmail: (email: string) =>
      setEmails((current) => current.filter((item) => item !== email)),
  };
}
