import { useTranslation } from 'react-i18next';

import { useForm } from '@tanstack/react-form';

import type { Message } from '@/entities/conversation';

import { moveCursorToEnd } from '@/shared/lib/dom';
import { Button } from '@/shared/ui/button';
import { DialogClose, DialogFooter } from '@/shared/ui/dialog';
import { FieldError } from '@/shared/ui/field';
import { Textarea } from '@/shared/ui/textarea';

import { useUpdateMessageMutation } from '../model/mutation';
import { type UpdateMessage, UpdateMessageSchema } from '../model/schema';

type Props = {
  message: Message;
  onSuccess: () => void;
};

export function UpdateMessageForm({ message, onSuccess }: Props) {
  const { t } = useTranslation(['common', 'message']);
  const mutation = useUpdateMessageMutation(message.id);

  const form = useForm({
    defaultValues: { content: message.content } as UpdateMessage,
    validators: { onChange: UpdateMessageSchema },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
      onSuccess();
      form.reset();
    },
  });

  return (
    <form
      className="flex flex-col gap-4 pt-4"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className="space-y-4">
        <form.Field
          name="content"
          children={(field) => (
            <div>
              <Textarea
                placeholder={t('message:update.fields.content.placeholder')}
                className="min-h-32"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                autoFocus
                onFocus={moveCursorToEnd}
              />

              <FieldError errors={field.state.meta.errors} className="text-xs" />
            </div>
          )}
        />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            {t('common:actions.cancel')}
          </Button>
        </DialogClose>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? t('common:actions.saving') : t('common:actions.save')}
            </Button>
          )}
        />
      </DialogFooter>
    </form>
  );
}
