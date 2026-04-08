import { useTranslation } from 'react-i18next';

import { X } from 'lucide-react';

import { Button } from '@/shared/ui/button';

interface MediaPreviewCardProps {
  previewUrl: string;
  type: 'image' | 'video';
  onRemove: () => void;
}

export function MediaPreviewCard({ previewUrl, type, onRemove }: MediaPreviewCardProps) {
  const { t } = useTranslation('common');
  return (
    <div className="border-border/50 relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-black/5 dark:bg-black/20">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-black/70"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
      {type === 'video' ? (
        <video src={previewUrl} controls className="max-h-75 w-full object-contain" />
      ) : (
        <img
          src={previewUrl}
          alt={t('mediaUploader.preview')}
          className="max-h-75 w-full object-contain"
        />
      )}
    </div>
  );
}
