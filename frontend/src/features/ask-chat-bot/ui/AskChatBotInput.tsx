import { useTranslation } from 'react-i18next';

import { useForm } from '@tanstack/react-form';
import { Send } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { FieldError } from '@/shared/ui/field';
import { Textarea } from '@/shared/ui/textarea';

import { useAskChatBotMutation } from '../model/mutation';
import { type AskChatBot, AskChatBotSchema } from '../model/schema';

export function AskChatBotInput() {
  const { t } = useTranslation('message', { keyPrefix: 'send' });
  const mutation = useAskChatBotMutation();

  const form = useForm({
    defaultValues: { prompt: '' } as AskChatBot,
    validators: { onChange: AskChatBotSchema },
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
          name="prompt"
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
                  className="max-h-30 min-h-11 resize-none rounded-2xl pr-12"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      form.handleSubmit();
                    }
                  }}
                />
              </div>

              <FieldError errors={field.state.meta.errors} className="text-xs" />
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
