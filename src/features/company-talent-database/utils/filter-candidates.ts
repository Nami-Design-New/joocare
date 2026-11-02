import type {
  TalentCandidate,
  TalentFilterValues,
} from '../types/talent-database.types';

export function filterTalentCandidates(
  candidates: TalentCandidate[],
  filters: TalentFilterValues,
  search: string,
) {
  const query = search.trim().toLowerCase();
  return candidates.filter((candidate) => {
    if (
      query &&
      !`${candidate.name} ${candidate.email}`.toLowerCase().includes(query)
    )
      return false;
    for (const index of [1, 2, 3]) {
      const language = filters[`language-${index}`];
      const proficiency = filters[`proficiency-${index}`];
      if (!language?.length && !proficiency?.length) continue;
      const matchesLanguage = [1, 2, 3].some(
        (slot) =>
          (!language?.length ||
            candidate.attributes[`language-${slot}`] === language) &&
          (!proficiency?.length ||
            candidate.attributes[`proficiency-${slot}`] === proficiency),
      );
      if (!matchesLanguage) return false;
    }
    return Object.entries(filters).every(([key, value]) => {
      if (
        !value?.length ||
        key.startsWith('language-') ||
        key.startsWith('proficiency-')
      )
        return true;
      const actual = candidate.attributes[key];
      if (actual === undefined) return false;
      if (key.endsWith('-min') || key.endsWith('-max')) {
        const amount = Number(actual);
        return key.endsWith('-min')
          ? amount >= Number(value)
          : amount <= Number(value);
      }
      const attributes = (Array.isArray(actual) ? actual : [actual]).map(
        (item) => item.toLowerCase(),
      );
      return (Array.isArray(value) ? value : [value]).some((item) =>
        attributes.some((attribute) =>
          [
            'specialty',
            'subspecialty',
            'employer',
            'previous-employer',
            'keywords',
          ].includes(key)
            ? attribute.includes(item.toLowerCase().trim())
            : attribute === item.toLowerCase().trim(),
        ),
      );
    });
  });
}
