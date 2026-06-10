"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { saveSkillsAction } from "../../actions/skills-actions";
import type { SkillOption } from "../../services/skills-client-service";
import type { CandidateSkillViewModel } from "../../types/profile.types";
import { MultiSelectInputSkills } from "./MultiSelectInputSkills";
import useGetUserSkills from "../../hooks/useGetUserSkills";
import useGetUserSkillsSuggestions from "../../hooks/useGetUserSkillsSuggestions";

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
  jobTitleId,
}: AddSkillsModalProps) {
  const locale = useLocale();
  const t = useTranslations();
  const { data: session } = useSession();
  const token = session?.accessToken ?? "";
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedSkillsCache, setSelectedSkillsCache] = useState<Map<string, SkillOption>>(new Map());
  const [skillsSearch, setSkillsSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const {
    data: rawSkills,
    isLoading: isSkillsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetUserSkills(skillsSearch, jobTitleId, token);

  const { data: rawSuggestions, isLoading: isSuggestionLoading } =
    useGetUserSkillsSuggestions({ token });

  const skillOptions: SkillOption[] = useMemo(
    () => rawSkills.map((s) => ({ id: String(s.id), label: s.title, deleteId: String(s.id) })),
    [rawSkills],
  );

  const suggestionSkills: SkillOption[] = useMemo(
    () =>
      Array.isArray(rawSuggestions)
        ? rawSuggestions.map((s) => ({ id: String(s.id), label: s.title, deleteId: String(s.id) }))
        : [],
    [rawSuggestions],
  );

  // Merge current options + cached selected skills so labels never go missing
  const skillOptionsById = useMemo(() => {
    const map = new Map(skillOptions.map((s) => [s.id, s]));
    selectedSkillsCache.forEach((skill, id) => {
      if (!map.has(id)) map.set(id, skill);
    });
    return map;
  }, [skillOptions, selectedSkillsCache]);

  useEffect(() => {
    if (open) {
      queryClient.removeQueries({
        queryKey: ["user-skills", locale, jobTitleId],
        exact: false,
      });
      setSelected([]);
      setSkillsSearch("");
      setSelectedSkillsCache(new Map());
    }
  }, [open, jobTitleId, locale, queryClient]);

  const toggle = (skillId: string) => {
    setSelected((prev) => {
      if (prev.includes(skillId)) return prev.filter((id) => id !== skillId);

      // Cache skill data at selection time so label survives search changes
      const skill =
        skillOptionsById.get(skillId) ??
        suggestionSkills.find((s) => s.id === skillId);
      if (skill) {
        setSelectedSkillsCache((cache) => new Map(cache).set(skillId, skill));
      }

      return [...prev, skillId];
    });
  };

  const remove = (skillId: string) => {
    setSelected((prev) => prev.filter((id) => id !== skillId));
  };

  const handleAdd = async () => {
    try {
      setIsSaving(true);
      const existingSkillIdSet = new Set(skills.map((skill) => skill.id));

      const newlySelectedOptions = selected
        .map((skillId) => skillOptionsById.get(skillId))
        .filter((skill): skill is SkillOption => Boolean(skill))
        .filter((skill) => !existingSkillIdSet.has(skill.id));

      const newSkillIds = newlySelectedOptions.map((skill) => skill.id);
      const newSkills = newlySelectedOptions.map((skill) => ({
        id: skill.id,
        label: skill.label,
        deleteId: skill.deleteId ?? skill.id,
      }));

      const result = await saveSkillsAction({ skillIds: newSkillIds, locale });
      queryClient.invalidateQueries({
        queryKey: ["user-skills-suggestions"]
      })
      toast.success(result.message);
      onSave([...skills, ...newSkills]);
      handleClose(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("candidatePage.toasts.skills-add-failed");
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = (value: boolean) => {
    if (!value) {
      setSelected([]);
      setSkillsSearch("");
      setSelectedSkillsCache(new Map());
    }
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-150 gap-4 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-black md:text-2xl">
            {t("candidatePage.profile.add-skills")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-1.5">
          <label className="font-semibold">{t("candidatePage.profile.skill-label")}</label>
          <MultiSelectInputSkills
            selected={selected}
            onSelect={toggle}
            onRemove={remove}
            options={skillOptions}
            // Pass the full map so selected tags always resolve to labels
            optionsById={skillOptionsById}
            searchValue={skillsSearch}
            onSearchChange={setSkillsSearch}
            onReachEnd={() => fetchNextPage()}
            hasNextPage={Boolean(hasNextPage)}
            isFetchingNextPage={isFetchingNextPage}
            isLoading={isSkillsLoading}
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs md:text-sm">{t("candidatePage.profile.suggested-skills-title")}</p>
          <div className="flex flex-wrap gap-2 rounded-xl bg-[#09760A05] p-3">
            {suggestionSkills.map((skill) => {
              const isSelected = selected.includes(skill.id);
              return (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => toggle(skill.id)}
                  className={`border-border rounded-full border px-4 py-2 text-xs transition-all md:text-sm ${isSelected
                    ? "border-primary bg-primary text-white"
                    : "border-muted hover:border-primary hover:text-primary bg-white text-black"
                    }`}
                >
                  {skill.label}
                </button>
              );
            })}
            {suggestionSkills.length === 0 && (
              <p className="text-muted-foreground text-xs md:text-sm">
                {t("candidatePage.profile.no-suggested-skills")}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center pt-1">
          <Button
            onClick={handleAdd}
            disabled={selected.length === 0 || isSuggestionLoading || isSaving}
            className="rounded-full px-10 text-xs md:text-sm"
          >
            {isSaving ? t("candidatePage.common.saving") : t("candidatePage.common.add")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
