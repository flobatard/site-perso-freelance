export type ProductType =
  | "physical"
  | "digital"
  | "services"
  | "subscriptions"
  | "mix";
export type BusinessModel = "" | "b2c" | "b2b" | "both";
export type CurrentSales =
  | ""
  | "not_yet"
  | "physical_store"
  | "other_site"
  | "marketplace";
export type CurrentPlatform =
  | ""
  | "shopify"
  | "woocommerce"
  | "prestashop"
  | "wix"
  | "other";
export type TargetPlatform =
  | ""
  | "shopify"
  | "woocommerce"
  | "prestashop"
  | "custom"
  | "advice";

export type Volume =
  | ""
  | "lt_10"
  | "10_50"
  | "50_200"
  | "200_1000"
  | "gt_1000";
export type Variants = "" | "no" | "simple" | "complex";
export type StockManagement =
  | ""
  | "none"
  | "simple"
  | "realtime"
  | "multi_warehouse";
export type ProductSheets = "" | "ready" | "text_only" | "nothing" | "import";

export type PaymentMethod =
  | "card"
  | "apple_google_pay"
  | "paypal"
  | "bank_transfer"
  | "sepa"
  | "installments";
export type TransactionType = "" | "one_time" | "subscription" | "both";
export type Currencies = "" | "eur_only" | "multi";
export type ShippingZone = "metro_fr" | "dom_tom" | "eu" | "world";
export type ShippingMethod =
  | "colissimo"
  | "mondial_relay"
  | "chronopost"
  | "custom_carrier"
  | "click_collect"
  | "store_pickup"
  | "digital_delivery";
export type FreeShipping = "" | "never" | "above_threshold" | "always";
export type Vat =
  | ""
  | "standard_fr"
  | "multi_rates"
  | "intra_eu"
  | "outside_eu"
  | "unknown";

export type GuestCheckout = "" | "guest_allowed" | "account_required";
export type EcommerceFeature =
  | "wishlist"
  | "loyalty"
  | "promo_codes"
  | "reviews"
  | "recommendations"
  | "newsletter"
  | "abandoned_cart"
  | "blog"
  | "chat";
export type SeoStrategy = "" | "self_managed" | "needs_advice" | "not_yet";

export type Accounting =
  | ""
  | "pennylane"
  | "sage"
  | "quickbooks"
  | "none"
  | "other";
export type ShippingTool = "" | "sendcloud" | "boxtal" | "none" | "other";
export type Marketplace = "amazon" | "etsy" | "cdiscount" | "none";
export type Migration =
  | ""
  | "no"
  | "products_only"
  | "products_customers"
  | "full";
export type AdminCount = "" | "1" | "2_3" | "4_plus";
export type YesNo = "" | "yes" | "no";

export type HasLogo = YesNo;
export type HasColors = YesNo;
export type HasDomain = YesNo;
export type AdminRoles = YesNo;
export type ProductPhotos =
  | ""
  | "pro"
  | "to_retouch"
  | "to_shoot"
  | "supplier_dynamic";
export type Deadline =
  | ""
  | "lt_2_weeks"
  | "1_month"
  | "1_to_3_months"
  | "3_to_6_months"
  | "gt_6_months";
export type Budget = "" | "lt_10k" | "10_30k" | "30_60k" | "60_100k" | "gt_100k" | "unknown";

export type EcommerceFormData = {
  // Step 1 — Activity
  projectName: string;
  pitch: string;
  productTypes: ProductType[];
  businessModel: BusinessModel;
  currentSales: CurrentSales;
  currentPlatform: CurrentPlatform;
  audience: string;
  targetPlatform: TargetPlatform;

  // Step 2 — Catalog
  launchVolume: Volume;
  yearVolume: Volume;
  variants: Variants;
  stockManagement: StockManagement;
  productSheetsReady: ProductSheets;

  // Step 3 — Payment / Shipping / Tax
  paymentMethods: PaymentMethod[];
  transactionType: TransactionType;
  currencies: Currencies;
  shippingZones: ShippingZone[];
  shippingMethods: ShippingMethod[];
  freeShipping: FreeShipping;
  vat: Vat;

  // Step 4 — UX & marketing
  guestCheckout: GuestCheckout;
  features: EcommerceFeature[];
  seoStrategy: SeoStrategy;

  // Step 5 — Integrations & migration
  accounting: Accounting;
  accountingOther: string;
  erpCrm: string;
  shippingTool: ShippingTool;
  shippingToolOther: string;
  marketplaceSync: Marketplace[];
  migration: Migration;
  adminCount: AdminCount;
  adminRoles: AdminRoles;

  // Step 6 — Identity & practical
  hasLogo: HasLogo;
  logoFile: File | null;
  hasColors: HasColors;
  colors: string[];
  productPhotos: ProductPhotos;
  photoFiles: File[];
  inspirations: string;
  adjectives: string[];
  deadline: Deadline;
  hasDomain: HasDomain;
  domainName: string;
  budget: Budget;
  notes: string;

  // Step 7 — Contact
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  consent: boolean;
};

export type EcommerceFormDataScalars = Omit<
  EcommerceFormData,
  "logoFile" | "photoFiles"
>;

export type FieldErrors = Partial<Record<keyof EcommerceFormData, string>>;

export const TOTAL_STEPS = 7;
export const STORAGE_KEY = "ecommerce_form_draft";
export const STORAGE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_PHOTOS_TOTAL_BYTES = 50 * 1024 * 1024;
export const MAX_FILE_SIZE_LABEL = "10 Mo";
export const MAX_PHOTOS_TOTAL_LABEL = "50 Mo";
export const MAX_COLORS = 6;
export const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
] as const;
export const ACCEPTED_IMAGE_ATTR = ACCEPTED_IMAGE_TYPES.join(",");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const EMPTY_STATE: EcommerceFormData = {
  projectName: "",
  pitch: "",
  productTypes: [],
  businessModel: "",
  currentSales: "",
  currentPlatform: "",
  audience: "",
  targetPlatform: "",

  launchVolume: "",
  yearVolume: "",
  variants: "",
  stockManagement: "",
  productSheetsReady: "",

  paymentMethods: [],
  transactionType: "",
  currencies: "",
  shippingZones: [],
  shippingMethods: [],
  freeShipping: "",
  vat: "",

  guestCheckout: "",
  features: [],
  seoStrategy: "",

  accounting: "",
  accountingOther: "",
  erpCrm: "",
  shippingTool: "",
  shippingToolOther: "",
  marketplaceSync: [],
  migration: "",
  adminCount: "",
  adminRoles: "",

  hasLogo: "",
  logoFile: null,
  hasColors: "",
  colors: [],
  productPhotos: "",
  photoFiles: [],
  inspirations: "",
  adjectives: [],
  deadline: "",
  hasDomain: "",
  domainName: "",
  budget: "",
  notes: "",

  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  consent: false,
};

export const DEV_PREFILLED_STATE: EcommerceFormData = {
  projectName: "Boutique artisanale céramique (DEV)",
  pitch: "Vente en ligne de céramiques faites main par des artisans français",
  productTypes: ["physical"],
  businessModel: "b2c",
  currentSales: "marketplace",
  currentPlatform: "",
  audience: "Particuliers 25-55 ans, sensibles à l'artisanat local",
  targetPlatform: "shopify",

  launchVolume: "50_200",
  yearVolume: "200_1000",
  variants: "simple",
  stockManagement: "simple",
  productSheetsReady: "text_only",

  paymentMethods: ["card", "apple_google_pay", "paypal"],
  transactionType: "one_time",
  currencies: "eur_only",
  shippingZones: ["metro_fr", "eu"],
  shippingMethods: ["colissimo", "mondial_relay"],
  freeShipping: "above_threshold",
  vat: "standard_fr",

  guestCheckout: "guest_allowed",
  features: ["reviews", "newsletter", "abandoned_cart"],
  seoStrategy: "needs_advice",

  accounting: "pennylane",
  accountingOther: "",
  erpCrm: "",
  shippingTool: "sendcloud",
  shippingToolOther: "",
  marketplaceSync: ["etsy"],
  migration: "products_only",
  adminCount: "2_3",
  adminRoles: "yes",

  hasLogo: "yes",
  logoFile: null,
  hasColors: "yes",
  colors: ["#c97b53", "#2d2d2d"],
  productPhotos: "to_shoot",
  photoFiles: [],
  inspirations: "https://example-ceramics.com — photos plein cadre, typo serif",
  adjectives: ["warm", "premium"],
  deadline: "1_to_3_months",
  hasDomain: "yes",
  domainName: "ma-ceramique.fr",
  budget: "10_30k",
  notes: "Préremplissage dev — à ignorer en prod.",

  firstName: "Florian",
  lastName: "Batard",
  email: "fb.batard@gmail.com",
  phone: "+33 6 00 00 00 00",
  consent: true,
};

export const INITIAL_STATE: EcommerceFormData = import.meta.env.DEV
  ? DEV_PREFILLED_STATE
  : EMPTY_STATE;
export const INITIAL_STEP = import.meta.env.DEV ? 7 : 1;

export type FileValidationKey =
  | "error_file_too_large"
  | "error_file_type"
  | "error_photos_total_too_large";

export const validateImageFile = (file: File): FileValidationKey | null => {
  const accepted = ACCEPTED_IMAGE_TYPES as readonly string[];
  if (!accepted.includes(file.type)) return "error_file_type";
  if (file.size > MAX_FILE_SIZE_BYTES) return "error_file_too_large";
  return null;
};

export type StepValidationResult = { ok: boolean; errors: FieldErrors };

export const validateStep = (
  step: number,
  data: EcommerceFormData,
): StepValidationResult => {
  const errors: FieldErrors = {};
  if (step === 1) {
    if (!data.projectName.trim()) errors.projectName = "error_field_required";
    if (!data.pitch.trim()) errors.pitch = "error_field_required";
    if (data.productTypes.length === 0)
      errors.productTypes = "error_field_required";
    if (!data.businessModel) errors.businessModel = "error_field_required";
    if (!data.currentSales) errors.currentSales = "error_field_required";
    if (data.currentSales === "other_site" && !data.currentPlatform) {
      errors.currentPlatform = "error_field_required";
    }
    if (!data.audience.trim()) errors.audience = "error_field_required";
    if (!data.targetPlatform) errors.targetPlatform = "error_field_required";
  }
  if (step === 2) {
    if (!data.launchVolume) errors.launchVolume = "error_field_required";
    if (!data.yearVolume) errors.yearVolume = "error_field_required";
    if (!data.variants) errors.variants = "error_field_required";
    if (!data.stockManagement)
      errors.stockManagement = "error_field_required";
    if (!data.productSheetsReady)
      errors.productSheetsReady = "error_field_required";
  }
  if (step === 3) {
    if (data.paymentMethods.length === 0)
      errors.paymentMethods = "error_field_required";
    if (!data.transactionType)
      errors.transactionType = "error_field_required";
    if (!data.currencies) errors.currencies = "error_field_required";
    if (data.shippingZones.length === 0)
      errors.shippingZones = "error_field_required";
    if (data.shippingMethods.length === 0)
      errors.shippingMethods = "error_field_required";
    if (!data.freeShipping) errors.freeShipping = "error_field_required";
    if (!data.vat) errors.vat = "error_field_required";
  }
  if (step === 4) {
    if (!data.guestCheckout) errors.guestCheckout = "error_field_required";
    if (!data.seoStrategy) errors.seoStrategy = "error_field_required";
  }
  if (step === 5) {
    if (!data.accounting) errors.accounting = "error_field_required";
    if (data.accounting === "other" && !data.accountingOther.trim()) {
      errors.accountingOther = "error_field_required";
    }
    if (!data.shippingTool) errors.shippingTool = "error_field_required";
    if (data.shippingTool === "other" && !data.shippingToolOther.trim()) {
      errors.shippingToolOther = "error_field_required";
    }
    if (!data.migration) errors.migration = "error_field_required";
    if (!data.adminCount) errors.adminCount = "error_field_required";
    if (!data.adminRoles) errors.adminRoles = "error_field_required";
  }
  if (step === 6) {
    if (!data.hasLogo) errors.hasLogo = "error_field_required";
    if (data.hasLogo === "yes" && !data.logoFile) {
      errors.logoFile = "error_field_required";
    }
    if (!data.hasColors) errors.hasColors = "error_field_required";
    if (!data.productPhotos) errors.productPhotos = "error_field_required";
    if (
      (data.productPhotos === "pro" || data.productPhotos === "to_retouch") &&
      data.photoFiles.length === 0
    ) {
      errors.photoFiles = "error_field_required";
    }
    if (!data.deadline) errors.deadline = "error_field_required";
    if (!data.hasDomain) errors.hasDomain = "error_field_required";
    if (data.hasDomain === "yes" && !data.domainName.trim()) {
      errors.domainName = "error_field_required";
    }
    if (!data.budget) errors.budget = "error_field_required";
  }
  if (step === 7) {
    if (!data.firstName.trim()) errors.firstName = "error_field_required";
    if (!data.lastName.trim()) errors.lastName = "error_field_required";
    if (!data.email.trim()) {
      errors.email = "error_field_required";
    } else if (!EMAIL_REGEX.test(data.email.trim())) {
      errors.email = "error_invalid_email";
    }
    if (!data.consent) errors.consent = "error_field_required";
  }
  return { ok: Object.keys(errors).length === 0, errors };
};

export const findFirstInvalidStep = (
  data: EcommerceFormData,
): number | null => {
  for (let step = 1; step <= TOTAL_STEPS; step++) {
    if (!validateStep(step, data).ok) return step;
  }
  return null;
};

const isEcommerceScalars = (
  value: unknown,
): value is EcommerceFormDataScalars => {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.projectName === "string" &&
    typeof v.pitch === "string" &&
    typeof v.audience === "string" &&
    typeof v.consent === "boolean" &&
    Array.isArray(v.productTypes) &&
    Array.isArray(v.paymentMethods) &&
    Array.isArray(v.shippingZones) &&
    Array.isArray(v.shippingMethods) &&
    Array.isArray(v.features) &&
    Array.isArray(v.marketplaceSync) &&
    Array.isArray(v.colors) &&
    Array.isArray(v.adjectives)
  );
};

export const getStorageDraft = (): EcommerceFormDataScalars | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { savedAt?: number; data?: unknown };
    if (
      typeof parsed.savedAt !== "number" ||
      Date.now() - parsed.savedAt > STORAGE_TTL_MS
    ) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    if (!isEcommerceScalars(parsed.data)) return null;
    return parsed.data;
  } catch {
    return null;
  }
};

export const setStorageDraft = (data: EcommerceFormData): void => {
  if (typeof window === "undefined") return;
  try {
    const { logoFile: _logo, photoFiles: _files, ...scalars } = data;
    void _logo;
    void _files;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ savedAt: Date.now(), data: scalars }),
    );
  } catch {
    // localStorage may be full or disabled — silent ignore
  }
};

export const clearStorageDraft = (): void => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
};

export const buildEcommerceFormData = (data: EcommerceFormData): FormData => {
  const includeLogo = data.hasLogo === "yes";
  const includePhotos =
    data.productPhotos === "pro" || data.productPhotos === "to_retouch";
  const { logoFile: _logo, photoFiles: _files, ...rest } = data;
  void _logo;
  void _files;
  const scalars: EcommerceFormDataScalars = {
    ...rest,
    currentPlatform:
      data.currentSales === "other_site" ? data.currentPlatform : "",
    accountingOther:
      data.accounting === "other" ? data.accountingOther : "",
    shippingToolOther:
      data.shippingTool === "other" ? data.shippingToolOther : "",
    colors: data.hasColors === "yes" ? data.colors : [],
    domainName: data.hasDomain === "yes" ? data.domainName : "",
  };
  const body = new FormData();
  body.append("data", JSON.stringify(scalars));
  if (includeLogo && data.logoFile) body.append("logo", data.logoFile);
  if (includePhotos) data.photoFiles.forEach((file) => body.append("photos", file));
  return body;
};
