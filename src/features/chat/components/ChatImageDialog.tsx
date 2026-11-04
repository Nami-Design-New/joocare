import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import type { ChatAttachment } from '../types/chat.types';
import ChatIcon from './ChatIcon';

type ChatImageDialogProps = {
  attachment: ChatAttachment | null;
  onClose: () => void;
  onDownload: (attachment: ChatAttachment) => void;
};

export default function ChatImageDialog({
  attachment,
  onClose,
  onDownload,
}: ChatImageDialogProps) {
  const t = useTranslations('companyPage.chat');
  return (
    <Dialog
      open={Boolean(attachment)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="w-[calc(100%-2rem)] max-w-3xl rounded-2xl sm:min-w-0"
        showCloseButton={false}
      >
        <div className="flex min-w-0 items-center justify-between gap-3">
          <DialogTitle className="truncate text-base">
            <bdi>{attachment?.name}</bdi>
          </DialogTitle>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t('close-preview')}
            >
              <ChatIcon name="cancel-reply" width={16} />
            </Button>
          </DialogClose>
        </div>
        <DialogDescription className="sr-only">
          {t('image-preview-description')}
        </DialogDescription>
        {attachment?.url && (
          <Image
            src={attachment.url}
            width={1104}
            height={510}
            alt={attachment.name}
            unoptimized
            className="max-h-[65dvh] w-full rounded-lg object-contain"
          />
        )}
        {attachment && (
          <Button
            type="button"
            className="bg-chat-primary justify-self-end rounded-xl"
            onClick={() => onDownload(attachment)}
          >
            {t('download')}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
