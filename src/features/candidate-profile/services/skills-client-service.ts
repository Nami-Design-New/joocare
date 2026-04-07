import { apiFetch } from "@/shared/lib/fetch-manager";

export type SkillOption = {
  id: string;
  label: string;
};

export type UserSkillRecord = {
  id: string;
  skillId: string;
  label: string;
};

function getUserBaseUrl() {
  if (!process.env.NEXT_PUBLIC_BASE_USER_URL) {
    throw new Error("User API endpoint is not configured.");
  }

  return process.env.NEXT_PUBLIC_BASE_USER_URL;
}

function parseSkillOption(entry: unknown): SkillOption | null {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const record = entry as Record<string, unknown>;
  const nestedSkill =
    record.skill && typeof record.skill === "object"
      ? (record.skill as Record<string, unknown>)
      : null;
  const id = nestedSkill?.id ?? record.skill_id ?? record.id;
  const label =
    nestedSkill?.name ??
    nestedSkill?.title ??
    record.name ??
    record.title ??
    record.label ??
    record.value;

  if ((typeof id === "number" || typeof id === "string") && typeof label === "string") {
    return {
      id: String(id),
      label,
    };
  }

  return null;
}

function findSkillCollections(data: unknown, keyHint = ""): unknown[][] {
  if (!data || typeof data !== "object") {
    return [];
  }

  const record = data as Record<string, unknown>;
  const matches: unknown[][] = [];

  for (const [key, value] of Object.entries(record)) {
    const normalizedKey = key.toLowerCase();

    if (Array.isArray(value)) {
      if (normalizedKey.includes("skill") || keyHint.includes("skill")) {
        matches.push(value);
      }

      for (const item of value) {
        matches.push(...findSkillCollections(item, normalizedKey));
      }
      continue;
    }

    if (value && typeof value === "object") {
      matches.push(...findSkillCollections(value, normalizedKey));
    }
  }

  return matches;
}

function getBestSkillCollection(data: unknown): unknown[] {
  const collections = findSkillCollections(data);
  const parsedCollections = collections
    .map((collection) => collection.map(parseSkillOption).filter((skill): skill is SkillOption => Boolean(skill)))
    .filter((collection) => collection.length > 0);

  if (parsedCollections.length === 0) {
    return [];
  }

  parsedCollections.sort((a, b) => b.length - a.length);
  return parsedCollections[0];
}

export async function getSkillOptions({
  locale = "en",
  token,
}: {
  locale?: string;
  token: string;
}) {
  const { ok, data, message } = await apiFetch(
    `${getUserBaseUrl()}/auth/update-profile/form-data`,
    {
      method: "GET",
      locale,
      token,
    },
  );

  if (!ok) {
    throw new Error(message || "Failed to load skills.");
  }

  const parsedOptions = getBestSkillCollection(data) as SkillOption[];

  if (parsedOptions.length > 0) {
    return parsedOptions;
  }

  const currentSkills = await getUserSkills({ locale, token });
  return currentSkills.map((skill) => ({
    id: skill.skillId,
    label: skill.label,
  }));
}

export async function getUserSkills({
  locale = "en",
  token,
}: {
  locale?: string;
  token: string;
}) {
  const { ok, data, message } = await apiFetch(
    `${getUserBaseUrl()}/user-skills?pagination=on&limit_per_page=100&page=1`,
    {
      method: "GET",
      locale,
      token,
    },
  );

  if (!ok) {
    throw new Error(message || "Failed to load current skills.");
  }

  const items = Array.isArray(data?.data)
    ? data.data
    : data?.data && typeof data.data === "object" && Array.isArray((data.data as { data?: unknown[] }).data)
      ? (data.data as { data: unknown[] }).data
      : [];

  return items
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;
      const nestedSkill =
        record.skill && typeof record.skill === "object"
          ? (record.skill as Record<string, unknown>)
          : null;
      const itemId = record.id;
      const skillId = nestedSkill?.id ?? record.skill_id ?? record.id;
      const label =
        nestedSkill?.name ??
        nestedSkill?.title ??
        record.name ??
        record.title ??
        record.label;

      if (
        (typeof itemId === "number" || typeof itemId === "string") &&
        (typeof skillId === "number" || typeof skillId === "string") &&
        typeof label === "string"
      ) {
        return {
          id: String(itemId),
          skillId: String(skillId),
          label,
        } satisfies UserSkillRecord;
      }

      return null;
    })
    .filter((item): item is UserSkillRecord => Boolean(item));
}

export async function addUserSkills({
  skillIds,
  locale = "en",
  token,
}: {
  skillIds: string[];
  locale?: string;
  token: string;
}) {
  if (skillIds.length === 0) {
    return null;
  }

  const formData = new FormData();
  skillIds.forEach((id) => {
    formData.append("skills[]", id);
  });

  const { ok, data, message } = await apiFetch(`${getUserBaseUrl()}/user-skills`, {
    method: "POST",
    locale,
    token,
    body: formData,
  });

  if (!ok) {
    throw new Error(message || "Failed to save skills.");
  }

  return data;
}
