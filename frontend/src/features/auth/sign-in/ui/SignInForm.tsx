import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';

import { IS_AUTH_MARKER } from '@/shared/config';
import { Button } from '@/shared/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';

import { login } from '../api/login';
import { type SignIn, signInSchema } from '../model/schema';

export function SignInForm() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      localStorage.setItem(IS_AUTH_MARKER, 'true');
      navigate({ to: '/' });
    },
    onError: error => {
      console.error(error);
    },
  });

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    } satisfies SignIn,
    validators: {
      onChange: signInSchema,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
    },
  });
  return (
    <form
      id="sign-in"
      className="flex flex-col gap-6"
      onSubmit={e => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        <form.Field
          name="username"
          children={field => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
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
          children={field => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <Field>
          <Button type="submit">Login</Button>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            Don't have an account?{' '}
            <Link to={'/sign-up'} className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
