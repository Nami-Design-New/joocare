"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { updateSkillsAction } from "../../actions/skills-actions";
import type { CandidateSkillViewModel } from "../../types/profile.types";
import { useQueryClient } from "@tanstack/react-query";

interface EditSkillsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skills: CandidateSkillViewModel[];
  onSave: (skills: CandidateSkillViewModel[]) => void;
}

export function EditSkillsModal({
  open,
  onOpenChange,
  skills,
  onSave,
}: EditSkillsModalProps) {
  const locale = useLocale();
  const t = useTranslations();
  const [current, setCurrent] = useState<CandidateSkillViewModel[]>(skills);
  const [profileSkills, setProfileSkills] =
    useState<CandidateSkillViewModel[]>(skills);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!open) {
      return;
    }

    setProfileSkills(skills);
    setCurrent(skills);
  }, [open, skills]);

  const toggle = (skill: CandidateSkillViewModel) => {
    setCurrent((prev) =>
      prev.some((item) => item.id === skill.id)
        ? prev.filter((item) => item.id !== skill.id)
        : [...prev, skill],
    );
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const currentIdSet = new Set(current.map((skill) => skill.id));
      const deletedSkillIds = profileSkills
        .filter((skill) => !currentIdSet.has(skill.id))
        .map((skill) => skill.id);

      const result = await updateSkillsAction({
        deletedSkillIds,
        locale,
      });
      queryClient.invalidateQueries({
        queryKey: ["user-skills-suggestions"]
      })
      toast.success(result.message);
      onSave(current);
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("candidatePage.toasts.skills-update-failed");
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-150 gap-4 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">{t("candidatePage.profile.edit-skills")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-1.5">
          <label className="font-semibold">{t("candidatePage.profile.skill-label")}</label>
          <div className="flex min-h-[60px] flex-wrap gap-2 rounded-xl bg-[#09760A08] p-3">
            {profileSkills.map((skill) => {
              const isSelected = current.some((item) => item.id === skill.id);

              return (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => toggle(skill)}
                  className={`border-border rounded-full border px-4 py-2 text-sm transition-all ${isSelected
                    ? "border-primary bg-primary text-white"
                    : "border-muted hover:border-primary hover:text-primary bg-white text-black"
                    }`}
                >
                  {skill.label}
                </button>
              );
            })}

            {profileSkills.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                {t("candidatePage.profile.no-skills-to-edit")}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex justify-center pt-1">
          <Button
            onClick={handleSave}
            className="rounded-full px-10"
            disabled={isSaving || profileSkills.length === 0}
          >
            {isSaving ? t("candidatePage.common.saving") : t("common.save")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
