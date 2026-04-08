import { useTranslation } from 'react-i18next';

import { useForm } from '@tanstack/react-form';
import { Send } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { FieldError } from '@/shared/ui/field';
import { Textarea } from '@/shared/ui/textarea';

import { useCreateConversationMutation } from '../model/mutation';
import { type CreateConversation, CreateConversationSchema } from '../model/schema';

type Props = {
  userId: number;
};

export function CreateConversationForm({ userId }: Props) {
  const { t } = useTranslation('message', { keyPrefix: 'first' });
  const mutation = useCreateConversationMutation();

  const form = useForm({
    defaultValues: { content: '', userId } satisfies CreateConversation,
    validators: { onChange: CreateConversationSchema },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="flex w-full flex-col gap-1.5"
    >
      <form.Field
        name="content"
        children={(field) => (
          <div className="flex w-full flex-col gap-2">
            <FieldError className="text-xs" errors={field.state.meta.errors} />
            <div className="relative flex items-end gap-2">
              <Textarea
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder={t('placeholder')}
                className={`max-h-30 min-h-10 flex-1 resize-none rounded-2xl pr-12`}
                rows={1}
              />

              <form.Subscribe
                selector={(state) => state.isSubmitting}
                children={(isSubmitting) => (
                  <Button
                    type="submit"
                    disabled={isSubmitting || mutation.isPending}
                    className="h-10 w-10 shrink-0 rounded-full"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                )}
              />
            </div>
          </div>
        )}
      />
    </form>
  );
}
