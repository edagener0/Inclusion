import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Film, Image as ImageIcon, Maximize2, UploadCloud, X } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';

type MediaFile = {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
};

interface SingleMediaUploaderProps {
  onChange: (file: File | null) => void;
  className?: string;
}

const SUPPORTED_FORMATS_TEXT = 'JPG, PNG, GIF, MP4 & WebM';

export function SingleMediaUploader({ onChange, className = '' }: SingleMediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [mediaFile, setMediaFile] = useState<MediaFile | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation('common');

  useEffect(() => {
    return () => {
      if (mediaFile) URL.revokeObjectURL(mediaFile.preview);
    };
  }, [mediaFile]);

  const handleFiles = (files: FileList | File[]) => {
    const validFile = Array.from(files).find(
      (file) => file.type.startsWith('image/') || file.type.startsWith('video/'),
    );

    if (!validFile) return;

    if (mediaFile) URL.revokeObjectURL(mediaFile.preview);

    const newMediaFile: MediaFile = {
      id: Math.random().toString(36).substring(7),
      file: validFile,
      preview: URL.createObjectURL(validFile),
      type: validFile.type.startsWith('video/') ? 'video' : 'image',
    };

    setMediaFile(newMediaFile);
    onChange(validFile);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (mediaFile) URL.revokeObjectURL(mediaFile.preview);

    setMediaFile(null);
    setIsPreviewOpen(false);
    onChange(null);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      {!mediaFile ? (
        <div
          className={`relative flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:bg-accent/50 hover:border-muted-foreground/50'
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="bg-primary/10 mb-4 flex h-14 w-14 items-center justify-center rounded-full">
            <UploadCloud className="text-primary h-7 w-7" />
          </div>
          <p className="text-foreground mb-1 text-base font-medium">{t('mediaUploader.select')}</p>

          <p className="text-muted-foreground text-sm">{SUPPORTED_FORMATS_TEXT}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            className="bg-muted group relative aspect-video w-full cursor-pointer overflow-hidden rounded-xl border shadow-sm"
            onClick={() => setIsPreviewOpen(true)}
          >
            {mediaFile.type === 'image' ? (
              <img
                src={mediaFile.preview}
                alt={t('mediaUploader.preview')}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="relative flex h-full w-full items-center justify-center bg-black">
                <video src={mediaFile.preview} className="h-full w-full object-cover opacity-80" />
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/20">
              <div className="bg-background/95 text-foreground flex translate-y-2 transform items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium opacity-0 shadow-md transition-all group-hover:translate-y-0 group-hover:opacity-100">
                <Maximize2 className="h-4 w-4" /> {t('mediaUploader.fullscreen')}
              </div>
            </div>

            <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-0 transition-all group-hover:opacity-100">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                title={t('mediaUploader.changeFile')}
                className="bg-background/90 hover:bg-primary hover:text-primary-foreground rounded-full p-2 shadow-sm transition-colors"
              >
                <UploadCloud className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={removeFile}
                title={t('actions.remove')}
                className="bg-background/90 hover:bg-destructive hover:text-destructive-foreground rounded-full p-2 shadow-sm transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="bg-background/90 pointer-events-none absolute bottom-3 left-3 rounded-md p-1.5 shadow-sm">
              {mediaFile.type === 'image' ? (
                <ImageIcon className="text-foreground h-4 w-4" />
              ) : (
                <Film className="text-foreground h-4 w-4" />
              )}
            </div>
          </div>
        </div>
      )}

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="flex w-fit max-w-none! items-center justify-center border-none bg-transparent p-0 shadow-none focus:outline-none [&>button:last-child]:hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>{t('actions.save')}</DialogTitle>
          </DialogHeader>

          <div className="relative flex items-center justify-center">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="fixed top-6 right-6 z-50 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/80"
            >
              <X className="h-6 w-6" />
            </button>

            {mediaFile?.type === 'image' && (
              <img
                src={mediaFile.preview}
                alt={t('mediaUploader.preview')}
                className="h-auto max-h-[95vh] w-auto max-w-[95vw] rounded-md object-contain shadow-2xl"
              />
            )}

            {mediaFile?.type === 'video' && (
              <video
                src={mediaFile.preview}
                controls
                autoPlay
                className="h-auto max-h-[95vh] w-auto max-w-[95vw] rounded-md shadow-2xl outline-none"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
