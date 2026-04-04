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
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-1 flex-col overflow-hidden"
    >
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-2">
        <div className="bg-background">
          <form.Field
            name="description"
            children={(field) => (
              <Textarea
                placeholder={t('post:create.dialog.description.placeholder')}
                className="box-border h-50 resize-none overflow-y-auto border-none px-2 py-2 text-base leading-normal shadow-none focus-visible:ring-0"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />
        </div>

        {mediaPreview && mediaType && (
          <MediaPreviewCard previewUrl={mediaPreview} type={mediaType} onRemove={onRemoveMedia} />
        )}

        <form.Field
          name="file"
          children={(field) => (
            <Input
              id="file-upload"
              type="file"
              accept="image/*,video/*"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                handleFileSelect(file);
                field.handleChange(file);
              }}
            />
          )}
        />
      </div>

      <div className="bg-muted/5 flex shrink-0 items-center justify-between border-t px-6 py-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-primary hover:bg-primary/10"
          asChild
        >
          <Label htmlFor="file-upload" className="cursor-pointer font-medium">
            <ImageIcon className="mr-2 h-5 w-5" />
            {t('post:create.dialog.file.button')}
          </Label>
        </Button>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
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
