import { Card } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import type { PermissionGroup } from '../../types/permissions.types';
import PermissionRow from './PermissionRow';
import PermissionNotice from './PermissionNotice';

type PermissionGroupCardProps = {
  group: PermissionGroup;
};

export default function PermissionGroupCard({
  group,
}: PermissionGroupCardProps) {
  return (
    <Card
      className="border-border gap-4 rounded-xl bg-white p-5 shadow-none"
      dir="ltr"
    >
      <div className="space-y-1">
        <h3 className="text-secondary text-base leading-[normal] font-semibold">
          {group.title}
        </h3>
        {group.description ? (
          <p className="text-sm leading-[normal] text-[var(--gray-45)]">
            {group.description}
          </p>
        ) : null}
      </div>
      <div
        className={cn(
          'space-y-3',
          group.highlighted && 'bg-primary/[0.04] rounded-xl p-4',
          group.entries.some((entry) => entry.label) && 'space-y-0',
        )}
      >
        {group.entries.map((entry) => (
          <PermissionRow key={entry.id} entry={entry} />
        ))}
        {group.note ? (
          <p className="text-muted-foreground text-sm leading-[normal]">
            {group.note}
          </p>
        ) : null}
      </div>
      {group.notice ? <PermissionNotice {...group.notice} /> : null}
    </Card>
  );
}
