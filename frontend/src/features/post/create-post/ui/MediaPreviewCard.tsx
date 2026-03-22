import { X } from 'lucide-react';

import { Button } from '@/shared/ui/button';

interface MediaPreviewCardProps {
  previewUrl: string;
  type: 'image' | 'video';
  onRemove: () => void;
}

export function MediaPreviewCard({ previewUrl, type, onRemove }: MediaPreviewCardProps) {
  return (
    <div className="relative rounded-xl overflow-hidden border border-border/50 bg-black/5 flex items-center justify-center dark:bg-black/20 shrink-0">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8 rounded-full z-10 bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-all"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
      {type === 'video' ? (
        <video src={previewUrl} controls className="max-h-75 w-full object-contain" />
      ) : (
        <img src={previewUrl} alt="Post preview" className="max-h-75 w-full object-contain" />
      )}
    </div>
  );
}
