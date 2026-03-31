import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useForm } from '@tanstack/react-form';
import { ImageIcon } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';

import { useMediaPreview } from '../lib/use-media-preview';
import { useCreatePostMutation } from '../model/mutation';
import { type CreatePost, createPostSchema } from '../model/schema';
import { MediaPreviewCard } from './MediaPreviewCard';

export function CreatePostForm() {
  const { mediaPreview, mediaType, fileInputRef, handleFileSelect, clearMedia } = useMediaPreview();
  const mutation = useCreatePostMutation();
  const { t } = useTranslation(['common', 'post']);
  const schema = useMemo(() => createPostSchema(t), [t]);

  const form = useForm({
    defaultValues: {
      description: '',
      file: null as unknown as File,
    } as CreatePost,
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
    },
  });

  const onRemoveMedia = () => {
    clearMedia();
    form.setFieldValue('file', null as unknown as File);
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col flex-1 overflow-hidden"
    >
      <div className="px-6 py-2 flex flex-col gap-4 flex-1 overflow-y-auto">
        <div className="bg-background">
          <form.Field
            name="description"
            children={field => (
              <Textarea
                placeholder={t('post:create.dialog.description.placeholder')}
                className="resize-none h-50 overflow-y-auto border-none focus-visible:ring-0 shadow-none text-base px-2 py-2 leading-normal box-border"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
              />
            )}
          />
        </div>

        {mediaPreview && mediaType && (
          <MediaPreviewCard previewUrl={mediaPreview} type={mediaType} onRemove={onRemoveMedia} />
        )}

        <form.Field
          name="file"
          children={field => (
            <Input
              id="file-upload"
              type="file"
              accept="image/*,video/*"
              className="hidden"
              ref={fileInputRef}
              onChange={e => {
                const file = e.target.files?.[0];
                if (!file) return;
                handleFileSelect(file);
                field.handleChange(file);
              }}
            />
          )}
        />
      </div>

      <div className="flex items-center justify-between border-t px-6 py-4 bg-muted/5 shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-primary hover:bg-primary/10"
          asChild
        >
          <Label htmlFor="file-upload" className="cursor-pointer font-medium">
            <ImageIcon className="w-5 h-5 mr-2" />
            {t('post:create.dialog.file.button')}
          </Label>
        </Button>

        <form.Subscribe
          selector={state => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" className="px-6" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? t('common:actions.publishing') : t('common:actions.publish')}
            </Button>
          )}
        />
      </div>
    </form>
  );
}
