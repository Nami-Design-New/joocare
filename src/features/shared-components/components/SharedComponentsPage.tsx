'use client';

import { useState, type ReactNode } from 'react';
import { useLocale } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent } from '@/shared/components/ui/dialog';
import type { PermissionGroup } from '@/features/company-admin-roles/types/permissions.types';
import PermissionGroupCard from '@/features/company-admin-roles/components/shared/PermissionGroupCard';
import PermissionNotice from '@/features/company-admin-roles/components/shared/PermissionNotice';
import PermissionRow from '@/features/company-admin-roles/components/shared/PermissionRow';
import PermissionsOverview from '@/features/company-admin-roles/components/shared/PermissionsOverview';
import RolePermissionsFooter from '@/features/company-admin-roles/components/shared/RolePermissionsFooter';
import RolePermissionsHeader from '@/features/company-admin-roles/components/shared/RolePermissionsHeader';
import RoleSummaryCard from '@/features/company-admin-roles/components/shared/RoleSummaryCard';

const exampleGroup: PermissionGroup = {
  id: 'hiring-management',
  title: 'Hiring Management',
  description: 'Manage the hiring workflow and candidate reviews.',
  highlighted: true,
  entries: [
    { id: 'jobs', label: 'Jobs', value: 'Full access' },
    {
      id: 'candidates',
      label: 'Candidate Profiles',
      value: 'View only',
      description: 'Personal details and application history.',
    },
  ],
  notice: {
    title: 'Assessment categories',
    description: 'Creating categories is not permitted for this role.',
  },
};

const groupCardExamples: PermissionGroup[] = [
  {
    id: 'basic-group',
    title: 'Company Profile',
    entries: [{ id: 'view', value: 'View only' }],
  },
  {
    id: 'descriptive-group',
    title: 'Dashboard',
    description: 'Access to company hiring activity and reports.',
    entries: [
      { id: 'overview', label: 'Overview', value: 'Full access' },
      { id: 'reports', label: 'Reports', value: 'View only' },
    ],
  },
  {
    id: 'highlighted-group',
    title: 'Full Platform Access',
    highlighted: true,
    entries: [{ id: 'all', value: 'Full access to all platform areas' }],
  },
  {
    id: 'note-group',
    title: 'Assigned Projects',
    entries: [{ id: 'projects', value: 'View only' }],
    note: 'Only projects assigned to this role are available.',
  },
  {
    id: 'notice-group',
    title: 'Assessment',
    entries: [{ id: 'assessment', value: 'Full access' }],
    notice: {
      title: 'Category creation restricted',
      description: 'All other assessment permissions are available.',
    },
  },
  {
    id: 'notice-without-title-group',
    title: 'Notifications',
    entries: [{ id: 'notifications', value: 'Access' }],
    notice: { description: 'Notifications are delivered by email.' },
  },
];

function ComponentPreview({ children }: { children: ReactNode }) {
  return (
    <section className="flex min-w-0 items-center rounded-2xl border bg-white p-5 shadow-sm">
      <div className="w-full">{children}</div>
    </section>
  );
}

export default function SharedComponentsPage() {
  const locale = useLocale();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <main
      className="mx-auto max-w-7xl"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <section className="space-y-4">
        <h2 className="text-secondary text-xl font-semibold">Company Admin Roles</h2>
        <div className="grid gap-4 xl:grid-cols-2">
        <ComponentPreview>
          <RoleSummaryCard
            name="Recruiter"
            description="Hiring access with specific viewing and assessment limits."
          />
        </ComponentPreview>
        <ComponentPreview>
          <PermissionsOverview count={4} suffix="Hiring access" />
        </ComponentPreview>
        <ComponentPreview>
          <PermissionRow
            entry={{
              id: 'candidate-cvs',
              label: 'Candidate CVs',
              value: 'View and download',
              description: 'CV files for candidates in assigned projects.',
            }}
          />
        </ComponentPreview>
        <ComponentPreview>
          <PermissionNotice
            title="Not permitted"
            description="Creating assessment categories is not available."
          />
        </ComponentPreview>
        <ComponentPreview>
          <PermissionGroupCard group={exampleGroup} />
        </ComponentPreview>
        {groupCardExamples.map((group) => (
          <ComponentPreview key={group.id}>
            <PermissionGroupCard group={group} />
          </ComponentPreview>
        ))}
        <ComponentPreview>
          <Button onClick={() => setDialogOpen(true)}>Preview</Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent
              showCloseButton={false}
              className="flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[780px] flex-col gap-0 overflow-hidden rounded-2xl border-0 p-0 shadow-xl"
            >
              <RolePermissionsHeader
                roleName="Recruiter"
                description="Hiring access with specific viewing and assessment limits."
              />
              <div className="flex-1 p-6">
                <PermissionsOverview count={2} suffix="Hiring access" />
                <div className="mt-4">
                  <PermissionGroupCard group={exampleGroup} />
                </div>
              </div>
              <RolePermissionsFooter />
            </DialogContent>
          </Dialog>
        </ComponentPreview>
        </div>
      </section>
    </main>
  );
}
