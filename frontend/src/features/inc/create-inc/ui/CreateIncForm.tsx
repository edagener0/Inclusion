import { useTranslation } from 'react-i18next';

import { useForm } from '@tanstack/react-form';

import { Button } from '@/shared/ui/button';
import { DialogFooter } from '@/shared/ui/dialog';
import { Textarea } from '@/shared/ui/textarea';

import { useCreateIncMutation } from '../model/mutation';
import { type CreateInc, CreateIncSchema } from '../model/schema';

export function CreateIncForm() {
  const mutation = useCreateIncMutation();
  const { t } = useTranslation(['common', 'inc']);

  const form = useForm({
    defaultValues: { content: '' } as CreateInc,
    validators: { onChange: CreateIncSchema },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value.content);
    },
  });

  return (
    <form
      className="flex flex-col gap-4 pt-4"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="space-y-4">
        <form.Field
          name="content"
          children={(field) => (
            <div>
              <Textarea
                placeholder={t('inc:create.fields.content.placeholder')}
                className="min-h-32"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                autoFocus
              />

              {field.state.meta.errors.length > 0 && (
                <p className="text-destructive animate-in fade-in slide-in-from-top-1 pt-2 text-[10px] font-medium">
                  {field.state.meta.errors[0]?.message?.toString()}
                </p>
              )}
            </div>
          )}
        />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline">
          {t('common:actions.cancel')}
        </Button>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? t('common:actions.publishing') : t('common:actions.publish')}
            </Button>
          )}
        />
      </DialogFooter>
    </form>
  );
}
