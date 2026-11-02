'use client';

import { useMemo, useState } from 'react';
import { talentPreviewCandidates } from '../constants/talent-preview-data';
import { TALENT_PAGE_SIZE } from '../constants/talent-filters';
import { filterTalentCandidates } from '../utils/filter-candidates';
import type { TalentFilterValues } from '../types/talent-database.types';

export function useTalentDatabasePreview() {
  const [filters, setFilters] = useState<TalentFilterValues>({});
  const [showResults, setShowResults] = useState(false);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [messageOpen, setMessageOpen] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const filtered = useMemo(
    () => filterTalentCandidates(talentPreviewCandidates, filters, query),
    [filters, query],
  );
  const visible = filtered.slice(
    (page - 1) * TALENT_PAGE_SIZE,
    page * TALENT_PAGE_SIZE,
  );
  const selectedCandidates = filtered.filter((candidate) =>
    selectedIds.includes(candidate.id),
  );

  function toggleCandidate(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }
  function toggleAll() {
    const ids = visible.map((candidate) => candidate.id);
    setSelectedIds((current) =>
      ids.every((id) => current.includes(id))
        ? current.filter((id) => !ids.includes(id))
        : [...new Set([...current, ...ids])],
    );
  }
  function applyFilters(values: TalentFilterValues) {
    setFilters(values);
    setShowResults(true);
    setPage(1);
    setSelectedIds([]);
    setQuery('');
    setSearch('');
  }
  function applySearch() {
    setQuery(search);
    setPage(1);
    setSelectedIds([]);
  }
  function messageCandidate(id: string) {
    setSelectedIds([id]);
    setMessageOpen(true);
  }
  async function previewSendMessage() {
    // Preview only: replace this callback with an authorized API mutation when available.
    setSentCount(selectedCandidates.length);
    setMessageOpen(false);
    setSelectedIds([]);
  }
  return {
    filters,
    showResults,
    search,
    setSearch,
    applySearch,
    page,
    setPage,
    filtered,
    visible,
    selectedCandidates,
    selectedIds,
    toggleCandidate,
    toggleAll,
    applyFilters,
    messageOpen,
    setMessageOpen,
    sentCount,
    setSentCount,
    previewSendMessage,
    messageCandidate,
  };
}
