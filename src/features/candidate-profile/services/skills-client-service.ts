import { getUserApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";

export type SkillOption = {
  id: string;
  label: string;
  deleteId?: string;
};

export type UserSkillsCatalog = {
  suggested: SkillOption[];
  skills: SkillOption[];
};

function parseSkillOption(entry: unknown): SkillOption | null {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const record = entry as Record<string, unknown>;
  const nestedSkill =
    record.skill && typeof record.skill === "object"
      ? (record.skill as Record<string, unknown>)
      : null;
  const rawId = record.id;
  const id = nestedSkill?.id ?? record.skill_id ?? rawId;
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
      deleteId:
        (nestedSkill || record.skill_id) &&
          (typeof rawId === "number" || typeof rawId === "string")
          ? String(rawId)
          : String(id),
    };
  }

  return null;
}

function mergeSkillOptions(...collections: unknown[][]) {
  const uniqueSkills = new Map<string, SkillOption>();

  collections
    .flat()
    .map(parseSkillOption)
    .filter((skill): skill is SkillOption => Boolean(skill))
    .forEach((skill) => {
      if (!uniqueSkills.has(skill.id)) {
        uniqueSkills.set(skill.id, skill);
      }
    });

  return Array.from(uniqueSkills.values());
}

function getArrayAtPath(value: unknown, path: string[]) {
  let current: unknown = value;

  for (const key of path) {
    if (!current || typeof current !== "object") {
      return [];
    }

    current = (current as Record<string, unknown>)[key];
  }

  return Array.isArray(current) ? current : [];
}

export async function getUserSkills({
  locale = "en",
  token,
  jobTitleId,
}: {
  locale?: string;
  token: string;
  jobTitleId?: string;
}) {
  const { ok, data, message } = await apiFetch(
    `${getUserApiUrl()}/user-skills?pagination=on&limit_per_page=100&page=1&job_title_id=${jobTitleId}`,
    {
      method: "GET",
      locale,
      token,
    },
  );

  if (!ok) {
    throw new Error(message || "Failed to load skills.");
  }

  return {
    suggested: mergeSkillOptions(
      getArrayAtPath(data, ["suggested"]),
      getArrayAtPath(data, ["data", "suggested"]),
      getArrayAtPath(data, ["data", "data", "suggested"]),
    ),
    skills: mergeSkillOptions(
      getArrayAtPath(data, ["skills"]),
      getArrayAtPath(data, ["data", "skills"]),
      getArrayAtPath(data, ["data", "data", "skills"]),
      getArrayAtPath(data, ["skills", "original", "data"]),
      getArrayAtPath(data, ["data", "skills", "original", "data"]),
      getArrayAtPath(data, ["data", "data", "skills", "original", "data"]),
      getArrayAtPath(data, ["skills", "original", "data", "data"]),
      getArrayAtPath(data, ["data", "skills", "original", "data", "data"]),
      getArrayAtPath(data, ["data", "data", "skills", "original", "data", "data"]),
    ),
  } satisfies UserSkillsCatalog;
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
    return {
      data: null,
      message: "No new skills to add.",
    };
  }

  const formData = new FormData();
  skillIds.forEach((id) => {
    formData.append("skills[]", id);
  });
  console.log("[addUserSkills] request payload:", {
    locale,
    skillIds,
    entries: Array.from(formData.entries()),
  });
  console.log("[addUserSkills] request formData:",
    formData
  );


  const result = await apiFetch(`${getUserApiUrl()}/user-skills`, {
    method: "POST",
    locale,
    token,
    body: formData,
  });
  console.log("[addUserSkills] api response:", {
    ok: result.ok,
    statusCode: result.statusCode,
    message: result.message,
    data: result.data,
  });
  const { ok, data, message } = result;

  if (!ok) {
    throw new Error(message || "Failed to save skills.");
  }

  return {
    data,
    message,
  };
}

export async function updateUserSkills({
  skillIds,
  locale = "en",
  token,
}: {
  skillIds: string[];
  locale?: string;
  token: string;
}) {
  if (skillIds.length === 0) {
    return {
      data: null,
      message: "No skills to delete.",
    };
  }

  const formData = new FormData();
  skillIds.forEach((id) => {
    formData.append("skills[]", id);
  });
  formData.append("_method", "put");

  console.log("[updateUserSkills] request payload:", {
    locale,
    skillIds,
    entries: Array.from(formData.entries()),
  });
  console.log("[updateUserSkills] request formData:",
    formData
  );

  const result = await apiFetch(`${getUserApiUrl()}/user-skills`, {
    method: "POST",
    locale,
    token,
    body: formData,

  });
  console.log("[updateUserSkills] api response:", {
    ok: result.ok,
    statusCode: result.statusCode,
    message: result.message,
    data: result.data,
  });
  const { ok, data, message } = result;

  if (!ok) {
    throw new Error(message || "Failed to update skills.");
  }

  return {
    data,
    message,
  };
}
