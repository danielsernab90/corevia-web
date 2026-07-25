"use client";

import type { ReactNode } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ConsultationFormData } from "@/lib/consultation";
import {
  isValidEmail,
  isValidPhone,
} from "@/lib/consultation-validation";

export type ContactFormValues = Pick<
  ConsultationFormData,
  "fullName" | "businessName" | "email" | "phone" | "referredBy"
>;

export type ContactFieldErrors = Partial<
  Record<keyof ContactFormValues, string>
>;

export { isValidEmail, isValidPhone };

/** Shared contact-step validation — phone required, business name optional. */
export function validateContactFields(
  form: ContactFormValues,
  messages: {
    required: string;
    email: string;
    phoneRequired: string;
    phone: string;
  }
): ContactFieldErrors {
  const nextErrors: ContactFieldErrors = {};

  if (!form.fullName.trim()) nextErrors.fullName = messages.required;
  if (!form.email.trim()) nextErrors.email = messages.required;
  else if (!isValidEmail(form.email)) nextErrors.email = messages.email;
  if (!form.phone.trim()) nextErrors.phone = messages.phoneRequired;
  else if (!isValidPhone(form.phone)) nextErrors.phone = messages.phone;

  return nextErrors;
}

export function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={id}>{label}</Label>
        {hint ? (
          <span className="text-caption text-muted-foreground">{hint}</span>
        ) : null}
      </div>
      {children}
      {error ? (
        <p className="text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type BookingContactFieldsProps = {
  form: ContactFormValues;
  errors: ContactFieldErrors;
  updateField: <K extends keyof ContactFormValues>(
    key: K,
    value: ContactFormValues[K]
  ) => void;
  labels: {
    fullName: string;
    businessName: string;
    businessNameOptional: string;
    email: string;
    phone: string;
    referredBy: string;
    referredByOptional: string;
    referredByPlaceholder: string;
  };
  /** Prefix ids when embedding beside other forms on the same page. */
  idPrefix?: string;
};

/**
 * Shared contact fields for step 0 of ConsultationFormFlow —
 * single source of truth for contact fields + layout.
 */
export function BookingContactFields({
  form,
  errors,
  updateField,
  labels,
  idPrefix = "",
}: BookingContactFieldsProps) {
  const id = (name: string) => `${idPrefix}${name}`;

  return (
    <div className="space-y-4">
      <Field id={id("fullName")} label={labels.fullName} error={errors.fullName}>
        <Input
          id={id("fullName")}
          autoComplete="name"
          value={form.fullName}
          aria-invalid={Boolean(errors.fullName)}
          onChange={(e) => updateField("fullName", e.target.value)}
          className="h-10"
        />
      </Field>
      <Field
        id={id("businessName")}
        label={labels.businessName}
        hint={labels.businessNameOptional}
        error={errors.businessName}
      >
        <Input
          id={id("businessName")}
          autoComplete="organization"
          value={form.businessName}
          aria-invalid={Boolean(errors.businessName)}
          onChange={(e) => updateField("businessName", e.target.value)}
          className="h-10"
        />
      </Field>
      <Field id={id("email")} label={labels.email} error={errors.email}>
        <Input
          id={id("email")}
          type="email"
          autoComplete="email"
          value={form.email}
          aria-invalid={Boolean(errors.email)}
          onChange={(e) => updateField("email", e.target.value)}
          className="h-10"
        />
      </Field>
      <Field id={id("phone")} label={labels.phone} error={errors.phone}>
        <Input
          id={id("phone")}
          type="tel"
          autoComplete="tel"
          required
          value={form.phone}
          aria-invalid={Boolean(errors.phone)}
          onChange={(e) => updateField("phone", e.target.value)}
          className="h-10"
        />
      </Field>
      <Field
        id={id("referredBy")}
        label={labels.referredBy}
        hint={labels.referredByOptional}
      >
        <Input
          id={id("referredBy")}
          autoComplete="off"
          value={form.referredBy}
          placeholder={labels.referredByPlaceholder}
          onChange={(e) => updateField("referredBy", e.target.value)}
          className="h-10"
        />
      </Field>
    </div>
  );
}
