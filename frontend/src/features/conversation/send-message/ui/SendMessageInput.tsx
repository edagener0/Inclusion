import { useTranslation } from 'react-i18next';

import { useForm } from '@tanstack/react-form';
import { Send } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { FieldError } from '@/shared/ui/field';
import { Textarea } from '@/shared/ui/textarea';

import { useSendMessageMutation } from '../model/mutation';
import { type SendMessage, SendMessageSchema } from '../model/schema';

type Props = {
  userId: number;
};

export function SendMessageInput({ userId }: Props) {
  const { t } = useTranslation('message', { keyPrefix: 'send' });
  const mutation = useSendMessageMutation(userId);

  const form = useForm({
    defaultValues: { content: '' } as SendMessage,
    validators: { onChange: SendMessageSchema },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
      form.reset();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="w-full"
    >
      <div className="flex items-end gap-2">
        <form.Field
          name="content"
          children={(field) => (
            <div className="flex flex-1 flex-col gap-1">
              <div className="relative">
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={t('placeholder')}
                  className={cn(
                    'max-h-30 min-h-11 resize-none rounded-2xl pr-12',
                    field.state.meta.errors.length > 0 &&
                      'border-destructive focus-visible:ring-destructive',
                  )}
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      form.handleSubmit();
                    }
                  }}
                />
              </div>

              <FieldError errors={field.state.meta.errors} className="px-2 text-[10px]" />
            </div>
          )}
        />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              size="icon"
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="mb-0.5 h-10 w-10 shrink-0 rounded-full"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        />
      </div>
    </form>
  );
}
