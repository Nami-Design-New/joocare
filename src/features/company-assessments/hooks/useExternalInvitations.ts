'use client';

import { useState } from 'react';
import { externalInvitationSeeds } from '../constants/assessment-invitations';

export function useExternalInvitations() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [project, setProject] = useState('all');
  const [minScore, setMinScore] = useState('');
  const [maxScore, setMaxScore] = useState('');
  const [page, setPage] = useState(1);
  const [assignOpen, setAssignOpen] = useState(false);
  const rows = externalInvitationSeeds.filter((candidate) => {
    const matchesSearch = `${candidate.name} ${candidate.email}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return (
      matchesSearch &&
      (status === 'all' || status === candidate.status) &&
      (project === 'all' || candidate.project === project) &&
      (!minScore ||
        (candidate.score !== null && candidate.score >= Number(minScore))) &&
      (!maxScore ||
        (candidate.score !== null && candidate.score <= Number(maxScore)))
    );
  });
  const hasFilters = Boolean(
    search || status !== 'all' || project !== 'all' || minScore || maxScore,
  );
  return {
    search,
    setSearch,
    status,
    setStatus,
    project,
    setProject,
    minScore,
    setMinScore,
    maxScore,
    setMaxScore,
    page,
    setPage,
    assignOpen,
    setAssignOpen,
    rows,
    hasFilters,
  };
}
