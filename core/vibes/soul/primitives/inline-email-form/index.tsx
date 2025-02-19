'use client';

import { getFormProps, getInputProps, SubmissionResult, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { useFormState as useActionState } from 'react-dom';

import { ErrorMessage } from '../../form/error-message';
import { Button } from '../button';
import { schema } from './schema';

type Action<State, Payload> = (
  prevState: Awaited<State>,
  formData: Payload,
) => State | Promise<State>;

export function InlineEmailForm({
  className,
  action,
  submitLabel = 'Submit',
  placeholder = 'Enter your email',
}: {
  className?: string;
  placeholder?: string;
  submitLabel?: string;
  action: Action<SubmissionResult | null, FormData>;
}) {
  const [lastResult, formAction, isPending] = useActionState(action, null);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
  });

  useEffect(() => {
    if (lastResult?.error) {
      console.log(lastResult.error);
    }
  }, [lastResult]);

  const { errors } = fields.email;

  return (
    <form {...getFormProps(form)} action={formAction} className={className}>
      <div
        className={clsx(
          'relative rounded-xl border bg-background text-base transition-colors duration-200 focus-within:border-primary focus:outline-none',
          errors?.length ? 'border-error' : 'border-black',
        )}
      >
        <input
          {...getInputProps(fields.email, { type: 'email' })}
          className="placeholder-contrast-gray-500 h-14 w-full bg-transparent pl-5 pr-16 text-foreground placeholder:font-normal focus:outline-none"
          key={fields.email.id}
          placeholder={placeholder}
        />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pr-2">
          <Button
            aria-label={submitLabel}
            loading={isPending}
            size="icon"
            type="submit"
            variant="secondary"
          >
            <ArrowRight size={20} strokeWidth={1.5} />
          </Button>
        </div>
      </div>
      {errors &&
        errors.length > 0 &&
        errors.map((error, index) => <ErrorMessage key={index}>{error}</ErrorMessage>)}
    </form>
  );
}
