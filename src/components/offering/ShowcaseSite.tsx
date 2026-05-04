import { useEffect, useMemo, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ACCEPTED_IMAGE_ATTR,
  buildShowcaseFormData,
  clearStorageDraft,
  findFirstInvalidStep,
  getStorageDraft,
  INITIAL_STATE,
  INITIAL_STEP,
  MAX_COLORS,
  MAX_CUSTOM_SECTIONS,
  MAX_FILE_SIZE_LABEL,
  MAX_PHOTOS_TOTAL_BYTES,
  MAX_PHOTOS_TOTAL_LABEL,
  setStorageDraft,
  TOTAL_STEPS,
  validateImageFile,
  validateStep,
  type BrandAssets,
  type Deadline,
  type FieldErrors,
  type Goal,
  type HasDomain,
  type Photos,
  type ShowcaseFormData,
} from "./ShowcaseSite.constants";

export type { ShowcaseFormData };

type TechnicalItem = { name: string; desc: string };
type Option = { label: string; value: string };

type Props = {
  onFormSubmit?: (data: ShowcaseFormData) => Promise<void>;
};

const SHOWCASE_FORM_ENDPOINT = `${import.meta.env.VITE_API_BASE_URL}/form/showcase-form`;

const submitShowcaseForm = async (data: ShowcaseFormData): Promise<void> => {
  const response = await fetch(SHOWCASE_FORM_ENDPOINT, {
    method: "POST",
    body: buildShowcaseFormData(data),
  });
  if (!response.ok) {
    throw new Error(`Showcase form submission failed: ${response.status}`);
  }
};

const hasMeaningfulContent = (data: ShowcaseFormData): boolean =>
  !!(
    data.projectName.trim() ||
    data.activity.trim() ||
    data.audience.trim() ||
    data.inspirations.trim() ||
    data.notes.trim() ||
    data.firstName.trim() ||
    data.lastName.trim() ||
    data.email.trim() ||
    data.phone.trim() ||
    data.domainName.trim() ||
    data.goal ||
    data.brandAssets ||
    data.photos ||
    data.deadline ||
    data.hasDomain ||
    data.adjectives.length ||
    data.colors.length ||
    data.customSections.length ||
    data.logoFile ||
    data.photoFiles.length
  );

const ShowcaseSite = ({
  onFormSubmit = submitShowcaseForm,
}: Props) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "fr" ? "fr" : "en";
  const ns = "offering.offerings.showcase_site";

  const features = useMemo(
    () => t(`${ns}.features`, { returnObjects: true }) as string[],
    [t],
  );
  const technical = useMemo(
    () => t(`${ns}.technical`, { returnObjects: true }) as TechnicalItem[],
    [t],
  );
  const goalOptions = useMemo(
    () => t(`${ns}.form.section_activity.goal_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const adjectiveOptions = useMemo(
    () => t(`${ns}.form.section_visual.adjective_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const brandOptions = useMemo(
    () => t(`${ns}.form.section_content.brand_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const photosOptions = useMemo(
    () => t(`${ns}.form.section_content.photos_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const sectionsOptions = useMemo(
    () => t(`${ns}.form.section_content.sections_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const deadlineOptions = useMemo(
    () => t(`${ns}.form.section_practical.deadline_options`, { returnObjects: true }) as Option[],
    [t],
  );

  const [formData, setFormData] = useState<ShowcaseFormData>(INITIAL_STATE);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [colorDraft, setColorDraft] = useState("#000000");
  const [customSectionDraft, setCustomSectionDraft] = useState("");
  const [currentStep, setCurrentStep] = useState(INITIAL_STEP);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const isFirstRender = useRef(true);
  const draftRestoredRef = useRef(false);

  // Restore draft from localStorage on mount (skipped in DEV to keep prefill intact)
  useEffect(() => {
    if (import.meta.env.DEV || draftRestoredRef.current) return;
    draftRestoredRef.current = true;
    const draft = getStorageDraft();
    if (!draft) return;
    setFormData((prev) => ({ ...prev, ...draft, logoFile: null, photoFiles: [] }));
    toast(t(`${ns}.form.draft_restored`));
  }, [t, ns]);

  // Persist draft (debounced); clear when form is empty
  useEffect(() => {
    if (import.meta.env.DEV) return;
    const id = window.setTimeout(() => {
      if (hasMeaningfulContent(formData)) {
        setStorageDraft(formData);
      } else {
        clearStorageDraft();
      }
    }, 300);
    return () => window.clearTimeout(id);
  }, [formData]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentStep]);

  const clearError = (key: keyof ShowcaseFormData) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const updateField = <K extends keyof ShowcaseFormData>(
    key: K,
    value: ShowcaseFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    clearError(key);
  };

  const addColor = () => {
    if (formData.colors.length >= MAX_COLORS) {
      toast.error(t(`${ns}.form.error_max_colors`, { max: MAX_COLORS }));
      return;
    }
    setFormData((prev) => {
      if (prev.colors.includes(colorDraft)) return prev;
      return { ...prev, colors: [...prev.colors, colorDraft] };
    });
  };

  const removeColor = (color: string) => {
    setFormData((prev) => ({ ...prev, colors: prev.colors.filter((c) => c !== color) }));
  };

  const toggleAdjective = (value: string) => {
    setFormData((prev) => {
      if (prev.adjectives.includes(value)) {
        return { ...prev, adjectives: prev.adjectives.filter((v) => v !== value) };
      }
      if (prev.adjectives.length >= 2) return prev;
      return { ...prev, adjectives: [...prev.adjectives, value] };
    });
  };

  const toggleSection = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.includes(value)
        ? prev.sections.filter((v) => v !== value)
        : [...prev.sections, value],
    }));
  };

  const addCustomSection = () => {
    const trimmed = customSectionDraft.trim();
    if (!trimmed) return;
    if (formData.customSections.length >= MAX_CUSTOM_SECTIONS) {
      toast.error(t(`${ns}.form.error_max_custom_sections`, { max: MAX_CUSTOM_SECTIONS }));
      return;
    }
    setFormData((prev) => {
      if (prev.customSections.includes(trimmed)) return prev;
      return { ...prev, customSections: [...prev.customSections, trimmed] };
    });
    setCustomSectionDraft("");
  };

  const removeCustomSection = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      customSections: prev.customSections.filter((v) => v !== value),
    }));
  };

  const handleLogoChange = (file: File | null) => {
    if (!file) {
      updateField("logoFile", null);
      return;
    }
    const error = validateImageFile(file);
    if (error) {
      toast.error(t(`${ns}.form.${error}`, { max: MAX_FILE_SIZE_LABEL }));
      return;
    }
    updateField("logoFile", file);
  };

  const handlePhotosAdd = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const accepted: File[] = [];
    let totalSize = formData.photoFiles.reduce((sum, f) => sum + f.size, 0);
    for (const file of Array.from(files)) {
      const err = validateImageFile(file);
      if (err) {
        toast.error(t(`${ns}.form.${err}`, { max: MAX_FILE_SIZE_LABEL }));
        continue;
      }
      if (totalSize + file.size > MAX_PHOTOS_TOTAL_BYTES) {
        toast.error(t(`${ns}.form.error_photos_total_too_large`, { max: MAX_PHOTOS_TOTAL_LABEL }));
        break;
      }
      accepted.push(file);
      totalSize += file.size;
    }
    if (accepted.length > 0) {
      updateField("photoFiles", [...formData.photoFiles, ...accepted]);
    }
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photoFiles: prev.photoFiles.filter((_, i) => i !== index),
    }));
  };

  const goNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const result = validateStep(currentStep, formData);
    if (!result.ok) {
      setFieldErrors((prev) => ({ ...prev, ...result.errors }));
      toast.error(t(`${ns}.form.error_step_required`));
      return;
    }
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const goPrev = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (
      e.key === "Enter" &&
      currentStep < TOTAL_STEPS &&
      e.target instanceof HTMLInputElement
    ) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const failingStep = findFirstInvalidStep(formData);
    if (failingStep !== null) {
      const allErrors: FieldErrors = {};
      for (let s = 1; s <= TOTAL_STEPS; s++) {
        Object.assign(allErrors, validateStep(s, formData).errors);
      }
      setFieldErrors(allErrors);
      setCurrentStep(failingStep);
      toast.error(
        t(`${ns}.form.error_step_jump`, {
          step: failingStep,
          title: t(`${ns}.form.step_titles.${failingStep}`),
        }),
      );
      return;
    }
    setSubmitting(true);
    try {
      await onFormSubmit(formData);
      toast.success(t(`${ns}.form.success`));
      clearStorageDraft();
      setFormData(INITIAL_STATE);
      setFieldErrors({});
      setCurrentStep(1);
    } catch {
      toast.error(t(`${ns}.form.error_submit`));
    } finally {
      setSubmitting(false);
    }
  };

  const errorClass = (key: keyof ShowcaseFormData) =>
    fieldErrors[key] ? "border-destructive focus-visible:ring-destructive" : "";

  const renderError = (key: keyof ShowcaseFormData, id: string) => {
    if (!fieldErrors[key]) return null;
    return (
      <p id={`${id}-error`} className="mt-1.5 text-sm text-destructive">
        {t(`${ns}.form.${fieldErrors[key]}`)}
      </p>
    );
  };

  const ariaDesc = (key: keyof ShowcaseFormData, id: string) =>
    fieldErrors[key] ? `${id}-error` : undefined;

  const findOptionLabel = (options: Option[], value: string) =>
    options.find((o) => o.value === value)?.label;

  const renderReviewSummary = () => {
    const empty = t(`${ns}.form.review_empty`);
    const editLabel = t(`${ns}.form.review_edit`);
    const adjectivesLabel = formData.adjectives
      .map((v) => findOptionLabel(adjectiveOptions, v))
      .filter(Boolean)
      .join(", ");
    const sectionsLabel = [
      ...formData.sections.map((v) => findOptionLabel(sectionsOptions, v)).filter(Boolean),
      ...formData.customSections,
    ].join(", ");
    const colorsLabel = formData.colors.join(", ");
    const photosLabel =
      formData.photos === "yes" && formData.photoFiles.length > 0
        ? formData.photoFiles.map((f) => f.name).join(", ")
        : findOptionLabel(photosOptions, formData.photos);
    const logoLabel = formData.logoFile?.name ?? findOptionLabel(brandOptions, formData.brandAssets);
    const domainLabel =
      formData.hasDomain === "yes"
        ? formData.domainName
        : formData.hasDomain === "no"
          ? t(`${ns}.form.section_practical.domain_no`)
          : "";

    type Row = { label: string; value: string | undefined; step: number };
    const rows: Row[] = [
      {
        label: t(`${ns}.form.section_activity.project_name_label`),
        value: formData.projectName,
        step: 1,
      },
      {
        label: t(`${ns}.form.section_activity.activity_label`),
        value: formData.activity,
        step: 1,
      },
      {
        label: t(`${ns}.form.section_activity.audience_label`),
        value: formData.audience,
        step: 1,
      },
      {
        label: t(`${ns}.form.section_activity.goal_label`),
        value: findOptionLabel(goalOptions, formData.goal),
        step: 1,
      },
      {
        label: t(`${ns}.form.section_visual.inspirations_label`),
        value: formData.inspirations,
        step: 2,
      },
      {
        label: t(`${ns}.form.section_visual.adjective_label`),
        value: adjectivesLabel,
        step: 2,
      },
      {
        label: t(`${ns}.form.section_content.brand_label`),
        value: logoLabel,
        step: 3,
      },
      {
        label: t(`${ns}.form.section_content.colors_label`),
        value: colorsLabel,
        step: 3,
      },
      {
        label: t(`${ns}.form.section_content.photos_label`),
        value: photosLabel,
        step: 3,
      },
      {
        label: t(`${ns}.form.section_content.sections_label`),
        value: sectionsLabel,
        step: 3,
      },
      {
        label: t(`${ns}.form.section_practical.deadline_label`),
        value: findOptionLabel(deadlineOptions, formData.deadline),
        step: 4,
      },
      {
        label: t(`${ns}.form.section_practical.domain_label`),
        value: domainLabel,
        step: 4,
      },
      {
        label: t(`${ns}.form.section_practical.notes_label`),
        value: formData.notes,
        step: 4,
      },
    ];

    return (
      <details className="rounded-lg border border-border bg-muted/30 px-4 py-3">
        <summary className="cursor-pointer font-medium select-none">
          {t(`${ns}.form.review_title`)}
        </summary>
        <ul className="mt-3 space-y-2">
          {rows.map((row, i) => (
            <li
              key={i}
              className="flex items-start justify-between gap-3 border-b border-border/50 pb-2 last:border-b-0"
            >
              <div className="flex-1 min-w-0">
                <span className="block text-xs text-foreground/60">{row.label}</span>
                <span className="block text-sm break-words">{row.value || empty}</span>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep(row.step)}
                className="shrink-0 text-sm text-primary hover:underline"
              >
                {editLabel}
              </button>
            </li>
          ))}
        </ul>
      </details>
    );
  };

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-xl font-semibold mb-3">{t(`${ns}.context_title`)}</h3>
        <p className="text-foreground/80 leading-relaxed">{t(`${ns}.context_text`)}</p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3">{t(`${ns}.features_title`)}</h3>
        <ul className="list-disc list-inside space-y-2 text-foreground/80">
          {features.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3">{t(`${ns}.technical_title`)}</h3>
        <ul className="list-disc list-inside space-y-2 text-foreground/80">
          {technical.map((item, i) => (
            <li key={i}><strong>{item.name}</strong> — {item.desc}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3">{t(`${ns}.pricing_title`)}</h3>
        <div className="rounded-xl border border-primary/20 bg-primary/5 px-5 py-4">
          <span className="font-bold text-primary text-lg">{t(`${ns}.pricing_starting_at`)}</span>
        </div>
        <p className="text-sm text-foreground/50 mt-2">{t(`${ns}.pricing_note`)}</p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3">{t(`${ns}.example_title`)}</h3>
        <p className="text-foreground/80 leading-relaxed mb-3">{t(`${ns}.example_text`)}</p>
        <Link
          to={`/${lang}/projet/guillaume_galland`}
          className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
        >
          {t(`${ns}.example_link_label`)}
          <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section>
        <div className="border-t border-border pt-8">
          <h3 className="text-2xl font-bold mb-2">{t(`${ns}.form.title`)}</h3>
          <p className="text-foreground/70 mb-6">{t(`${ns}.form.intro`)}</p>

          <form ref={formRef} onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} className="space-y-10">
            <div className="mb-2">
              <div className="flex justify-between text-sm text-foreground/70 mb-2">
                <span aria-live="polite">
                  {t(`${ns}.form.step_label`, { current: currentStep, total: TOTAL_STEPS })}
                </span>
                <span className="font-medium">
                  {t(`${ns}.form.step_titles.${currentStep}`)}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-warm transition-all duration-300"
                  style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
                  role="progressbar"
                  aria-valuenow={currentStep}
                  aria-valuemin={1}
                  aria-valuemax={TOTAL_STEPS}
                />
              </div>
            </div>

            {currentStep === 1 && (
              <fieldset className="space-y-6">
                <legend className="text-lg font-semibold mb-2">
                  {t(`${ns}.form.section_activity.title`)}
                </legend>

                <div>
                  <label htmlFor="projectName" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_activity.project_name_label`)}
                  </label>
                  <Input
                    id="projectName"
                    name="projectName"
                    type="text"
                    placeholder={t(`${ns}.form.section_activity.project_name_placeholder`)}
                    value={formData.projectName}
                    onChange={(e) => updateField("projectName", e.target.value)}
                    aria-invalid={!!fieldErrors.projectName}
                    aria-describedby={ariaDesc("projectName", "projectName")}
                    className={`h-12 ${errorClass("projectName")}`}
                  />
                  {renderError("projectName", "projectName")}
                </div>

                <div>
                  <label htmlFor="activity" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_activity.activity_label`)}
                  </label>
                  <Input
                    id="activity"
                    name="activity"
                    type="text"
                    placeholder={t(`${ns}.form.section_activity.activity_placeholder`)}
                    value={formData.activity}
                    onChange={(e) => updateField("activity", e.target.value)}
                    aria-invalid={!!fieldErrors.activity}
                    aria-describedby={ariaDesc("activity", "activity")}
                    className={`h-12 ${errorClass("activity")}`}
                  />
                  {renderError("activity", "activity")}
                </div>

                <div>
                  <label htmlFor="audience" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_activity.audience_label`)}
                  </label>
                  <Input
                    id="audience"
                    name="audience"
                    type="text"
                    placeholder={t(`${ns}.form.section_activity.audience_placeholder`)}
                    value={formData.audience}
                    onChange={(e) => updateField("audience", e.target.value)}
                    aria-invalid={!!fieldErrors.audience}
                    aria-describedby={ariaDesc("audience", "audience")}
                    className={`h-12 ${errorClass("audience")}`}
                  />
                  {renderError("audience", "audience")}
                </div>

                <div>
                  <span id="goal-label" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_activity.goal_label`)}
                  </span>
                  <RadioGroup
                    value={formData.goal}
                    onValueChange={(value) => updateField("goal", value as Goal)}
                    aria-labelledby="goal-label"
                    aria-invalid={!!fieldErrors.goal}
                    aria-describedby={ariaDesc("goal", "goal")}
                    className="gap-2"
                  >
                    {goalOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`goal-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <RadioGroupItem id={`goal-${opt.value}`} value={opt.value} />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                  {renderError("goal", "goal")}
                </div>
              </fieldset>
            )}

            {currentStep === 2 && (
              <fieldset className="space-y-6">
                <legend className="text-lg font-semibold mb-2">
                  {t(`${ns}.form.section_visual.title`)}
                </legend>

                <div>
                  <label htmlFor="inspirations" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_visual.inspirations_label`)}
                  </label>
                  <Textarea
                    id="inspirations"
                    name="inspirations"
                    placeholder={t(`${ns}.form.section_visual.inspirations_placeholder`)}
                    value={formData.inspirations}
                    onChange={(e) => updateField("inspirations", e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <span className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_visual.adjective_label`)}
                  </span>
                  <div className="space-y-2">
                    {adjectiveOptions.map((opt) => {
                      const checked = formData.adjectives.includes(opt.value);
                      const disabled = !checked && formData.adjectives.length >= 2;
                      return (
                        <label
                          key={opt.value}
                          htmlFor={`adj-${opt.value}`}
                          className={`flex items-center gap-3 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          <Checkbox
                            id={`adj-${opt.value}`}
                            checked={checked}
                            disabled={disabled}
                            onCheckedChange={() => toggleAdjective(opt.value)}
                          />
                          <span className="text-foreground/80">{opt.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </fieldset>
            )}

            {currentStep === 3 && (
              <fieldset className="space-y-6">
                <legend className="text-lg font-semibold mb-2">
                  {t(`${ns}.form.section_content.title`)}
                </legend>

                <div>
                  <span id="brand-label" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_content.brand_label`)}
                  </span>
                  <RadioGroup
                    value={formData.brandAssets}
                    onValueChange={(value) => updateField("brandAssets", value as BrandAssets)}
                    aria-labelledby="brand-label"
                    aria-invalid={!!fieldErrors.brandAssets}
                    aria-describedby={ariaDesc("brandAssets", "brand")}
                    className="gap-2"
                  >
                    {brandOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`brand-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <RadioGroupItem id={`brand-${opt.value}`} value={opt.value} />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                  {renderError("brandAssets", "brand")}

                  {(formData.brandAssets === "yes" || formData.brandAssets === "logo_only") && (
                    <div className="mt-4">
                      <label htmlFor="logoFile" className="block text-sm font-medium mb-2">
                        {t(`${ns}.form.section_content.logo_upload_label`)}
                      </label>
                      <Input
                        id="logoFile"
                        name="logoFile"
                        type="file"
                        accept={ACCEPTED_IMAGE_ATTR}
                        onChange={(e) => handleLogoChange(e.target.files?.[0] ?? null)}
                        aria-invalid={!!fieldErrors.logoFile}
                        aria-describedby={ariaDesc("logoFile", "logoFile")}
                        className={`h-12 ${errorClass("logoFile")}`}
                      />
                      {formData.logoFile && (
                        <p className="text-sm text-foreground/60 mt-2">{formData.logoFile.name}</p>
                      )}
                      {renderError("logoFile", "logoFile")}
                    </div>
                  )}

                  {formData.brandAssets === "yes" && (
                    <div className="mt-4">
                      <span className="block text-sm font-medium mb-1">
                        {t(`${ns}.form.section_content.colors_label`)}
                      </span>
                      <p className="text-sm text-foreground/60 mb-3">
                        {t(`${ns}.form.section_content.colors_hint`)}
                      </p>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={colorDraft}
                          onChange={(e) => setColorDraft(e.target.value)}
                          aria-label={t(`${ns}.form.section_content.color_picker_label`)}
                          className="h-10 w-16 rounded border border-input cursor-pointer bg-transparent"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addColor}
                          disabled={formData.colors.length >= MAX_COLORS}
                        >
                          {t(`${ns}.form.section_content.color_add`)}
                        </Button>
                      </div>
                      {formData.colors.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {formData.colors.map((color) => (
                            <span
                              key={color}
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-background"
                            >
                              <span
                                className="inline-block w-4 h-4 rounded-full border border-border"
                                style={{ backgroundColor: color }}
                              />
                              <span className="text-sm font-mono">{color}</span>
                              <button
                                type="button"
                                onClick={() => removeColor(color)}
                                aria-label={t(`${ns}.form.section_content.color_remove`)}
                                className="text-foreground/60 hover:text-foreground text-lg leading-none"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <span id="photos-label" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_content.photos_label`)}
                  </span>
                  <RadioGroup
                    value={formData.photos}
                    onValueChange={(value) => updateField("photos", value as Photos)}
                    aria-labelledby="photos-label"
                    aria-invalid={!!fieldErrors.photos}
                    aria-describedby={ariaDesc("photos", "photos")}
                    className="gap-2"
                  >
                    {photosOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`photos-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <RadioGroupItem id={`photos-${opt.value}`} value={opt.value} />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                  {renderError("photos", "photos")}

                  {formData.photos === "yes" && (
                    <div className="mt-4">
                      <label htmlFor="photoFiles" className="block text-sm font-medium mb-2">
                        {t(`${ns}.form.section_content.photos_upload_label`)}
                      </label>
                      <Input
                        id="photoFiles"
                        name="photoFiles"
                        type="file"
                        accept={ACCEPTED_IMAGE_ATTR}
                        multiple
                        onChange={(e) => {
                          handlePhotosAdd(e.target.files);
                          e.target.value = "";
                        }}
                        aria-invalid={!!fieldErrors.photoFiles}
                        aria-describedby={ariaDesc("photoFiles", "photoFiles")}
                        className={`h-12 ${errorClass("photoFiles")}`}
                      />
                      {formData.photoFiles.length > 0 && (
                        <ul className="mt-2 space-y-1 text-sm text-foreground/60">
                          {formData.photoFiles.map((file, i) => (
                            <li
                              key={`${file.name}-${file.size}-${i}`}
                              className="flex items-center justify-between gap-2"
                            >
                              <span className="truncate">{file.name}</span>
                              <button
                                type="button"
                                onClick={() => removePhoto(i)}
                                aria-label={t(`${ns}.form.photo_remove`)}
                                className="text-foreground/60 hover:text-foreground text-lg leading-none px-2"
                              >
                                ×
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                      {renderError("photoFiles", "photoFiles")}
                    </div>
                  )}
                </div>

                <div>
                  <span className="block text-sm font-medium mb-1">
                    {t(`${ns}.form.section_content.sections_label`)}
                  </span>
                  <p className="text-sm text-foreground/60 mb-3">
                    {t(`${ns}.form.section_content.sections_hint`)}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {sectionsOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`section-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <Checkbox
                          id={`section-${opt.value}`}
                          checked={formData.sections.includes(opt.value)}
                          onCheckedChange={() => toggleSection(opt.value)}
                        />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="mt-4">
                    <label htmlFor="customSection" className="block text-sm font-medium mb-2">
                      {t(`${ns}.form.section_content.custom_sections_label`)}
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="customSection"
                        type="text"
                        placeholder={t(`${ns}.form.section_content.custom_sections_placeholder`)}
                        value={customSectionDraft}
                        onChange={(e) => setCustomSectionDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addCustomSection();
                          }
                        }}
                        className="h-12"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addCustomSection}
                        disabled={formData.customSections.length >= MAX_CUSTOM_SECTIONS}
                      >
                        {t(`${ns}.form.section_content.custom_sections_add`)}
                      </Button>
                    </div>
                    {formData.customSections.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.customSections.map((section) => (
                          <span
                            key={section}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-background"
                          >
                            <span className="text-sm">{section}</span>
                            <button
                              type="button"
                              onClick={() => removeCustomSection(section)}
                              aria-label={t(`${ns}.form.section_content.custom_sections_remove`)}
                              className="text-foreground/60 hover:text-foreground text-lg leading-none"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </fieldset>
            )}

            {currentStep === 4 && (
              <fieldset className="space-y-6">
                <legend className="text-lg font-semibold mb-2">
                  {t(`${ns}.form.section_practical.title`)}
                </legend>

                <div>
                  <span id="deadline-label" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_practical.deadline_label`)}
                  </span>
                  <RadioGroup
                    value={formData.deadline}
                    onValueChange={(value) => updateField("deadline", value as Deadline)}
                    aria-labelledby="deadline-label"
                    aria-invalid={!!fieldErrors.deadline}
                    aria-describedby={ariaDesc("deadline", "deadline")}
                    className="gap-2"
                  >
                    {deadlineOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`deadline-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <RadioGroupItem id={`deadline-${opt.value}`} value={opt.value} />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                  {renderError("deadline", "deadline")}
                </div>

                <div>
                  <span id="domain-label" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_practical.domain_label`)}
                  </span>
                  <RadioGroup
                    value={formData.hasDomain}
                    onValueChange={(value) => updateField("hasDomain", value as HasDomain)}
                    aria-labelledby="domain-label"
                    aria-invalid={!!fieldErrors.hasDomain}
                    aria-describedby={ariaDesc("hasDomain", "domain")}
                    className="gap-2"
                  >
                    <label htmlFor="domain-yes" className="flex items-center gap-3 cursor-pointer">
                      <RadioGroupItem id="domain-yes" value="yes" />
                      <span className="text-foreground/80">{t(`${ns}.form.section_practical.domain_yes`)}</span>
                    </label>
                    <label htmlFor="domain-no" className="flex items-center gap-3 cursor-pointer">
                      <RadioGroupItem id="domain-no" value="no" />
                      <span className="text-foreground/80">{t(`${ns}.form.section_practical.domain_no`)}</span>
                    </label>
                  </RadioGroup>
                  {renderError("hasDomain", "domain")}

                  {formData.hasDomain === "yes" && (
                    <div className="mt-4">
                      <label htmlFor="domainName" className="block text-sm font-medium mb-2">
                        {t(`${ns}.form.section_practical.domain_name_label`)}
                      </label>
                      <Input
                        id="domainName"
                        name="domainName"
                        type="text"
                        placeholder={t(`${ns}.form.section_practical.domain_name_placeholder`)}
                        value={formData.domainName}
                        onChange={(e) => updateField("domainName", e.target.value)}
                        aria-invalid={!!fieldErrors.domainName}
                        aria-describedby={ariaDesc("domainName", "domainName")}
                        className={`h-12 ${errorClass("domainName")}`}
                      />
                      {renderError("domainName", "domainName")}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_practical.notes_label`)}
                  </label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder={t(`${ns}.form.section_practical.notes_placeholder`)}
                    value={formData.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    rows={4}
                  />
                </div>
              </fieldset>
            )}

            {currentStep === 5 && (
              <>
                {renderReviewSummary()}

                <fieldset className="space-y-6">
                  <legend className="text-lg font-semibold mb-2">
                    {t(`${ns}.form.section_contact.title`)}
                  </legend>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                        {t(`${ns}.form.section_contact.first_name_label`)}
                      </label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        placeholder={t(`${ns}.form.section_contact.first_name_placeholder`)}
                        value={formData.firstName}
                        onChange={(e) => updateField("firstName", e.target.value)}
                        aria-invalid={!!fieldErrors.firstName}
                        aria-describedby={ariaDesc("firstName", "firstName")}
                        className={`h-12 ${errorClass("firstName")}`}
                      />
                      {renderError("firstName", "firstName")}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                        {t(`${ns}.form.section_contact.last_name_label`)}
                      </label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        placeholder={t(`${ns}.form.section_contact.last_name_placeholder`)}
                        value={formData.lastName}
                        onChange={(e) => updateField("lastName", e.target.value)}
                        aria-invalid={!!fieldErrors.lastName}
                        aria-describedby={ariaDesc("lastName", "lastName")}
                        className={`h-12 ${errorClass("lastName")}`}
                      />
                      {renderError("lastName", "lastName")}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      {t(`${ns}.form.section_contact.email_label`)}
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder={t(`${ns}.form.section_contact.email_placeholder`)}
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      aria-invalid={!!fieldErrors.email}
                      aria-describedby={ariaDesc("email", "email")}
                      className={`h-12 ${errorClass("email")}`}
                    />
                    {renderError("email", "email")}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      {t(`${ns}.form.section_contact.phone_label`)}
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder={t(`${ns}.form.section_contact.phone_placeholder`)}
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="h-12"
                    />
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="text-lg font-semibold mb-2">
                    {t(`${ns}.form.section_consent_title`)}
                  </legend>
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="showcase-consent"
                      checked={formData.consent}
                      onCheckedChange={(c) => updateField("consent", c === true)}
                      aria-invalid={!!fieldErrors.consent}
                      aria-describedby={ariaDesc("consent", "consent")}
                      className="mt-0.5"
                    />
                    <label
                      htmlFor="showcase-consent"
                      className="text-sm text-foreground/80 leading-relaxed cursor-pointer"
                    >
                      <Trans
                        i18nKey={`${ns}.form.consent_label`}
                        components={{
                          link: (
                            <Link
                              to={`/${lang}/confidentialite`}
                              className="text-primary underline hover:no-underline"
                            />
                          ),
                        }}
                      />
                    </label>
                  </div>
                  {renderError("consent", "consent")}
                </fieldset>
              </>
            )}

            <div className="flex gap-3 justify-between pt-2">
              {currentStep > 1 ? (
                <Button type="button" variant="outline" size="lg" onClick={goPrev}>
                  {t(`${ns}.form.prev`)}
                </Button>
              ) : (
                <span />
              )}
              {currentStep < TOTAL_STEPS ? (
                <Button type="button" size="lg" onClick={goNext} className="ml-auto">
                  {t(`${ns}.form.next`)}
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting || !formData.consent}
                  className="ml-auto bg-gradient-warm shadow-soft hover:shadow-hover transition-all duration-300"
                >
                  {t(`${ns}.form.submit`)}
                  <Send className="ml-2" size={18} />
                </Button>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ShowcaseSite;
