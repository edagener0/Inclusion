import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useForm } from '@tanstack/react-form';

import { Button } from '@/shared/ui/button';
import { DialogClose } from '@/shared/ui/dialog';
import { FieldError } from '@/shared/ui/field';
import { SingleMediaUploader } from '@/shared/ui/single-media-uploader';

import { useCreateStoryMutation } from '../model/mutation';
import { type CreateStory, createStorySchema } from '../model/schema';

export function CreateStoryForm() {
  const mutation = useCreateStoryMutation();
  const { t } = useTranslation('common');
  const schema = useMemo(() => createStorySchema(t), [t]);

  const form = useForm({
    defaultValues: { file: null as unknown as File } as CreateStory,
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
    },
  });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="mt-2">
        <form.Field
          name="file"
          children={field => (
            <div className="flex flex-col gap-2">
              <SingleMediaUploader onChange={file => field.handleChange(file as unknown as File)} />
              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        />
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <DialogClose asChild>
          <Button variant="outline" type="button">
            {t('actions.cancel')}
          </Button>
        </DialogClose>

        <form.Subscribe
          selector={state => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? t('actions.submitting') : t('actions.submit')}
            </Button>
          )}
        />
      </div>
    </form>
  );
}
