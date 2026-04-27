"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { saveSkillsAction } from "../../actions/skills-actions";
import {
  getUserSkills,
  type SkillOption,
} from "../../services/skills-client-service";
import type { CandidateSkillViewModel } from "../../types/profile.types";
import { MultiSelectInputSkills } from "./MultiSelectInputSkills";

interface AddSkillsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skills: CandidateSkillViewModel[];
  onSave: (skills: CandidateSkillViewModel[]) => void;
  jobTitleId: string;
}

export function AddSkillsModal({
  open,
  onOpenChange,
  skills,
  onSave,
  jobTitleId
}: AddSkillsModalProps) {
  const locale = useLocale();
  const { data: session } = useSession();
  const [selected, setSelected] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const {
    data: skillsPages,
    isLoading,
    error: skillsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["user-skills", locale, jobTitleId],
    enabled: open && Boolean(session?.accessToken),
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      if (!session?.accessToken) {
        throw new Error("Missing access token.");
      }

      return getUserSkills({
        locale,
        token: session.accessToken,
        jobTitleId,
        page: Number(pageParam),
      });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.next_page_url) return undefined;

      const url = new URL(lastPage.next_page_url, window.location.origin);
      const page = Number(url.searchParams.get("page"));
      return Number.isNaN(page) ? undefined : page;
    },
  });

  useEffect(() => {
    if (!open) return;

    const message =
      skillsError instanceof Error ? skillsError.message : undefined;

    if (message) {
      toast.error(message);
    }
  }, [open, skillsError]);

  useEffect(() => {
    if (open) {
      setSelected([]);
    }
  }, [open]);

  const allSkillOptions = useMemo(() => {
    const merged = new Map<string, SkillOption>();

    const options = skillsPages?.pages.flatMap((page) => page.skills) ?? [];
    const suggested = skillsPages?.pages[0]?.suggested ?? [];

    [...options, ...suggested].forEach((skill) => {
      merged.set(skill.id, skill);
    });

    return Array.from(merged.values());
  }, [skillsPages]);

  const suggestedSkills = useMemo(
    () => skillsPages?.pages[0]?.suggested ?? [],
    [skillsPages],
  );

  const optionsById = useMemo(
    () => new Map(allSkillOptions.map((skill) => [skill.id, skill])),
    [allSkillOptions],
  );

  const toggle = (skillId: string) => {
    setSelected((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId],
    );
  };

  const remove = (skillId: string) => {
    setSelected((prev) => prev.filter((id) => id !== skillId));
  };

  const handleAdd = async () => {
    try {
      setIsSaving(true);
      const existingSkillIdSet = new Set(skills.map((skill) => skill.id));
      const newlySelectedOptions = selected
        .map((skillId) => optionsById.get(skillId))
        .filter((skill): skill is SkillOption => Boolean(skill))
        .filter((skill) => !existingSkillIdSet.has(skill.id));
      const newSkillIds = newlySelectedOptions.map((skill) => skill.id);
      const newSkills = newlySelectedOptions
        .map((skill) => ({
          id: skill.id,
          label: skill.label,
          deleteId: skill.deleteId ?? skill.id,
        }));

      const result = await saveSkillsAction({
        skillIds: newSkillIds,
        locale,
      });

      toast.success(result.message);
      onSave([...skills, ...newSkills]);
      handleClose(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to add skills.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = (value: boolean) => {
    if (!value) {
      setSelected([]);
    }
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-150 gap-4 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-black">
            Add Skills
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-1.5">
          <label className="font-semibold">Skill</label>
          <MultiSelectInputSkills
            selected={selected}
            onSelect={toggle}
            onRemove={remove}
            options={allSkillOptions}
            onReachEnd={() => fetchNextPage()}
            hasNextPage={Boolean(hasNextPage)}
            isFetchingNextPage={isFetchingNextPage}
            isLoading={isLoading}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm">Suggested based on your profile</p>
          <div className="flex flex-wrap gap-2 rounded-xl bg-[#09760A05] p-3">
            {suggestedSkills.map((skill) => {
              const isSelected = selected.includes(skill.id);
              return (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => toggle(skill.id)}
                  className={`border-border rounded-full border px-4 py-2 text-sm transition-all ${isSelected
                    ? "border-primary bg-primary text-white"
                    : "border-muted hover:border-primary hover:text-primary bg-white text-black"
                    }`}
                >
                  {skill.label}
                </button>
              );
            })}
            {suggestedSkills.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No suggested skills available.
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex justify-center pt-1">
          <Button
            onClick={handleAdd}
            disabled={selected.length === 0 || isLoading || isSaving}
            className="rounded-full px-10"
          >
            {isSaving ? "Saving..." : "Add"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
