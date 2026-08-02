"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  BookingContactFields,
  Field,
  validateContactFields,
} from "@/components/sections/book-consultation/booking-form-shared";
import { BrandCheckBadge } from "@/components/shared/brand-check-badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DialogClose,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/i18n/navigation";
import {
  companySizeOptions,
  industryOptions,
  isBusinessCardLeadSource,
  leadSourceOptions,
  roleOptions,
  serviceOptions,
  type ConsultationFormData,
  type LeadSourceOption,
  type ServiceOption,
} from "@/lib/consultation";
import { getCalendlyBookingUrl } from "@/lib/calendly";
import { cn } from "@/lib/utils";

/** Four data-collection steps (contact → challenge). */
const FORM_STEPS = 4;
/** Schedule step index (optional Calendly + Done submit). */
const SCHEDULE_STEP = 4;
/** Confirmation after successful /api/inquiry. */
const CONFIRMATION_STEP = 5;

const initialForm: ConsultationFormData = {
  fullName: "",
  businessName: "",
  email: "",
  phone: "",
  referredBy: "",
  leadSource: "",
  businessCardFrom: null,
  industry: "",
  role: "",
  companySize: "",
  services: [],
  otherService: "",
  challenge: "",
};

type FieldErrors = Partial<Record<keyof ConsultationFormData, string>>;

function buildCalendlySrc(
  baseUrl: string,
  data: ConsultationFormData
): string {
  const url = new URL(baseUrl);
  url.searchParams.set("hide_gdpr_banner", "1");
  if (data.fullName) url.searchParams.set("name", data.fullName);
  if (data.email) url.searchParams.set("email", data.email);
  return url.toString();
}

export type ConsultationFormFlowProps = {
  /**
   * `modal` — used inside BookingModal Dialog (DialogTitle/Close).
   * `inline` — embedded card on Services / Contact.
   */
  variant?: "modal" | "inline";
  /** Unique id prefix so multiple embeds never collide. */
  idPrefix?: string;
  /**
   * Footer action alignment for the Continue/Finish button.
   * `spread` (default) — Back left, Continue right (modal + Contact).
   * `center` — Continue horizontally centered; Back stays left (Services only).
   */
  actionsAlign?: "spread" | "center";
  active?: boolean;
  onRequestClose?: () => void;
  onStepChange?: (step: number) => void;
  className?: string;
};

/**
 * Canonical consultation flow:
 * steps 0–3 collect data → step 4 optional Calendly + Done submits
 * /api/inquiry → step 5 confirmation only after a successful persist.
 * Calendly postMessage never gates success.
 */
export function ConsultationFormFlow({
  variant = "inline",
  idPrefix = "",
  actionsAlign = "spread",
  onRequestClose,
  onStepChange,
  className,
}: ConsultationFormFlowProps) {
  const t = useTranslations("BookConsultation.modal");
  const tConfirm = useTranslations("BookConsultation.confirmation");

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ConsultationFormData>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  /**
   * Records whether Calendly confirmed a real booking, so the notification
   * email can say which path the client took. This never gates submission —
   * Finish always works, scheduled or not.
   */
  const [scheduledViaCalendly, setScheduledViaCalendly] = useState(false);
  const calendlyUrl = getCalendlyBookingUrl();
  const hasCalendly = Boolean(calendlyUrl);
  const isModal = variant === "modal";
  const isSchedule = step === SCHEDULE_STEP;
  const isConfirmation = step === CONFIRMATION_STEP;

  const calendlySrc = useMemo(() => {
    if (!calendlyUrl) return "";
    try {
      return buildCalendlySrc(calendlyUrl, form);
    } catch {
      return calendlyUrl;
    }
  }, [calendlyUrl, form]);

  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);

  // Listen for Calendly's booking confirmation only to record the path taken.
  useEffect(() => {
    if (!hasCalendly) return;

    const onMessage = (event: MessageEvent) => {
      if (typeof event.origin === "string" && !event.origin.includes("calendly.com")) {
        return;
      }
      const eventName = (event.data as { event?: unknown } | null)?.event;
      if (eventName === "calendly.event_scheduled") {
        setScheduledViaCalendly(true);
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [hasCalendly]);

  const updateField = <K extends keyof ConsultationFormData>(
    key: K,
    value: ConsultationFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const toggleService = (service: ServiceOption, checked: boolean) => {
    setForm((prev) => {
      const services = checked
        ? [...prev.services, service]
        : prev.services.filter((item) => item !== service);
      return {
        ...prev,
        services,
        otherService: service === "other" && !checked ? "" : prev.otherService,
      };
    });
    setErrors((prev) => {
      if (!prev.services && !prev.otherService) return prev;
      const next = { ...prev };
      delete next.services;
      delete next.otherService;
      return next;
    });
  };

  const validateStep = (current: number): boolean => {
    const nextErrors: FieldErrors = {};

    if (current === 0) {
      Object.assign(
        nextErrors,
        validateContactFields(form, {
          required: t("errors.required"),
          email: t("errors.email"),
          phoneRequired: t("errors.phoneRequired"),
          phone: t("errors.phone"),
        })
      );
    }

    if (current === 1) {
      if (!form.industry) nextErrors.industry = t("errors.required");
      if (!form.role) nextErrors.role = t("errors.required");
      if (!form.companySize) nextErrors.companySize = t("errors.required");
    }

    if (current === 2) {
      if (form.services.length === 0) nextErrors.services = t("errors.services");
      if (form.services.includes("other") && !form.otherService.trim()) {
        nextErrors.otherService = t("errors.otherService");
      }
    }

    // Step 3 (challenge) is optional — no validation.

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submitInquiry = async () => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          // Hidden attribution follow-up must serialize as null for CRM.
          businessCardFrom: isBusinessCardLeadSource(form.leadSource)
            ? (form.businessCardFrom ?? "").trim()
            : null,
          scheduledViaCalendly,
        }),
      });

      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        console.error("[inquiry] API error:", response.status, payload);
        setSubmitError(payload?.error ?? t("submitError"));
        return;
      }

      setStep(CONFIRMATION_STEP);
    } catch (error) {
      console.error("[inquiry] Network error:", error);
      setSubmitError(t("submitError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setSubmitError(null);
    // After challenge (step 3) → schedule; otherwise stay within 0–3.
    setStep((prev) => Math.min(prev + 1, SCHEDULE_STEP));
  };

  const goBack = () => {
    setErrors({});
    setSubmitError(null);
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (isSchedule) {
      void submitInquiry();
      return;
    }
    goNext();
  };

  const handleClose = useCallback(() => {
    onRequestClose?.();
  }, [onRequestClose]);

  const progressLabel = t("stepOf", { current: step + 1, total: FORM_STEPS });

  const stepTitle =
    step === 0
      ? t("steps.contact.title")
      : step === 1
        ? t("steps.business.title")
        : step === 2
          ? t("steps.services.title")
          : t("steps.challenge.title");

  const stepDescription =
    step === 0
      ? t("steps.contact.description")
      : step === 1
        ? t("steps.business.description")
        : step === 2
          ? t("steps.services.description")
          : t("steps.challenge.description");

  const Title = isModal ? DialogTitle : "h2";
  const Description = isModal ? DialogDescription : "p";

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden bg-background",
        variant === "inline" && "rounded-2xl border border-border",
        className
      )}
      style={
        variant === "inline"
          ? {
              boxShadow:
                "0 1px 2px rgb(11 15 25 / 0.04), 0 0 24px rgba(22, 82, 240, 0.25)",
            }
          : undefined
      }
    >
      <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
        <div className="min-w-0">
          {!isSchedule && !isConfirmation ? (
            <p className="text-caption font-medium tracking-wide text-muted-foreground uppercase">
              {progressLabel}
            </p>
          ) : null}
          {isConfirmation ? (
            <>
              <Title className="font-sans text-h3 font-semibold tracking-tight text-foreground">
                {tConfirm("title")}
              </Title>
              <Description className="mt-1 text-sm text-muted-foreground">
                {tConfirm("description")}
              </Description>
            </>
          ) : isSchedule ? (
            <>
              <Title className="font-sans text-h3 font-semibold tracking-tight text-foreground">
                {t("steps.schedule.title")}
              </Title>
              <Description className="mt-1 text-sm text-muted-foreground">
                {hasCalendly
                  ? t("steps.schedule.optionalHint")
                  : t("steps.schedule.description")}
              </Description>
            </>
          ) : (
            <>
              <Title className="mt-1 font-sans text-h3 font-semibold tracking-tight text-foreground">
                {stepTitle}
              </Title>
              <Description className="mt-1 text-sm text-muted-foreground">
                {stepDescription}
              </Description>
            </>
          )}
        </div>

        {isModal ? (
          <DialogClose
            aria-label={t("close")}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <X className="size-4" />
          </DialogClose>
        ) : null}
      </div>

      {!isConfirmation ? (
        <form
          onSubmit={onSubmit}
          className="flex min-h-0 flex-1 flex-col"
          noValidate
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            {step === 0 ? (
              <BookingContactFields
                form={form}
                errors={errors}
                updateField={updateField}
                idPrefix={idPrefix}
                labels={{
                  fullName: t("fields.fullName"),
                  businessName: t("fields.businessName"),
                  businessNameOptional: t("fields.businessNameOptional"),
                  email: t("fields.email"),
                  phone: t("fields.phone"),
                  referredBy: t("fields.referredBy"),
                  referredByOptional: t("fields.referredByOptional"),
                  referredByPlaceholder: t("fields.referredByPlaceholder"),
                  leadSource: t("fields.leadSource"),
                  businessCardFrom: t("fields.businessCardFrom"),
                  businessCardFromOptional: t("fields.businessCardFromOptional"),
                  selectPlaceholder: t("fields.selectPlaceholder"),
                  leadSources: Object.fromEntries(
                    leadSourceOptions.map((key) => [
                      key,
                      t(`leadSources.${key}`),
                    ])
                  ) as Record<LeadSourceOption, string>,
                }}
              />
            ) : null}

            {step === 1 ? (
              <div className="space-y-4">
                <Field
                  id={`${idPrefix}industry`}
                  label={t("fields.industry")}
                  error={errors.industry}
                >
                  <Select
                    id={`${idPrefix}industry`}
                    value={form.industry}
                    aria-invalid={Boolean(errors.industry)}
                    onChange={(e) =>
                      updateField(
                        "industry",
                        e.target.value as ConsultationFormData["industry"]
                      )
                    }
                  >
                    <option value="">{t("fields.selectPlaceholder")}</option>
                    {industryOptions.map((key) => (
                      <option key={key} value={key}>
                        {t(`industries.${key}`)}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field
                  id={`${idPrefix}role`}
                  label={t("fields.role")}
                  error={errors.role}
                >
                  <Select
                    id={`${idPrefix}role`}
                    value={form.role}
                    aria-invalid={Boolean(errors.role)}
                    onChange={(e) =>
                      updateField(
                        "role",
                        e.target.value as ConsultationFormData["role"]
                      )
                    }
                  >
                    <option value="">{t("fields.selectPlaceholder")}</option>
                    {roleOptions.map((key) => (
                      <option key={key} value={key}>
                        {t(`roles.${key}`)}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field
                  id={`${idPrefix}companySize`}
                  label={t("fields.companySize")}
                  error={errors.companySize}
                >
                  <Select
                    id={`${idPrefix}companySize`}
                    value={form.companySize}
                    aria-invalid={Boolean(errors.companySize)}
                    onChange={(e) =>
                      updateField(
                        "companySize",
                        e.target.value as ConsultationFormData["companySize"]
                      )
                    }
                  >
                    <option value="">{t("fields.selectPlaceholder")}</option>
                    {companySizeOptions.map((key) => (
                      <option key={key} value={key}>
                        {t(`companySizes.${key}`)}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-4">
                <div
                  className="grid gap-3 sm:grid-cols-2"
                  role="group"
                  aria-label={t("steps.services.title")}
                >
                  {serviceOptions.map((key) => {
                    const checked = form.services.includes(key);
                    return (
                      <label
                        key={key}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-background p-3 transition-colors hover:border-primary/30",
                          checked && "border-primary/40 bg-primary/5"
                        )}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(value) =>
                            toggleService(key, value === true)
                          }
                          className="mt-0.5"
                        />
                        <span className="text-sm leading-snug text-foreground">
                          {t(`services.${key}`)}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {errors.services ? (
                  <p className="text-sm text-error" role="alert">
                    {errors.services}
                  </p>
                ) : null}
                {form.services.includes("other") ? (
                  <Field
                    id={`${idPrefix}otherService`}
                    label={t("fields.otherService")}
                    error={errors.otherService}
                  >
                    <Textarea
                      id={`${idPrefix}otherService`}
                      value={form.otherService}
                      aria-invalid={Boolean(errors.otherService)}
                      onChange={(e) =>
                        updateField("otherService", e.target.value)
                      }
                      rows={3}
                    />
                  </Field>
                ) : null}
              </div>
            ) : null}

            {step === 3 ? (
              <Field
                id={`${idPrefix}challenge`}
                label={t("fields.challenge")}
                error={errors.challenge}
              >
                <Textarea
                  id={`${idPrefix}challenge`}
                  value={form.challenge}
                  aria-invalid={Boolean(errors.challenge)}
                  onChange={(e) => updateField("challenge", e.target.value)}
                  rows={6}
                  className="min-h-36"
                />
              </Field>
            ) : null}

            {isSchedule ? (
              <div className="space-y-4">
                {hasCalendly && calendlySrc ? (
                  <iframe
                    title={t("steps.schedule.title")}
                    src={calendlySrc}
                    className="h-[min(52dvh,480px)] w-full rounded-xl border border-border bg-background"
                  />
                ) : (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t("steps.schedule.doneHint")}
                  </p>
                )}
              </div>
            ) : null}

            {submitError ? (
              <p className="mt-4 text-sm text-error" role="alert">
                {submitError}
              </p>
            ) : null}
          </div>

          <div
            className={cn(
              "relative flex items-center gap-3 border-t border-border px-5 py-4 sm:px-6",
              actionsAlign === "center" ? "justify-center" : "justify-between"
            )}
          >
            <Button
              type="button"
              variant="ghost"
              onClick={goBack}
              disabled={step === 0 || isSubmitting}
              className={
                actionsAlign === "center" ? "absolute left-5 sm:left-6" : undefined
              }
            >
              {t("back")}
            </Button>
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSchedule
                ? isSubmitting
                  ? t("submitting")
                  : t("finish")
                : step === 3
                  ? t("steps.schedule.continue")
                  : t("continue")}
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">
            <BrandCheckBadge
              className="mx-auto mb-6 size-14 rounded-full"
              iconClassName="size-7"
              strokeWidth={2.25}
            />
            <p className="font-medium text-foreground">
              {tConfirm("prepTitle")}
            </p>
            <ul className="mt-4 space-y-3">
              {(
                ["challenges", "software", "tasks", "goals"] as const
              ).map((key) => (
                <li
                  key={key}
                  className="flex gap-3 text-sm text-muted-foreground"
                >
                  <BrandCheckBadge className="mt-0.5" />
                  <span>{tConfirm(`checklist.${key}`)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col-reverse gap-3 border-t border-border px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium hover:bg-surface"
              onClick={handleClose}
            >
              {tConfirm("home")}
            </Link>
            {onRequestClose ? (
              <Button type="button" onClick={handleClose}>
                {tConfirm("close")}
              </Button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
