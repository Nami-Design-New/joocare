'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import DataTable, {
  type DataTableColumn,
} from '@/shared/components/common/DataTable';
import {
  Dialog as Modal,
  DialogContent as ModalContent,
  DialogDescription as ModalDescription,
  DialogHeader as ModalHeader,
  DialogTitle as ModalTitle,
} from '@/shared/components/ui/dialog';
import type {
  CompanyProject,
  ProjectShareLog,
} from '../../types/company-projects.types';

type ProjectShareLogModalProps = {
  project: CompanyProject;
  onClose: () => void;
};

export default function ProjectShareLogModal({
  project,
  onClose,
}: ProjectShareLogModalProps) {
  const t = useTranslations('companyPage.projects');
  const columns: DataTableColumn<ProjectShareLog>[] = [
    {
      id: 'date-sent',
      header: t('date-sent'),
      headerClassName: 'min-w-36 text-start',
      cellClassName: 'min-w-36 text-start',
      renderCell: (log) => (
        <div className="flex flex-col text-start">
          <span>{log.date}</span>
          <span className="text-muted-foreground text-xs">{log.time}</span>
        </div>
      ),
    },
    {
      id: 'shared-by',
      header: t('shared-by'),
      headerClassName: 'min-w-44 text-start',
      cellClassName: 'min-w-44 text-start',
      renderCell: (log) => (
        <div className="flex flex-col text-start">
          <span>{log.sharedBy}</span>
          <span className="text-muted-foreground text-xs">
            {t('recruiter-role')}
          </span>
        </div>
      ),
    },
    {
      id: 'sent-to',
      header: t('sent-to-hiring-manager'),
      headerClassName: 'min-w-64 text-start',
      cellClassName: 'min-w-64 text-start',
      renderCell: (log) => (
        <div className="flex flex-col text-start">
          <span>{log.manager}</span>
          <span className="text-muted-foreground text-xs">
            {log.managerEmail}
          </span>
        </div>
      ),
    },
  ];

  return (
    <Modal open onOpenChange={(open) => !open && onClose()}>
      <ModalContent
        showCloseButton={false}
        className="w-[calc(100%-2rem)] max-w-[780px] gap-0 rounded-[24px] p-6"
      >
        <ModalHeader className="mb-5 text-start">
          <div className="flex items-center justify-between gap-4">
            <ModalTitle className="text-xl font-bold sm:text-[28px]">
              {t('share-log-title')}
            </ModalTitle>
            <button
              type="button"
              onClick={onClose}
              aria-label={t('close')}
              className="bg-primary text-primary-foreground flex size-12 shrink-0 items-center justify-center rounded-full"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>
          <ModalDescription>
            {t('share-log-subtitle', {
              project: project.name,
              count: project.shareLogs.length,
            })}
          </ModalDescription>
        </ModalHeader>

        <div className="border-border overflow-hidden rounded-xl border">
          {project.shareLogs.length ? (
            <DataTable
              columns={columns}
              data={project.shareLogs}
              getRowKey={(log) => log.id}
              ariaLabel={t('share-log-title')}
              containerClassName="bg-white"
              className="[&_th]:bg-muted/70 min-w-[700px] [&_td]:py-3 [&_td]:text-start [&_td]:text-sm [&_th]:py-3 [&_th]:text-start [&_th]:text-xs"
              headerRowClassName="border-0"
              rowClassName="border-t border-border align-top"
            />
          ) : (
            <p className="text-muted-foreground px-4 py-10 text-center text-sm">
              {t('no-share-logs')}
            </p>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
}
