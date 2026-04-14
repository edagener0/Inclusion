import { useForm } from '@tanstack/react-form';
import { Send } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { FieldError } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';

import { useCreateCommentMutation } from '../model/mutation';
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
      className="relative flex w-full items-start gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="commentary"
        children={(field) => (
          <div className="relative flex w-full flex-col">
            <Input
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Write a comment..."
              className="pr-10 transition-all"
            />

            <FieldError errors={field.state.meta.errors} className="text-xs" />
          </div>
        )}
      />

      <form.Subscribe
        selector={(state) => ({
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
            <Send className="h-4 w-4" />
          </Button>
        )}
      />
    </form>
  );
}
