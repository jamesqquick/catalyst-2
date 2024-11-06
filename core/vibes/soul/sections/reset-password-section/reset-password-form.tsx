'use client';

import { getFormProps, getInputProps, SubmissionResult, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';

import { Input } from '@/vibes/soul/form/input';
import { Button } from '@/vibes/soul/primitives/button';

import { schema } from './schema';

type Action<State, Payload> = (state: Awaited<State>, payload: Payload) => State | Promise<State>;

export type ResetPasswordAction = Action<SubmissionResult | null, FormData>;

interface Props {
  action: ResetPasswordAction;
  submitLabel?: string;
}

export function ResetPasswordForm({ action, submitLabel = 'Update' }: Props) {
  const [lastResult, formAction, isPending] = useFormState(action, null);
  const [form, fields] = useForm({
    constraint: getZodConstraint(schema),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  useEffect(() => {
    if (lastResult?.error) {
      console.log(lastResult.error);
    }
  }, [lastResult]);

  return (
    <form {...getFormProps(form)} action={formAction} className="space-y-5">
      <Input
        {...getInputProps(fields.password, { type: 'password' })}
        errors={fields.password.errors}
        key={fields.password.id}
        label="Password"
      />
      <Input
        {...getInputProps(fields.confirmPassword, { type: 'password' })}
        className="mb-6"
        errors={fields.confirmPassword.errors}
        key={fields.confirmPassword.id}
        label="Confirm password"
      />
      <Button loading={isPending} size="small" type="submit" variant="secondary">
        {submitLabel}
      </Button>
    </form>
  );
}
