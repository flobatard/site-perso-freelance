export type Goal = "" | "seo" | "trust" | "offers" | "link";
export type BrandAssets = "" | "yes" | "no" | "logo_only";
export type Photos = "" | "yes" | "no";
export type Deadline = "" | "lt_2_weeks" | "1_month" | "1_to_3_months" | "3_to_6_months";
export type HasDomain = "" | "yes" | "no";

export type ShowcaseFormData = {
  activity: string;
  audience: string;
  goal: Goal;
  inspirations: string;
  adjectives: string[];
  brandAssets: BrandAssets;
  logoFile: File | null;
  colors: string[];
  photos: Photos;
  photoFiles: File[];
  sections: string[];
  customSections: string[];
  deadline: Deadline;
  hasDomain: HasDomain;
  domainName: string;
  notes: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  projectName: string;
  consent: boolean;
};

export type ShowcaseFormDataScalars = Omit<ShowcaseFormData, "logoFile" | "photoFiles">;

export type FieldErrors = Partial<Record<keyof ShowcaseFormData, string>>;

export const TOTAL_STEPS = 5;
export const STORAGE_KEY = "showcase_form_draft";
export const STORAGE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_PHOTOS_TOTAL_BYTES = 50 * 1024 * 1024;
export const MAX_FILE_SIZE_LABEL = "10 Mo";
export const MAX_PHOTOS_TOTAL_LABEL = "50 Mo";
export const MAX_COLORS = 6;
export const MAX_CUSTOM_SECTIONS = 5;
export const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
] as const;
export const ACCEPTED_IMAGE_ATTR = ACCEPTED_IMAGE_TYPES.join(",");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const EMPTY_STATE: ShowcaseFormData = {
  activity: "",
  audience: "",
  goal: "",
  inspirations: "",
  adjectives: [],
  brandAssets: "",
  logoFile: null,
  colors: [],
  photos: "",
  photoFiles: [],
  sections: ["about", "services", "contact"],
  customSections: [],
  deadline: "",
  hasDomain: "",
  domainName: "",
  notes: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  projectName: "",
  consent: false,
};

export const DEV_PREFILLED_STATE: ShowcaseFormData = {
  activity: "Boulangerie artisanale de quartier",
  audience: "Particuliers et professionnels du quartier",
  goal: "trust",
  inspirations: "https://example-bakery.com — style chaleureux et photos en plein cadre",
  adjectives: ["warm", "premium"],
  brandAssets: "yes",
  logoFile: null,
  colors: ["#ff6b35", "#2d2d2d"],
  photos: "no",
  photoFiles: [],
  sections: ["about", "services", "contact", "testimonials"],
  customSections: ["Recettes du chef", "Événements privés"],
  deadline: "1_to_3_months",
  hasDomain: "yes",
  domainName: "ma-boulangerie.fr",
  notes: "Préremplissage dev — à ignorer en prod.",
  firstName: "Florian",
  lastName: "Batard",
  email: "fb.batard@gmail.com",
  phone: "+33 6 00 00 00 00",
  projectName: "Site vitrine boulangerie (DEV)",
  consent: true,
};

export const INITIAL_STATE: ShowcaseFormData = import.meta.env.DEV
  ? DEV_PREFILLED_STATE
  : EMPTY_STATE;
export const INITIAL_STEP = import.meta.env.DEV ? 5 : 1;

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

export const validateStep = (step: number, data: ShowcaseFormData): StepValidationResult => {
  const errors: FieldErrors = {};
  if (step === 1) {
    if (!data.projectName.trim()) errors.projectName = "error_field_required";
    if (!data.activity.trim()) errors.activity = "error_field_required";
    if (!data.audience.trim()) errors.audience = "error_field_required";
    if (!data.goal) errors.goal = "error_field_required";
  }
  if (step === 3) {
    if (!data.brandAssets) errors.brandAssets = "error_field_required";
    if ((data.brandAssets === "yes" || data.brandAssets === "logo_only") && !data.logoFile) {
      errors.logoFile = "error_field_required";
    }
    if (!data.photos) errors.photos = "error_field_required";
    if (data.photos === "yes" && data.photoFiles.length === 0) {
      errors.photoFiles = "error_field_required";
    }
  }
  if (step === 4) {
    if (!data.deadline) errors.deadline = "error_field_required";
    if (!data.hasDomain) errors.hasDomain = "error_field_required";
    if (data.hasDomain === "yes" && !data.domainName.trim()) {
      errors.domainName = "error_field_required";
    }
  }
  if (step === 5) {
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

export const findFirstInvalidStep = (data: ShowcaseFormData): number | null => {
  for (let step = 1; step <= TOTAL_STEPS; step++) {
    if (!validateStep(step, data).ok) return step;
  }
  return null;
};

const isShowcaseScalars = (value: unknown): value is ShowcaseFormDataScalars => {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.activity === "string" &&
    typeof v.audience === "string" &&
    typeof v.consent === "boolean" &&
    Array.isArray(v.colors) &&
    Array.isArray(v.adjectives) &&
    Array.isArray(v.sections) &&
    Array.isArray(v.customSections)
  );
};

export const getStorageDraft = (): ShowcaseFormDataScalars | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { savedAt?: number; data?: unknown };
    if (typeof parsed.savedAt !== "number" || Date.now() - parsed.savedAt > STORAGE_TTL_MS) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    if (!isShowcaseScalars(parsed.data)) return null;
    return parsed.data;
  } catch {
    return null;
  }
};

export const setStorageDraft = (data: ShowcaseFormData): void => {
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

export const buildShowcaseFormData = (data: ShowcaseFormData): FormData => {
  const includeLogo = data.brandAssets === "yes" || data.brandAssets === "logo_only";
  const includePhotos = data.photos === "yes";
  const { logoFile: _logo, photoFiles: _files, ...rest } = data;
  void _logo;
  void _files;
  const scalars: ShowcaseFormDataScalars = {
    ...rest,
    colors: data.brandAssets === "yes" ? data.colors : [],
    domainName: data.hasDomain === "yes" ? data.domainName : "",
  };
  const body = new FormData();
  body.append("data", JSON.stringify(scalars));
  if (includeLogo && data.logoFile) body.append("logo", data.logoFile);
  if (includePhotos) data.photoFiles.forEach((file) => body.append("photos", file));
  return body;
};
