import { useTranslation } from 'react-i18next';

import { useForm } from '@tanstack/react-form';

import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Textarea } from '@/shared/ui/textarea';

import { useUpdateBio } from '../model/mutation';
import { type UpdateBio, UpdateBioSchema } from '../model/schema';

export function UpdateUserBioCard({ biography }: { biography: string | null }) {
  const mutation = useUpdateBio();
  const { t } = useTranslation(['common', 'user']);

  const form = useForm({
    defaultValues: { biography: biography ?? '' } satisfies UpdateBio,
    validators: { onChange: UpdateBioSchema },
    onSubmit: async ({ value }) => {
      if (value.biography.trim()) await mutation.mutateAsync(value.biography);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{t('user:biography.title')}</CardTitle>
        </CardHeader>

        <CardContent>
          <form.Field
            name="biography"
            children={(field) => (
              <Textarea
                className="min-h-24 w-full resize-none"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                defaultValue={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = 'auto';
                  el.style.height = el.scrollHeight + 'px';
                }}
              />
            )}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button size="sm" type="submit">
            {t('common:actions.save')}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
