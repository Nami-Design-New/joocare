"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { addUserSkills, updateUserSkills } from "../services/skills-client-service";

async function resolveCandidateToken() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken || session.authRole !== "candidate") {
    throw new Error("Your session has expired. Please log in again.");
  }

  return session.accessToken;
}

export async function saveSkillsAction({
  skillIds,
  locale = "en",
}: {
  skillIds: string[];
  locale?: string;
}) {
  const token = await resolveCandidateToken();

  const result = await addUserSkills({
    skillIds,
    locale,
    token,
  });
  console.log("[saveSkillsAction] addUserSkills response:", result);
  revalidatePath(`/${locale}/candidate/profile`);

  return {
    message: result.message || "Skills saved successfully.",
  };
}

export async function updateSkillsAction({
  deletedSkillIds,
  locale = "en",
}: {
  deletedSkillIds: string[];
  locale?: string;
}) {
  const token = await resolveCandidateToken();

  const result = await updateUserSkills({
    skillIds: deletedSkillIds,
    locale,
    token,
  });
  console.log("[updateSkillsAction] updateUserSkills response:", result);

  revalidatePath(`/${locale}/candidate/profile`);

  return {
    message: result.message || "Skills updated successfully.",
  };
}
