import { useTranslation } from 'react-i18next';

import { useForm } from '@tanstack/react-form';

import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Checkbox } from '@/shared/ui/checkbox';

import { useUpdateAccountPrivacy } from '../model/mutation';
import { type AccountPrivacy, AccountPrivacySchema } from '../model/schema';

export function UserPrivacyToggle({ isPrivate }: { isPrivate: boolean }) {
  const mutation = useUpdateAccountPrivacy();
  const { t } = useTranslation(['common', 'user']);

  const form = useForm({
    defaultValues: { isPrivate } satisfies AccountPrivacy,
    validators: { onChange: AccountPrivacySchema },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value.isPrivate);
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
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>{t('user:privacy.form.title')}</CardTitle>
          <CardDescription>{t('user:privacy.form.description')}</CardDescription>
        </CardHeader>

        <CardContent>
          <form.Field
            name="isPrivate"
            children={field => (
              <label
                htmlFor={field.name}
                className="group flex items-start space-x-4 rounded-lg border border-border p-4 cursor-pointer transition-colors hover:bg-muted/50"
              >
                <Checkbox
                  id={field.name}
                  name={field.name}
                  checked={field.state.value}
                  onCheckedChange={checked => field.handleChange(!!checked)}
                  disabled={mutation.isPending}
                  className="mt-1 transition-transform group-hover:scale-105"
                />
                <div className="space-y-1.5 leading-none">
                  <span className="text-base font-semibold block">
                    {t('user:privacy.form.isPrivate.title')}
                  </span>
                  <p className="text-sm font-normal text-muted-foreground">
                    {t('user:privacy.form.isPrivate.description')}
                  </p>
                </div>
              </label>
            )}
          />
        </CardContent>

        <CardFooter className="flex justify-end border-t bg-muted/50 px-6 py-4">
          <Button size="sm" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? t('common:actions.saving') : t('common:actions.save')}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
