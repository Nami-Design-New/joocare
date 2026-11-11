import Image from 'next/image';
import type { PermissionEntry } from '../../types/permissions.types';
import { cn } from '@/shared/lib/utils';

type PermissionRowProps = {
  entry: PermissionEntry;
};

export default function PermissionRow({ entry }: PermissionRowProps) {
  return (
    <div
      className={cn(
        'text-sm leading-[normal]',
        entry.label &&
          'flex flex-col gap-2 border-b border-border py-3 sm:flex-row sm:items-center sm:gap-6',
      )}
    >
      {entry.label ? (
        <p className="shrink-0 font-semibold text-secondary sm:w-60">
          {entry.label}
        </p>
      ) : null}
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/icons/permissions/access-check.svg"
            width={16}
            height={16}
            alt=""
            className="shrink-0"
          />
          <p className="min-w-0 text-secondary">{entry.value}</p>
        </div>
        {entry.description ? (
          <p className="text-muted-foreground">{entry.description}</p>
        ) : null}
      </div>
    </div>
  );
}
