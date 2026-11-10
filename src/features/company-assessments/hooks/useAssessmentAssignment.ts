'use client';

import { useState } from 'react';
import { assignmentCandidates } from '../constants/assessment-invitations';

export function useAssessmentAssignment() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [emails, setEmails] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [assigned, setAssigned] = useState(false);

  const toggleCandidate = (id: string) =>
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  const reset = () => {
    setSelectedIds([]);
    setEmails([]);
    setPickerOpen(false);
    setEmailOpen(false);
    setAssigned(false);
  };

  return {
    selectedIds,
    emails,
    pickerOpen,
    emailOpen,
    assigned,
    setPickerOpen,
    setEmailOpen,
    setAssigned,
    selectedCandidates: assignmentCandidates.filter((candidate) =>
      selectedIds.includes(candidate.id),
    ),
    totalRecipients: selectedIds.length + emails.length,
    toggleCandidate,
    reset,
    addEmail: (email: string) => {
      setEmails((current) =>
        current.includes(email) ? current : [...current, email],
      );
      setEmailOpen(false);
    },
    removeEmail: (email: string) =>
      setEmails((current) => current.filter((item) => item !== email)),
  };
}
