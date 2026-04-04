import { useTranslation } from 'react-i18next';

import { useForm } from '@tanstack/react-form';
import { Link } from '@tanstack/react-router';

import { Button } from '@/shared/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';

import { useSignInMutation } from '../model/mutation';
import { type SignIn, SignInSchema } from '../model/schema';

export function SignInForm() {
  const mutation = useSignInMutation();
  const { t } = useTranslation('auth', { keyPrefix: 'sign-in' });

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    } satisfies SignIn,
    validators: {
      onChange: SignInSchema,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
    },
  });
  return (
    <form
      id="sign-in"
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground text-sm text-balance">{t('description')}</p>
        </div>
        <form.Field
          name="username"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>{t('fields.username.label')}</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="password"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>{t('fields.password.label')}</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <Field>
          <Button type="submit">{t('submit_btn')}</Button>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            {t('footer.text')}{' '}
            <Link to={'/sign-up'} className="underline underline-offset-4">
              {t('footer.link')}
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
