import React, { useEffect, useRef, useState } from 'react';

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

export function SingleMediaUploader({ onChange, className = '' }: SingleMediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [mediaFile, setMediaFile] = useState<MediaFile | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (mediaFile) URL.revokeObjectURL(mediaFile.preview);
    };
  }, [mediaFile]);

  const handleFiles = (files: FileList | File[]) => {
    const validFile = Array.from(files).find(
      file => file.type.startsWith('image/') || file.type.startsWith('video/'),
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
        onChange={e => e.target.files && handleFiles(e.target.files)}
      />

      {!mediaFile ? (
        <div
          className={`relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:bg-accent/50 hover:border-muted-foreground/50'
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex items-center justify-center w-14 h-14 mb-4 rounded-full bg-primary/10">
            <UploadCloud className="w-7 h-7 text-primary" />
          </div>
          <p className="mb-1 text-base font-medium text-foreground">Click or drag and drop</p>
          <p className="text-sm text-muted-foreground">JPG, PNG, GIF, MP4 or WebM</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            className="relative w-full aspect-video rounded-xl overflow-hidden border bg-muted group cursor-pointer shadow-sm"
            onClick={() => setIsPreviewOpen(true)}
          >
            {mediaFile.type === 'image' ? (
              <img
                src={mediaFile.preview}
                alt="Preview"
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="relative w-full h-full bg-black flex items-center justify-center">
                <video src={mediaFile.preview} className="object-cover w-full h-full opacity-80" />
              </div>
            )}

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center pointer-events-none">
              <div className="opacity-0 group-hover:opacity-100 bg-background/95 text-foreground px-4 py-2 rounded-lg text-sm font-medium shadow-md flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all">
                <Maximize2 className="w-4 h-4" /> Fullscreen
              </div>
            </div>

            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-20">
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                title="Change file"
                className="p-2 bg-background/90 hover:bg-primary hover:text-primary-foreground rounded-full shadow-sm transition-colors"
              >
                <UploadCloud className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={removeFile}
                title="Remove"
                className="p-2 bg-background/90 hover:bg-destructive hover:text-destructive-foreground rounded-full shadow-sm transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute bottom-3 left-3 p-1.5 bg-background/90 rounded-md shadow-sm pointer-events-none">
              {mediaFile.type === 'image' ? (
                <ImageIcon className="w-4 h-4 text-foreground" />
              ) : (
                <Film className="w-4 h-4 text-foreground" />
              )}
            </div>
          </div>
        </div>
      )}

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-none! w-fit p-0 bg-transparent border-none shadow-none flex items-center justify-center focus:outline-none [&>button:last-child]:hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Media Preview</DialogTitle>
          </DialogHeader>

          <div className="relative flex items-center justify-center">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="fixed top-6 right-6 z-50 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {mediaFile?.type === 'image' && (
              <img
                src={mediaFile.preview}
                alt="Full Preview"
                className="max-h-[95vh] max-w-[95vw] w-auto h-auto object-contain shadow-2xl rounded-md"
              />
            )}

            {mediaFile?.type === 'video' && (
              <video
                src={mediaFile.preview}
                controls
                autoPlay
                className="max-h-[95vh] max-w-[95vw] w-auto h-auto outline-none shadow-2xl rounded-md"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
