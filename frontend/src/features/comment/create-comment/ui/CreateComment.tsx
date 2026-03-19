import { useForm } from '@tanstack/react-form';
import { Send } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

import { useCreateCommentMutation } from '../api/queries';
import { type CreateComment, CreateCommentSchema } from '../model/schema';

type Props = {
  entityType: string;
  entityId: number;
};

export function CreateComment({ entityId, entityType }: Props) {
  const mutation = useCreateCommentMutation();

  const form = useForm({
    defaultValues: { commentary: '' } as CreateComment,
    validators: { onChange: CreateCommentSchema },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync({ commentary: value.commentary, entityId, entityType });
      form.reset();
    },
  });

  return (
    <form
      className="relative flex items-start w-full gap-2"
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="commentary"
        children={field => (
          <div className="flex flex-col w-full relative">
            <Input
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={e => field.handleChange(e.target.value)}
              placeholder="Write a comment..."
              className={cn(
                'pr-10 transition-all',
                (field.state.meta.isTouched || field.state.meta.errors.length > 0) &&
                  field.state.meta.errors.length > 0 &&
                  'border-destructive focus-visible:ring-destructive',
              )}
            />

            {field.state.meta.errors.length > 0 && (
              <p className="absolute -bottom-5 left-0 text-[10px] font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                {field.state.meta.errors[0]?.message?.toString()}
              </p>
            )}
          </div>
        )}
      />

      <form.Subscribe
        selector={state => ({
          isSubmitting: state.isSubmitting,
          value: state.values.commentary,
        })}
        children={({ isSubmitting, value }) => (
          <Button
            type="submit"
            size="icon"
            variant="secondary"
            disabled={!value.trim() || isSubmitting}
          >
            <Send className="w-4 h-4" />
          </Button>
        )}
      />
    </form>
  );
}
