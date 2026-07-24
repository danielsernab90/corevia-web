"use client";

import { Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import { useBooking } from "@/components/sections/book-consultation/booking-provider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/i18n/navigation";
import {
  companySizeOptions,
  industryOptions,
  roleOptions,
  serviceOptions,
  type ConsultationFormData,
  type ServiceOption,
} from "@/lib/consultation";
import { cn } from "@/lib/utils";

const FORM_STEPS = 4;
const TOTAL_FLOW_STEPS = 5;

const initialForm: ConsultationFormData = {
  fullName: "",
  businessName: "",
  email: "",
  phone: "",
  industry: "",
  role: "",
  companySize: "",
  services: [],
  otherService: "",
  challenge: "",
};

type FieldErrors = Partial<Record<keyof ConsultationFormData, string>>;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

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

export function BookingModal() {
  const t = useTranslations("BookConsultation.modal");
  const tConfirm = useTranslations("BookConsultation.confirmation");
  const { open, setOpen } = useBooking();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ConsultationFormData>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});

  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL?.trim() ?? "";

  const reset = useCallback(() => {
    setStep(0);
    setForm(initialForm);
    setErrors({});
  }, []);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next);
      if (!next) {
        // Delay reset so close animation finishes cleanly
        window.setTimeout(reset, 280);
      }
    },
    [reset, setOpen]
  );

  useEffect(() => {
    if (!open || step !== 4) return;

    const onMessage = (event: MessageEvent) => {
      const data = event.data as { event?: string } | undefined;
      if (data?.event === "calendly.event_scheduled") {
        setStep(5);
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [open, step]);

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
      if (!form.fullName.trim()) nextErrors.fullName = t("errors.required");
      if (!form.businessName.trim())
        nextErrors.businessName = t("errors.required");
      if (!form.email.trim()) nextErrors.email = t("errors.required");
      else if (!isValidEmail(form.email)) nextErrors.email = t("errors.email");
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

    if (current === 3) {
      if (!form.challenge.trim()) nextErrors.challenge = t("errors.required");
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep((prev) => Math.min(prev + 1, TOTAL_FLOW_STEPS));
  };

  const goBack = () => {
    setErrors({});
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    goNext();
  };

  const calendlySrc = useMemo(() => {
    if (!calendlyUrl) return "";
    try {
      return buildCalendlySrc(calendlyUrl, form);
    } catch {
      return calendlyUrl;
    }
  }, [calendlyUrl, form]);

  const progressLabel =
    step <= 3
      ? t("stepOf", { current: step + 1, total: FORM_STEPS })
      : step === 4
        ? t("steps.schedule.title")
        : tConfirm("title");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogPopup
        className={cn(step >= 4 && step < 5 ? "max-w-3xl" : "max-w-xl")}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-caption font-medium tracking-wide text-muted-foreground uppercase">
              {progressLabel}
            </p>
            {step <= 3 ? (
              <>
                <DialogTitle className="mt-1">
                  {step === 0
                    ? t("steps.contact.title")
                    : step === 1
                      ? t("steps.business.title")
                      : step === 2
                        ? t("steps.services.title")
                        : t("steps.challenge.title")}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  {step === 0
                    ? t("steps.contact.description")
                    : step === 1
                      ? t("steps.business.description")
                      : step === 2
                        ? t("steps.services.description")
                        : t("steps.challenge.description")}
                </DialogDescription>
              </>
            ) : step === 4 ? (
              <>
                <DialogTitle className="mt-1">
                  {t("steps.schedule.title")}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  {t("steps.schedule.description")}
                </DialogDescription>
              </>
            ) : (
              <>
                <DialogTitle className="mt-1">{tConfirm("title")}</DialogTitle>
                <DialogDescription className="mt-1">
                  {tConfirm("description")}
                </DialogDescription>
              </>
            )}
          </div>

          <DialogClose
            aria-label={t("close")}
            className={cn(
              "inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            )}
          >
            <X className="size-4" />
          </DialogClose>
        </div>

        {step <= 3 ? (
          <form
            onSubmit={onSubmit}
            className="flex min-h-0 flex-1 flex-col"
            noValidate
          >
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              {step === 0 ? (
                <div className="space-y-4">
                  <Field
                    id="fullName"
                    label={t("fields.fullName")}
                    error={errors.fullName}
                  >
                    <Input
                      id="fullName"
                      autoComplete="name"
                      value={form.fullName}
                      aria-invalid={Boolean(errors.fullName)}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      className="h-10"
                    />
                  </Field>
                  <Field
                    id="businessName"
                    label={t("fields.businessName")}
                    error={errors.businessName}
                  >
                    <Input
                      id="businessName"
                      autoComplete="organization"
                      value={form.businessName}
                      aria-invalid={Boolean(errors.businessName)}
                      onChange={(e) =>
                        updateField("businessName", e.target.value)
                      }
                      className="h-10"
                    />
                  </Field>
                  <Field
                    id="email"
                    label={t("fields.email")}
                    error={errors.email}
                  >
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      aria-invalid={Boolean(errors.email)}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="h-10"
                    />
                  </Field>
                  <Field
                    id="phone"
                    label={t("fields.phone")}
                    hint={t("fields.phoneOptional")}
                  >
                    <Input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="h-10"
                    />
                  </Field>
                </div>
              ) : null}

              {step === 1 ? (
                <div className="space-y-4">
                  <Field
                    id="industry"
                    label={t("fields.industry")}
                    error={errors.industry}
                  >
                    <Select
                      id="industry"
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
                    id="role"
                    label={t("fields.role")}
                    error={errors.role}
                  >
                    <Select
                      id="role"
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
                    id="companySize"
                    label={t("fields.companySize")}
                    error={errors.companySize}
                  >
                    <Select
                      id="companySize"
                      value={form.companySize}
                      aria-invalid={Boolean(errors.companySize)}
                      onChange={(e) =>
                        updateField(
                          "companySize",
                          e.target
                            .value as ConsultationFormData["companySize"]
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
                      id="otherService"
                      label={t("fields.otherService")}
                      error={errors.otherService}
                    >
                      <Textarea
                        id="otherService"
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
                  id="challenge"
                  label={t("fields.challenge")}
                  error={errors.challenge}
                >
                  <Textarea
                    id="challenge"
                    value={form.challenge}
                    aria-invalid={Boolean(errors.challenge)}
                    onChange={(e) => updateField("challenge", e.target.value)}
                    rows={6}
                    className="min-h-36"
                  />
                </Field>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-4 sm:px-6">
              <Button
                type="button"
                variant="ghost"
                onClick={goBack}
                disabled={step === 0}
              >
                {t("back")}
              </Button>
              <Button type="submit" size="lg">
                {step === 3
                  ? t("steps.schedule.continue")
                  : t("continue")}
              </Button>
            </div>
          </form>
        ) : null}

        {step === 4 ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-hidden px-2 pb-2 sm:px-3 sm:pb-3">
              {calendlySrc ? (
                <iframe
                  title={t("steps.schedule.title")}
                  src={calendlySrc}
                  className="h-[min(62dvh,560px)] w-full rounded-xl border border-border bg-background"
                />
              ) : (
                <div className="flex h-[min(40dvh,320px)] items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 px-6 text-center text-sm text-muted-foreground">
                  {t("calendlyUnavailable")}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-4 sm:px-6">
              <Button type="button" variant="ghost" onClick={goBack}>
                {t("back")}
              </Button>
            </div>
          </div>
        ) : null}

        {step === 5 ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">
              <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-success/10 text-success">
                <Check className="size-7" strokeWidth={2.25} />
              </div>
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
                    <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Check className="size-3.5" aria-hidden />
                    </span>
                    <span>{tConfirm(`checklist.${key}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col-reverse gap-3 border-t border-border px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <Link
                href="/"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium hover:bg-surface"
                onClick={() => handleOpenChange(false)}
              >
                {tConfirm("home")}
              </Link>
              <Button type="button" onClick={() => handleOpenChange(false)}>
                {tConfirm("close")}
              </Button>
            </div>
          </div>
        ) : null}
      </DialogPopup>
    </Dialog>
  );
}

function Field({
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
  children: React.ReactNode;
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
