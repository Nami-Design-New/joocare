"use client";
import { Edit2, Plus } from "lucide-react";
import { useState } from "react";
import OneSkillSection from "./OneSkillSection";
import { AddSkillsModal } from "./AddSkillsModal";
import { EditSkillsModal } from "./EditSkillsModal";
import type {
  CandidateProfileViewModel,
  CandidateSkillViewModel,
} from "../../types/profile.types";

const SkillsSection = ({
  profile,
}: {
  profile: CandidateProfileViewModel | null;
}) => {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [skills, setSkills] = useState<CandidateSkillViewModel[]>(profile?.skills ?? []);

  return (
    <>
      <section className="flex flex-col gap-5 rounded-2xl border bg-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Skills</h3>

          <div className="flex items-center gap-4">
            <Plus
              size={22}
              onClick={() => setAddOpen(true)}
              className="cursor-pointer"
            />
            <Edit2
              size={22}
              onClick={() => setEditOpen(true)}
              className="cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.length > 0 ? (
            skills.map((skill) => <OneSkillSection key={skill.id} label={skill.label} />)
          ) : (
            <p className="text-muted-foreground text-sm">
              No skills added yet.
            </p>
          )}
        </div>
      </section>

      <AddSkillsModal
        open={addOpen}
        onOpenChange={setAddOpen}
        skills={skills}
        onSave={(newSkills) => setSkills(newSkills)}
        jobTitleId={profile?.jobTitleId as string}
      />

      <EditSkillsModal
        open={editOpen}
        onOpenChange={setEditOpen}
        skills={skills}
        onSave={(updated) => setSkills(updated)}
      />
    </>
  );
};

export default SkillsSection;
