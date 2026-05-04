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
  buildEcommerceFormData,
  clearStorageDraft,
  findFirstInvalidStep,
  getStorageDraft,
  INITIAL_STATE,
  INITIAL_STEP,
  MAX_COLORS,
  MAX_FILE_SIZE_LABEL,
  MAX_PHOTOS_TOTAL_BYTES,
  MAX_PHOTOS_TOTAL_LABEL,
  setStorageDraft,
  TOTAL_STEPS,
  validateImageFile,
  validateStep,
  type Accounting,
  type AdminCount,
  type AdminRoles,
  type Budget,
  type BusinessModel,
  type Currencies,
  type CurrentPlatform,
  type CurrentSales,
  type Deadline,
  type EcommerceFeature,
  type EcommerceFormData,
  type FieldErrors,
  type FreeShipping,
  type GuestCheckout,
  type HasColors,
  type HasDomain,
  type HasLogo,
  type Marketplace,
  type Migration,
  type PaymentMethod,
  type ProductPhotos,
  type ProductSheets,
  type ProductType,
  type SeoStrategy,
  type ShippingMethod,
  type ShippingTool,
  type ShippingZone,
  type StockManagement,
  type TargetPlatform,
  type TransactionType,
  type Variants,
  type Vat,
  type Volume,
} from "./EcommerceSite.constants";

export type { EcommerceFormData };

type TechnicalItem = { name: string; desc: string };
type Option = { label: string; value: string };

type Props = {
  onFormSubmit?: (data: EcommerceFormData) => Promise<void>;
};

const ECOMMERCE_FORM_ENDPOINT = `${import.meta.env.VITE_API_BASE_URL}/form/ecommerce-form`;

const submitEcommerceForm = async (data: EcommerceFormData): Promise<void> => {
  const response = await fetch(ECOMMERCE_FORM_ENDPOINT, {
    method: "POST",
    body: buildEcommerceFormData(data),
  });
  if (!response.ok) {
    throw new Error(`Ecommerce form submission failed: ${response.status}`);
  }
};

const hasMeaningfulContent = (data: EcommerceFormData): boolean =>
  !!(
    data.projectName.trim() ||
    data.pitch.trim() ||
    data.audience.trim() ||
    data.inspirations.trim() ||
    data.notes.trim() ||
    data.firstName.trim() ||
    data.lastName.trim() ||
    data.email.trim() ||
    data.phone.trim() ||
    data.domainName.trim() ||
    data.accountingOther.trim() ||
    data.shippingToolOther.trim() ||
    data.erpCrm.trim() ||
    data.businessModel ||
    data.currentSales ||
    data.currentPlatform ||
    data.targetPlatform ||
    data.launchVolume ||
    data.yearVolume ||
    data.variants ||
    data.stockManagement ||
    data.productSheetsReady ||
    data.transactionType ||
    data.currencies ||
    data.freeShipping ||
    data.vat ||
    data.guestCheckout ||
    data.seoStrategy ||
    data.accounting ||
    data.shippingTool ||
    data.migration ||
    data.adminCount ||
    data.adminRoles ||
    data.hasLogo ||
    data.hasColors ||
    data.productPhotos ||
    data.deadline ||
    data.hasDomain ||
    data.budget ||
    data.productTypes.length ||
    data.paymentMethods.length ||
    data.shippingZones.length ||
    data.shippingMethods.length ||
    data.features.length ||
    data.marketplaceSync.length ||
    data.adjectives.length ||
    data.colors.length ||
    data.logoFile ||
    data.photoFiles.length
  );

const EcommerceSite = ({ onFormSubmit = submitEcommerceForm }: Props) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "fr" ? "fr" : "en";
  const ns = "offering.offerings.ecommerce_site";

  const features = useMemo(
    () => t(`${ns}.features`, { returnObjects: true }) as string[],
    [t],
  );
  const technical = useMemo(
    () => t(`${ns}.technical`, { returnObjects: true }) as TechnicalItem[],
    [t],
  );

  const productTypeOptions = useMemo(
    () => t(`${ns}.form.section_activity.product_types_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const businessModelOptions = useMemo(
    () => t(`${ns}.form.section_activity.business_model_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const currentSalesOptions = useMemo(
    () => t(`${ns}.form.section_activity.current_sales_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const currentPlatformOptions = useMemo(
    () => t(`${ns}.form.section_activity.current_platform_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const targetPlatformOptions = useMemo(
    () => t(`${ns}.form.section_activity.target_platform_options`, { returnObjects: true }) as Option[],
    [t],
  );

  const launchVolumeOptions = useMemo(
    () => t(`${ns}.form.section_catalog.launch_volume_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const yearVolumeOptions = useMemo(
    () => t(`${ns}.form.section_catalog.year_volume_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const variantsOptions = useMemo(
    () => t(`${ns}.form.section_catalog.variants_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const stockManagementOptions = useMemo(
    () => t(`${ns}.form.section_catalog.stock_management_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const productSheetsOptions = useMemo(
    () => t(`${ns}.form.section_catalog.product_sheets_options`, { returnObjects: true }) as Option[],
    [t],
  );

  const paymentMethodsOptions = useMemo(
    () => t(`${ns}.form.section_payment.payment_methods_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const transactionTypeOptions = useMemo(
    () => t(`${ns}.form.section_payment.transaction_type_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const currenciesOptions = useMemo(
    () => t(`${ns}.form.section_payment.currencies_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const shippingZonesOptions = useMemo(
    () => t(`${ns}.form.section_payment.shipping_zones_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const shippingMethodsOptions = useMemo(
    () => t(`${ns}.form.section_payment.shipping_methods_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const freeShippingOptions = useMemo(
    () => t(`${ns}.form.section_payment.free_shipping_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const vatOptions = useMemo(
    () => t(`${ns}.form.section_payment.vat_options`, { returnObjects: true }) as Option[],
    [t],
  );

  const guestCheckoutOptions = useMemo(
    () => t(`${ns}.form.section_marketing.guest_checkout_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const featuresOptions = useMemo(
    () => t(`${ns}.form.section_marketing.features_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const seoStrategyOptions = useMemo(
    () => t(`${ns}.form.section_marketing.seo_strategy_options`, { returnObjects: true }) as Option[],
    [t],
  );

  const accountingOptions = useMemo(
    () => t(`${ns}.form.section_integrations.accounting_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const shippingToolOptions = useMemo(
    () => t(`${ns}.form.section_integrations.shipping_tool_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const marketplaceSyncOptions = useMemo(
    () => t(`${ns}.form.section_integrations.marketplace_sync_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const migrationOptions = useMemo(
    () => t(`${ns}.form.section_integrations.migration_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const adminCountOptions = useMemo(
    () => t(`${ns}.form.section_integrations.admin_count_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const adminRolesOptions = useMemo(
    () => t(`${ns}.form.section_integrations.admin_roles_options`, { returnObjects: true }) as Option[],
    [t],
  );

  const logoOptions = useMemo(
    () => t(`${ns}.form.section_identity.logo_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const colorsQuestionOptions = useMemo(
    () => t(`${ns}.form.section_identity.colors_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const productPhotosOptions = useMemo(
    () => t(`${ns}.form.section_identity.product_photos_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const adjectiveOptions = useMemo(
    () => t(`${ns}.form.section_identity.adjective_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const deadlineOptions = useMemo(
    () => t(`${ns}.form.section_identity.deadline_options`, { returnObjects: true }) as Option[],
    [t],
  );
  const budgetOptions = useMemo(
    () => t(`${ns}.form.section_identity.budget_options`, { returnObjects: true }) as Option[],
    [t],
  );

  const [formData, setFormData] = useState<EcommerceFormData>(INITIAL_STATE);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [colorDraft, setColorDraft] = useState("#000000");
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

  const clearError = (key: keyof EcommerceFormData) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const updateField = <K extends keyof EcommerceFormData>(
    key: K,
    value: EcommerceFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    clearError(key);
  };

  const toggleArrayValue = <K extends keyof EcommerceFormData>(
    key: K,
    value: EcommerceFormData[K] extends Array<infer U> ? U : never,
  ) => {
    setFormData((prev) => {
      const list = prev[key] as unknown as Array<unknown>;
      const next = list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value];
      return { ...prev, [key]: next as EcommerceFormData[K] };
    });
    clearError(key);
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

  const errorClass = (key: keyof EcommerceFormData) =>
    fieldErrors[key] ? "border-destructive focus-visible:ring-destructive" : "";

  const renderError = (key: keyof EcommerceFormData, id: string) => {
    if (!fieldErrors[key]) return null;
    return (
      <p id={`${id}-error`} className="mt-1.5 text-sm text-destructive">
        {t(`${ns}.form.${fieldErrors[key]}`)}
      </p>
    );
  };

  const ariaDesc = (key: keyof EcommerceFormData, id: string) =>
    fieldErrors[key] ? `${id}-error` : undefined;

  const findOptionLabel = (options: Option[], value: string) =>
    options.find((o) => o.value === value)?.label;

  const joinLabels = (options: Option[], values: string[]) =>
    values
      .map((v) => findOptionLabel(options, v))
      .filter(Boolean)
      .join(", ");

  const renderReviewSummary = () => {
    const empty = t(`${ns}.form.review_empty`);
    const editLabel = t(`${ns}.form.review_edit`);
    const adjectivesLabel = joinLabels(adjectiveOptions, formData.adjectives);
    const photosLabel =
      (formData.productPhotos === "pro" || formData.productPhotos === "to_retouch") &&
      formData.photoFiles.length > 0
        ? formData.photoFiles.map((f) => f.name).join(", ")
        : findOptionLabel(productPhotosOptions, formData.productPhotos);
    const logoLabel =
      formData.logoFile?.name ?? findOptionLabel(logoOptions, formData.hasLogo);
    const colorsLabel =
      formData.hasColors === "yes" && formData.colors.length > 0
        ? formData.colors.join(", ")
        : findOptionLabel(colorsQuestionOptions, formData.hasColors);
    const domainLabel =
      formData.hasDomain === "yes"
        ? formData.domainName
        : formData.hasDomain === "no"
          ? t(`${ns}.form.section_identity.domain_no`)
          : "";
    const accountingLabel =
      formData.accounting === "other" && formData.accountingOther
        ? formData.accountingOther
        : findOptionLabel(accountingOptions, formData.accounting);
    const shippingToolLabel =
      formData.shippingTool === "other" && formData.shippingToolOther
        ? formData.shippingToolOther
        : findOptionLabel(shippingToolOptions, formData.shippingTool);
    const currentPlatformLabel =
      formData.currentSales === "other_site"
        ? findOptionLabel(currentPlatformOptions, formData.currentPlatform)
        : "";

    type Row = { label: string; value: string | undefined; step: number };
    const rows: Row[] = [
      { label: t(`${ns}.form.section_activity.project_name_label`), value: formData.projectName, step: 1 },
      { label: t(`${ns}.form.section_activity.pitch_label`), value: formData.pitch, step: 1 },
      { label: t(`${ns}.form.section_activity.product_types_label`), value: joinLabels(productTypeOptions, formData.productTypes), step: 1 },
      { label: t(`${ns}.form.section_activity.business_model_label`), value: findOptionLabel(businessModelOptions, formData.businessModel), step: 1 },
      { label: t(`${ns}.form.section_activity.current_sales_label`), value: findOptionLabel(currentSalesOptions, formData.currentSales), step: 1 },
      { label: t(`${ns}.form.section_activity.current_platform_label`), value: currentPlatformLabel, step: 1 },
      { label: t(`${ns}.form.section_activity.audience_label`), value: formData.audience, step: 1 },
      { label: t(`${ns}.form.section_activity.target_platform_label`), value: findOptionLabel(targetPlatformOptions, formData.targetPlatform), step: 1 },

      { label: t(`${ns}.form.section_catalog.launch_volume_label`), value: findOptionLabel(launchVolumeOptions, formData.launchVolume), step: 2 },
      { label: t(`${ns}.form.section_catalog.year_volume_label`), value: findOptionLabel(yearVolumeOptions, formData.yearVolume), step: 2 },
      { label: t(`${ns}.form.section_catalog.variants_label`), value: findOptionLabel(variantsOptions, formData.variants), step: 2 },
      { label: t(`${ns}.form.section_catalog.stock_management_label`), value: findOptionLabel(stockManagementOptions, formData.stockManagement), step: 2 },
      { label: t(`${ns}.form.section_catalog.product_sheets_label`), value: findOptionLabel(productSheetsOptions, formData.productSheetsReady), step: 2 },

      { label: t(`${ns}.form.section_payment.payment_methods_label`), value: joinLabels(paymentMethodsOptions, formData.paymentMethods), step: 3 },
      { label: t(`${ns}.form.section_payment.transaction_type_label`), value: findOptionLabel(transactionTypeOptions, formData.transactionType), step: 3 },
      { label: t(`${ns}.form.section_payment.currencies_label`), value: findOptionLabel(currenciesOptions, formData.currencies), step: 3 },
      { label: t(`${ns}.form.section_payment.shipping_zones_label`), value: joinLabels(shippingZonesOptions, formData.shippingZones), step: 3 },
      { label: t(`${ns}.form.section_payment.shipping_methods_label`), value: joinLabels(shippingMethodsOptions, formData.shippingMethods), step: 3 },
      { label: t(`${ns}.form.section_payment.free_shipping_label`), value: findOptionLabel(freeShippingOptions, formData.freeShipping), step: 3 },
      { label: t(`${ns}.form.section_payment.vat_label`), value: findOptionLabel(vatOptions, formData.vat), step: 3 },

      { label: t(`${ns}.form.section_marketing.guest_checkout_label`), value: findOptionLabel(guestCheckoutOptions, formData.guestCheckout), step: 4 },
      { label: t(`${ns}.form.section_marketing.features_label`), value: joinLabels(featuresOptions, formData.features), step: 4 },
      { label: t(`${ns}.form.section_marketing.seo_strategy_label`), value: findOptionLabel(seoStrategyOptions, formData.seoStrategy), step: 4 },

      { label: t(`${ns}.form.section_integrations.accounting_label`), value: accountingLabel, step: 5 },
      { label: t(`${ns}.form.section_integrations.erp_crm_label`), value: formData.erpCrm, step: 5 },
      { label: t(`${ns}.form.section_integrations.shipping_tool_label`), value: shippingToolLabel, step: 5 },
      { label: t(`${ns}.form.section_integrations.marketplace_sync_label`), value: joinLabels(marketplaceSyncOptions, formData.marketplaceSync), step: 5 },
      { label: t(`${ns}.form.section_integrations.migration_label`), value: findOptionLabel(migrationOptions, formData.migration), step: 5 },
      { label: t(`${ns}.form.section_integrations.admin_count_label`), value: findOptionLabel(adminCountOptions, formData.adminCount), step: 5 },
      { label: t(`${ns}.form.section_integrations.admin_roles_label`), value: findOptionLabel(adminRolesOptions, formData.adminRoles), step: 5 },

      { label: t(`${ns}.form.section_identity.logo_question_label`), value: logoLabel, step: 6 },
      { label: t(`${ns}.form.section_identity.colors_question_label`), value: colorsLabel, step: 6 },
      { label: t(`${ns}.form.section_identity.product_photos_label`), value: photosLabel, step: 6 },
      { label: t(`${ns}.form.section_identity.inspirations_label`), value: formData.inspirations, step: 6 },
      { label: t(`${ns}.form.section_identity.adjective_label`), value: adjectivesLabel, step: 6 },
      { label: t(`${ns}.form.section_identity.deadline_label`), value: findOptionLabel(deadlineOptions, formData.deadline), step: 6 },
      { label: t(`${ns}.form.section_identity.domain_label`), value: domainLabel, step: 6 },
      { label: t(`${ns}.form.section_identity.budget_label`), value: findOptionLabel(budgetOptions, formData.budget), step: 6 },
      { label: t(`${ns}.form.section_identity.notes_label`), value: formData.notes, step: 6 },
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
          to={`/${lang}/projet/beta_order_capture`}
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
                  <label htmlFor="pitch" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_activity.pitch_label`)}
                  </label>
                  <Input
                    id="pitch"
                    name="pitch"
                    type="text"
                    placeholder={t(`${ns}.form.section_activity.pitch_placeholder`)}
                    value={formData.pitch}
                    onChange={(e) => updateField("pitch", e.target.value)}
                    aria-invalid={!!fieldErrors.pitch}
                    aria-describedby={ariaDesc("pitch", "pitch")}
                    className={`h-12 ${errorClass("pitch")}`}
                  />
                  {renderError("pitch", "pitch")}
                </div>

                <div>
                  <span className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_activity.product_types_label`)}
                  </span>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {productTypeOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`pt-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <Checkbox
                          id={`pt-${opt.value}`}
                          checked={formData.productTypes.includes(opt.value as ProductType)}
                          onCheckedChange={() => toggleArrayValue("productTypes", opt.value as ProductType)}
                        />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                  {renderError("productTypes", "productTypes")}
                </div>

                <div>
                  <span id="businessModel-label" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_activity.business_model_label`)}
                  </span>
                  <RadioGroup
                    value={formData.businessModel}
                    onValueChange={(value) => updateField("businessModel", value as BusinessModel)}
                    aria-labelledby="businessModel-label"
                    aria-invalid={!!fieldErrors.businessModel}
                    aria-describedby={ariaDesc("businessModel", "businessModel")}
                    className="gap-2"
                  >
                    {businessModelOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`bm-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <RadioGroupItem id={`bm-${opt.value}`} value={opt.value} />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                  {renderError("businessModel", "businessModel")}
                </div>

                <div>
                  <span id="currentSales-label" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_activity.current_sales_label`)}
                  </span>
                  <RadioGroup
                    value={formData.currentSales}
                    onValueChange={(value) => updateField("currentSales", value as CurrentSales)}
                    aria-labelledby="currentSales-label"
                    aria-invalid={!!fieldErrors.currentSales}
                    aria-describedby={ariaDesc("currentSales", "currentSales")}
                    className="gap-2"
                  >
                    {currentSalesOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`cs-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <RadioGroupItem id={`cs-${opt.value}`} value={opt.value} />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                  {renderError("currentSales", "currentSales")}

                  {formData.currentSales === "other_site" && (
                    <div className="mt-4">
                      <span id="currentPlatform-label" className="block text-sm font-medium mb-2">
                        {t(`${ns}.form.section_activity.current_platform_label`)}
                      </span>
                      <RadioGroup
                        value={formData.currentPlatform}
                        onValueChange={(value) => updateField("currentPlatform", value as CurrentPlatform)}
                        aria-labelledby="currentPlatform-label"
                        aria-invalid={!!fieldErrors.currentPlatform}
                        aria-describedby={ariaDesc("currentPlatform", "currentPlatform")}
                        className="gap-2"
                      >
                        {currentPlatformOptions.map((opt) => (
                          <label key={opt.value} htmlFor={`cp-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                            <RadioGroupItem id={`cp-${opt.value}`} value={opt.value} />
                            <span className="text-foreground/80">{opt.label}</span>
                          </label>
                        ))}
                      </RadioGroup>
                      {renderError("currentPlatform", "currentPlatform")}
                    </div>
                  )}
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
                  <span id="targetPlatform-label" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_activity.target_platform_label`)}
                  </span>
                  <RadioGroup
                    value={formData.targetPlatform}
                    onValueChange={(value) => updateField("targetPlatform", value as TargetPlatform)}
                    aria-labelledby="targetPlatform-label"
                    aria-invalid={!!fieldErrors.targetPlatform}
                    aria-describedby={ariaDesc("targetPlatform", "targetPlatform")}
                    className="gap-2"
                  >
                    {targetPlatformOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`tp-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <RadioGroupItem id={`tp-${opt.value}`} value={opt.value} />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                  {renderError("targetPlatform", "targetPlatform")}
                </div>
              </fieldset>
            )}

            {currentStep === 2 && (
              <fieldset className="space-y-6">
                <legend className="text-lg font-semibold mb-2">
                  {t(`${ns}.form.section_catalog.title`)}
                </legend>

                <div>
                  <span id="launchVolume-label" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_catalog.launch_volume_label`)}
                  </span>
                  <RadioGroup
                    value={formData.launchVolume}
                    onValueChange={(value) => updateField("launchVolume", value as Volume)}
                    aria-labelledby="launchVolume-label"
                    aria-invalid={!!fieldErrors.launchVolume}
                    aria-describedby={ariaDesc("launchVolume", "launchVolume")}
                    className="gap-2"
                  >
                    {launchVolumeOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`lv-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <RadioGroupItem id={`lv-${opt.value}`} value={opt.value} />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                  {renderError("launchVolume", "launchVolume")}
                </div>

                <div>
                  <span id="yearVolume-label" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_catalog.year_volume_label`)}
                  </span>
                  <RadioGroup
                    value={formData.yearVolume}
                    onValueChange={(value) => updateField("yearVolume", value as Volume)}
                    aria-labelledby="yearVolume-label"
                    aria-invalid={!!fieldErrors.yearVolume}
                    aria-describedby={ariaDesc("yearVolume", "yearVolume")}
                    className="gap-2"
                  >
                    {yearVolumeOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`yv-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <RadioGroupItem id={`yv-${opt.value}`} value={opt.value} />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                  {renderError("yearVolume", "yearVolume")}
                </div>

                <div>
                  <span id="variants-label" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_catalog.variants_label`)}
                  </span>
                  <RadioGroup
                    value={formData.variants}
                    onValueChange={(value) => updateField("variants", value as Variants)}
                    aria-labelledby="variants-label"
                    aria-invalid={!!fieldErrors.variants}
                    aria-describedby={ariaDesc("variants", "variants")}
                    className="gap-2"
                  >
                    {variantsOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`var-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <RadioGroupItem id={`var-${opt.value}`} value={opt.value} />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                  {renderError("variants", "variants")}
                </div>

                <div>
                  <span id="stockManagement-label" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_catalog.stock_management_label`)}
                  </span>
                  <RadioGroup
                    value={formData.stockManagement}
                    onValueChange={(value) => updateField("stockManagement", value as StockManagement)}
                    aria-labelledby="stockManagement-label"
                    aria-invalid={!!fieldErrors.stockManagement}
                    aria-describedby={ariaDesc("stockManagement", "stockManagement")}
                    className="gap-2"
                  >
                    {stockManagementOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`sm-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <RadioGroupItem id={`sm-${opt.value}`} value={opt.value} />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                  {renderError("stockManagement", "stockManagement")}
                </div>

                <div>
                  <span id="productSheets-label" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_catalog.product_sheets_label`)}
                  </span>
                  <RadioGroup
                    value={formData.productSheetsReady}
                    onValueChange={(value) => updateField("productSheetsReady", value as ProductSheets)}
                    aria-labelledby="productSheets-label"
                    aria-invalid={!!fieldErrors.productSheetsReady}
                    aria-describedby={ariaDesc("productSheetsReady", "productSheets")}
                    className="gap-2"
                  >
                    {productSheetsOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`ps-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <RadioGroupItem id={`ps-${opt.value}`} value={opt.value} />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                  {renderError("productSheetsReady", "productSheets")}
                </div>
              </fieldset>
            )}

            {currentStep === 3 && (
              <fieldset className="space-y-6">
                <legend className="text-lg font-semibold mb-2">
                  {t(`${ns}.form.section_payment.title`)}
                </legend>

                <div>
                  <span className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_payment.payment_methods_label`)}
                  </span>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {paymentMethodsOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`pm-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <Checkbox
                          id={`pm-${opt.value}`}
                          checked={formData.paymentMethods.includes(opt.value as PaymentMethod)}
                          onCheckedChange={() => toggleArrayValue("paymentMethods", opt.value as PaymentMethod)}
                        />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                  {renderError("paymentMethods", "paymentMethods")}
                </div>

                <div>
                  <span id="transactionType-label" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_payment.transaction_type_label`)}
                  </span>
                  <RadioGroup
                    value={formData.transactionType}
                    onValueChange={(value) => updateField("transactionType", value as TransactionType)}
                    aria-labelledby="transactionType-label"
                    aria-invalid={!!fieldErrors.transactionType}
                    aria-describedby={ariaDesc("transactionType", "transactionType")}
                    className="gap-2"
                  >
                    {transactionTypeOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`tt-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <RadioGroupItem id={`tt-${opt.value}`} value={opt.value} />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                  {renderError("transactionType", "transactionType")}
                </div>

                <div>
                  <span id="currencies-label" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_payment.currencies_label`)}
                  </span>
                  <RadioGroup
                    value={formData.currencies}
                    onValueChange={(value) => updateField("currencies", value as Currencies)}
                    aria-labelledby="currencies-label"
                    aria-invalid={!!fieldErrors.currencies}
                    aria-describedby={ariaDesc("currencies", "currencies")}
                    className="gap-2"
                  >
                    {currenciesOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`cur-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <RadioGroupItem id={`cur-${opt.value}`} value={opt.value} />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                  {renderError("currencies", "currencies")}
                </div>

                <div>
                  <span className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_payment.shipping_zones_label`)}
                  </span>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {shippingZonesOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`sz-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <Checkbox
                          id={`sz-${opt.value}`}
                          checked={formData.shippingZones.includes(opt.value as ShippingZone)}
                          onCheckedChange={() => toggleArrayValue("shippingZones", opt.value as ShippingZone)}
                        />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                  {renderError("shippingZones", "shippingZones")}
                </div>

                <div>
                  <span className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_payment.shipping_methods_label`)}
                  </span>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {shippingMethodsOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`shm-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <Checkbox
                          id={`shm-${opt.value}`}
                          checked={formData.shippingMethods.includes(opt.value as ShippingMethod)}
                          onCheckedChange={() => toggleArrayValue("shippingMethods", opt.value as ShippingMethod)}
                        />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                  {renderError("shippingMethods", "shippingMethods")}
                </div>

                <div>
                  <span id="freeShipping-label" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_payment.free_shipping_label`)}
                  </span>
                  <RadioGroup
                    value={formData.freeShipping}
                    onValueChange={(value) => updateField("freeShipping", value as FreeShipping)}
                    aria-labelledby="freeShipping-label"
                    aria-invalid={!!fieldErrors.freeShipping}
                    aria-describedby={ariaDesc("freeShipping", "freeShipping")}
                    className="gap-2"
                  >
                    {freeShippingOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`fs-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <RadioGroupItem id={`fs-${opt.value}`} value={opt.value} />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                  {renderError("freeShipping", "freeShipping")}
                </div>

                <div>
                  <span id="vat-label" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_payment.vat_label`)}
                  </span>
                  <RadioGroup
                    value={formData.vat}
                    onValueChange={(value) => updateField("vat", value as Vat)}
                    aria-labelledby="vat-label"
                    aria-invalid={!!fieldErrors.vat}
                    aria-describedby={ariaDesc("vat", "vat")}
                    className="gap-2"
                  >
                    {vatOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`vat-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <RadioGroupItem id={`vat-${opt.value}`} value={opt.value} />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                  {renderError("vat", "vat")}
                </div>
              </fieldset>
            )}

            {currentStep === 4 && (
              <fieldset className="space-y-6">
                <legend className="text-lg font-semibold mb-2">
                  {t(`${ns}.form.section_marketing.title`)}
                </legend>

                <div>
                  <span id="guestCheckout-label" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_marketing.guest_checkout_label`)}
                  </span>
                  <RadioGroup
                    value={formData.guestCheckout}
                    onValueChange={(value) => updateField("guestCheckout", value as GuestCheckout)}
                    aria-labelledby="guestCheckout-label"
                    aria-invalid={!!fieldErrors.guestCheckout}
                    aria-describedby={ariaDesc("guestCheckout", "guestCheckout")}
                    className="gap-2"
                  >
                    {guestCheckoutOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`gc-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <RadioGroupItem id={`gc-${opt.value}`} value={opt.value} />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                  {renderError("guestCheckout", "guestCheckout")}
                </div>

                <div>
                  <span className="block text-sm font-medium mb-1">
                    {t(`${ns}.form.section_marketing.features_label`)}
                  </span>
                  <p className="text-sm text-foreground/60 mb-3">
                    {t(`${ns}.form.section_marketing.features_hint`)}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {featuresOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`feat-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <Checkbox
                          id={`feat-${opt.value}`}
                          checked={formData.features.includes(opt.value as EcommerceFeature)}
                          onCheckedChange={() => toggleArrayValue("features", opt.value as EcommerceFeature)}
                        />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <span id="seoStrategy-label" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_marketing.seo_strategy_label`)}
                  </span>
                  <RadioGroup
                    value={formData.seoStrategy}
                    onValueChange={(value) => updateField("seoStrategy", value as SeoStrategy)}
                    aria-labelledby="seoStrategy-label"
                    aria-invalid={!!fieldErrors.seoStrategy}
                    aria-describedby={ariaDesc("seoStrategy", "seoStrategy")}
                    className="gap-2"
                  >
                    {seoStrategyOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`seo-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <RadioGroupItem id={`seo-${opt.value}`} value={opt.value} />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                  {renderError("seoStrategy", "seoStrategy")}
                </div>
              </fieldset>
            )}

            {currentStep === 5 && (
              <fieldset className="space-y-6">
                <legend className="text-lg font-semibold mb-2">
                  {t(`${ns}.form.section_integrations.title`)}
                </legend>

                <div>
                  <span id="accounting-label" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_integrations.accounting_label`)}
                  </span>
                  <RadioGroup
                    value={formData.accounting}
                    onValueChange={(value) => updateField("accounting", value as Accounting)}
                    aria-labelledby="accounting-label"
                    aria-invalid={!!fieldErrors.accounting}
                    aria-describedby={ariaDesc("accounting", "accounting")}
                    className="gap-2"
                  >
                    {accountingOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`acc-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <RadioGroupItem id={`acc-${opt.value}`} value={opt.value} />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                  {renderError("accounting", "accounting")}

                  {formData.accounting === "other" && (
                    <div className="mt-4">
                      <label htmlFor="accountingOther" className="block text-sm font-medium mb-2">
                        {t(`${ns}.form.section_integrations.accounting_other_label`)}
                      </label>
                      <Input
                        id="accountingOther"
                        name="accountingOther"
                        type="text"
                        placeholder={t(`${ns}.form.section_integrations.accounting_other_placeholder`)}
                        value={formData.accountingOther}
                        onChange={(e) => updateField("accountingOther", e.target.value)}
                        aria-invalid={!!fieldErrors.accountingOther}
                        aria-describedby={ariaDesc("accountingOther", "accountingOther")}
                        className={`h-12 ${errorClass("accountingOther")}`}
                      />
                      {renderError("accountingOther", "accountingOther")}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="erpCrm" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_integrations.erp_crm_label`)}
                  </label>
                  <Textarea
                    id="erpCrm"
                    name="erpCrm"
                    placeholder={t(`${ns}.form.section_integrations.erp_crm_placeholder`)}
                    value={formData.erpCrm}
                    onChange={(e) => updateField("erpCrm", e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <span id="shippingTool-label" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_integrations.shipping_tool_label`)}
                  </span>
                  <RadioGroup
                    value={formData.shippingTool}
                    onValueChange={(value) => updateField("shippingTool", value as ShippingTool)}
                    aria-labelledby="shippingTool-label"
                    aria-invalid={!!fieldErrors.shippingTool}
                    aria-describedby={ariaDesc("shippingTool", "shippingTool")}
                    className="gap-2"
                  >
                    {shippingToolOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`st-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <RadioGroupItem id={`st-${opt.value}`} value={opt.value} />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                  {renderError("shippingTool", "shippingTool")}

                  {formData.shippingTool === "other" && (
                    <div className="mt-4">
                      <label htmlFor="shippingToolOther" className="block text-sm font-medium mb-2">
                        {t(`${ns}.form.section_integrations.shipping_tool_other_label`)}
                      </label>
                      <Input
                        id="shippingToolOther"
                        name="shippingToolOther"
                        type="text"
                        placeholder={t(`${ns}.form.section_integrations.shipping_tool_other_placeholder`)}
                        value={formData.shippingToolOther}
                        onChange={(e) => updateField("shippingToolOther", e.target.value)}
                        aria-invalid={!!fieldErrors.shippingToolOther}
                        aria-describedby={ariaDesc("shippingToolOther", "shippingToolOther")}
                        className={`h-12 ${errorClass("shippingToolOther")}`}
                      />
                      {renderError("shippingToolOther", "shippingToolOther")}
                    </div>
                  )}
                </div>

                <div>
                  <span className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_integrations.marketplace_sync_label`)}
                  </span>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {marketplaceSyncOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`ms-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <Checkbox
                          id={`ms-${opt.value}`}
                          checked={formData.marketplaceSync.includes(opt.value as Marketplace)}
                          onCheckedChange={() => toggleArrayValue("marketplaceSync", opt.value as Marketplace)}
                        />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <span id="migration-label" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_integrations.migration_label`)}
                  </span>
                  <RadioGroup
                    value={formData.migration}
                    onValueChange={(value) => updateField("migration", value as Migration)}
                    aria-labelledby="migration-label"
                    aria-invalid={!!fieldErrors.migration}
                    aria-describedby={ariaDesc("migration", "migration")}
                    className="gap-2"
                  >
                    {migrationOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`mg-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <RadioGroupItem id={`mg-${opt.value}`} value={opt.value} />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                  {renderError("migration", "migration")}
                </div>

                <div>
                  <span id="adminCount-label" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_integrations.admin_count_label`)}
                  </span>
                  <RadioGroup
                    value={formData.adminCount}
                    onValueChange={(value) => updateField("adminCount", value as AdminCount)}
                    aria-labelledby="adminCount-label"
                    aria-invalid={!!fieldErrors.adminCount}
                    aria-describedby={ariaDesc("adminCount", "adminCount")}
                    className="gap-2"
                  >
                    {adminCountOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`ac-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <RadioGroupItem id={`ac-${opt.value}`} value={opt.value} />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                  {renderError("adminCount", "adminCount")}
                </div>

                <div>
                  <span id="adminRoles-label" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_integrations.admin_roles_label`)}
                  </span>
                  <RadioGroup
                    value={formData.adminRoles}
                    onValueChange={(value) => updateField("adminRoles", value as AdminRoles)}
                    aria-labelledby="adminRoles-label"
                    aria-invalid={!!fieldErrors.adminRoles}
                    aria-describedby={ariaDesc("adminRoles", "adminRoles")}
                    className="gap-2"
                  >
                    {adminRolesOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`ar-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <RadioGroupItem id={`ar-${opt.value}`} value={opt.value} />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                  {renderError("adminRoles", "adminRoles")}
                </div>
              </fieldset>
            )}

            {currentStep === 6 && (
              <fieldset className="space-y-6">
                <legend className="text-lg font-semibold mb-2">
                  {t(`${ns}.form.section_identity.title`)}
                </legend>

                <div>
                  <span id="logo-label" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_identity.logo_question_label`)}
                  </span>
                  <RadioGroup
                    value={formData.hasLogo}
                    onValueChange={(value) => updateField("hasLogo", value as HasLogo)}
                    aria-labelledby="logo-label"
                    aria-invalid={!!fieldErrors.hasLogo}
                    aria-describedby={ariaDesc("hasLogo", "logo")}
                    className="gap-2"
                  >
                    {logoOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`logo-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <RadioGroupItem id={`logo-${opt.value}`} value={opt.value} />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                  {renderError("hasLogo", "logo")}

                  {formData.hasLogo === "yes" && (
                    <div className="mt-4">
                      <label htmlFor="logoFile" className="block text-sm font-medium mb-2">
                        {t(`${ns}.form.section_identity.logo_upload_label`)}
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
                </div>

                <div>
                  <span id="colors-question-label" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_identity.colors_question_label`)}
                  </span>
                  <RadioGroup
                    value={formData.hasColors}
                    onValueChange={(value) => updateField("hasColors", value as HasColors)}
                    aria-labelledby="colors-question-label"
                    aria-invalid={!!fieldErrors.hasColors}
                    aria-describedby={ariaDesc("hasColors", "colors-question")}
                    className="gap-2"
                  >
                    {colorsQuestionOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`colors-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <RadioGroupItem id={`colors-${opt.value}`} value={opt.value} />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                  {renderError("hasColors", "colors-question")}

                  {formData.hasColors === "yes" && (
                    <div className="mt-4">
                      <span className="block text-sm font-medium mb-1">
                        {t(`${ns}.form.section_identity.colors_label`)}
                      </span>
                      <p className="text-sm text-foreground/60 mb-3">
                        {t(`${ns}.form.section_identity.colors_hint`)}
                      </p>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={colorDraft}
                          onChange={(e) => setColorDraft(e.target.value)}
                          aria-label={t(`${ns}.form.section_identity.color_picker_label`)}
                          className="h-10 w-16 rounded border border-input cursor-pointer bg-transparent"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addColor}
                          disabled={formData.colors.length >= MAX_COLORS}
                        >
                          {t(`${ns}.form.section_identity.color_add`)}
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
                                aria-label={t(`${ns}.form.section_identity.color_remove`)}
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
                  <span id="productPhotos-label" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_identity.product_photos_label`)}
                  </span>
                  <RadioGroup
                    value={formData.productPhotos}
                    onValueChange={(value) => updateField("productPhotos", value as ProductPhotos)}
                    aria-labelledby="productPhotos-label"
                    aria-invalid={!!fieldErrors.productPhotos}
                    aria-describedby={ariaDesc("productPhotos", "productPhotos")}
                    className="gap-2"
                  >
                    {productPhotosOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`pp-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <RadioGroupItem id={`pp-${opt.value}`} value={opt.value} />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                  {renderError("productPhotos", "productPhotos")}

                  {(formData.productPhotos === "pro" || formData.productPhotos === "to_retouch") && (
                    <div className="mt-4">
                      <label htmlFor="photoFiles" className="block text-sm font-medium mb-2">
                        {t(`${ns}.form.section_identity.photos_upload_label`)}
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
                  <label htmlFor="inspirations" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_identity.inspirations_label`)}
                  </label>
                  <Textarea
                    id="inspirations"
                    name="inspirations"
                    placeholder={t(`${ns}.form.section_identity.inspirations_placeholder`)}
                    value={formData.inspirations}
                    onChange={(e) => updateField("inspirations", e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <span className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_identity.adjective_label`)}
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

                <div>
                  <span id="deadline-label" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_identity.deadline_label`)}
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
                    {t(`${ns}.form.section_identity.domain_label`)}
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
                      <span className="text-foreground/80">{t(`${ns}.form.section_identity.domain_yes`)}</span>
                    </label>
                    <label htmlFor="domain-no" className="flex items-center gap-3 cursor-pointer">
                      <RadioGroupItem id="domain-no" value="no" />
                      <span className="text-foreground/80">{t(`${ns}.form.section_identity.domain_no`)}</span>
                    </label>
                  </RadioGroup>
                  {renderError("hasDomain", "domain")}

                  {formData.hasDomain === "yes" && (
                    <div className="mt-4">
                      <label htmlFor="domainName" className="block text-sm font-medium mb-2">
                        {t(`${ns}.form.section_identity.domain_name_label`)}
                      </label>
                      <Input
                        id="domainName"
                        name="domainName"
                        type="text"
                        placeholder={t(`${ns}.form.section_identity.domain_name_placeholder`)}
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
                  <span id="budget-label" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_identity.budget_label`)}
                  </span>
                  <RadioGroup
                    value={formData.budget}
                    onValueChange={(value) => updateField("budget", value as Budget)}
                    aria-labelledby="budget-label"
                    aria-invalid={!!fieldErrors.budget}
                    aria-describedby={ariaDesc("budget", "budget")}
                    className="gap-2"
                  >
                    {budgetOptions.map((opt) => (
                      <label key={opt.value} htmlFor={`bg-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                        <RadioGroupItem id={`bg-${opt.value}`} value={opt.value} />
                        <span className="text-foreground/80">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                  {renderError("budget", "budget")}
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium mb-2">
                    {t(`${ns}.form.section_identity.notes_label`)}
                  </label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder={t(`${ns}.form.section_identity.notes_placeholder`)}
                    value={formData.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    rows={4}
                  />
                </div>
              </fieldset>
            )}

            {currentStep === 7 && (
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
                      id="ecommerce-consent"
                      checked={formData.consent}
                      onCheckedChange={(c) => updateField("consent", c === true)}
                      aria-invalid={!!fieldErrors.consent}
                      aria-describedby={ariaDesc("consent", "consent")}
                      className="mt-0.5"
                    />
                    <label
                      htmlFor="ecommerce-consent"
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

export default EcommerceSite;
