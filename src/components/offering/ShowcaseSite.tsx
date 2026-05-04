import { useState } from "react";
import { Send } from "lucide-react";
import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

type TechnicalItem = { name: string; desc: string };
type Option = { label: string; value: string };

export type ShowcaseFormData = {
  activity: string;
  audience: string;
  goal: string;
  inspirations: string;
  adjectives: string[];
  brandAssets: string;
  logoFile: File | null;
  colors: string[];
  photos: string;
  photoFiles: File[];
  sections: string[];
  deadline: string;
  hasDomain: "yes" | "no" | "";
  domainName: string;
  notes: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  projectName: string;
  consent: boolean;
};

type Props = {
  onFormSubmit?: (data: ShowcaseFormData) => Promise<void>;
};

const SHOWCASE_FORM_ENDPOINT = `${import.meta.env.VITE_API_BASE_URL}/form/showcase-form`;

const buildShowcaseFormData = (data: ShowcaseFormData): FormData => {
  const { logoFile, photoFiles, ...scalars } = data;
  const body = new FormData();
  body.append("data", JSON.stringify(scalars));
  if (logoFile) body.append("logo", logoFile);
  photoFiles.forEach((file) => body.append("photos", file));
  return body;
};

const submitShowcaseForm = async (data: ShowcaseFormData): Promise<void> => {
  const response = await fetch(SHOWCASE_FORM_ENDPOINT, {
    method: "POST",
    body: buildShowcaseFormData(data),
  });
  if (!response.ok) {
    throw new Error(`Showcase form submission failed: ${response.status}`);
  }
};

const EMPTY_STATE: ShowcaseFormData = {
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

const DEV_PREFILLED_STATE: ShowcaseFormData = {
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

const INITIAL_STATE: ShowcaseFormData = import.meta.env.DEV ? DEV_PREFILLED_STATE : EMPTY_STATE;

const ShowcaseSite = ({
  onFormSubmit = submitShowcaseForm,
}: Props) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "fr" ? "fr" : "en";
  const ns = "offering.offerings.showcase_site";

  const features = t(`${ns}.features`, { returnObjects: true }) as string[];
  const technical = t(`${ns}.technical`, { returnObjects: true }) as TechnicalItem[];

  const goalOptions = t(`${ns}.form.section_activity.goal_options`, { returnObjects: true }) as Option[];
  const adjectiveOptions = t(`${ns}.form.section_visual.adjective_options`, { returnObjects: true }) as Option[];
  const brandOptions = t(`${ns}.form.section_content.brand_options`, { returnObjects: true }) as Option[];
  const photosOptions = t(`${ns}.form.section_content.photos_options`, { returnObjects: true }) as Option[];
  const sectionsOptions = t(`${ns}.form.section_content.sections_options`, { returnObjects: true }) as Option[];
  const deadlineOptions = t(`${ns}.form.section_practical.deadline_options`, { returnObjects: true }) as Option[];

  const [formData, setFormData] = useState<ShowcaseFormData>(INITIAL_STATE);
  const [colorDraft, setColorDraft] = useState("#ff6b35");

  const addColor = () => {
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

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.activity.trim() ||
      !formData.audience.trim() ||
      !formData.goal ||
      !formData.brandAssets ||
      !formData.photos ||
      !formData.deadline ||
      !formData.hasDomain ||
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.projectName.trim()
    ) {
      toast.error(t(`${ns}.form.error_required`));
      return;
    }
    if (!formData.consent) {
      toast.error(t(`${ns}.form.consent_required`));
      return;
    }
    setSubmitting(true);
    try {
      await onFormSubmit(formData);
      toast.success(t(`${ns}.form.success`));
      setFormData(INITIAL_STATE);
    } catch {
      toast.error(t(`${ns}.form.error_submit`));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-xl font-semibold mb-3">{t(`${ns}.context_title`)}</h3>
        <p className="text-foreground/80 leading-relaxed">{t(`${ns}.context_text`)}</p>
      </section>

      <section>
        <div className="border-t border-border pt-8">
          <h3 className="text-2xl font-bold mb-2">{t(`${ns}.form.title`)}</h3>
          <p className="text-foreground/70 mb-6">{t(`${ns}.form.intro`)}</p>

          <form onSubmit={handleSubmit} className="space-y-10">
            <fieldset className="space-y-6">
              <legend className="text-lg font-semibold mb-2">
                {t(`${ns}.form.section_activity.title`)}
              </legend>

              <div>
                <label htmlFor="projectName" className="block text-sm font-medium mb-2">
                  {t(`${ns}.form.section_contact.project_name_label`)}
                </label>
                <Input
                  id="projectName"
                  name="projectName"
                  type="text"
                  placeholder={t(`${ns}.form.section_contact.project_name_placeholder`)}
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className="h-12"
                />
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
                  onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                  className="h-12"
                />
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
                  onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                  className="h-12"
                />
              </div>

              <div>
                <span className="block text-sm font-medium mb-2">
                  {t(`${ns}.form.section_activity.goal_label`)}
                </span>
                <RadioGroup
                  value={formData.goal}
                  onValueChange={(value) => setFormData({ ...formData, goal: value })}
                  className="gap-2"
                >
                  {goalOptions.map((opt) => (
                    <label key={opt.value} htmlFor={`goal-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                      <RadioGroupItem id={`goal-${opt.value}`} value={opt.value} />
                      <span className="text-foreground/80">{opt.label}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </fieldset>

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
                  onChange={(e) => setFormData({ ...formData, inspirations: e.target.value })}
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

            <fieldset className="space-y-6">
              <legend className="text-lg font-semibold mb-2">
                {t(`${ns}.form.section_content.title`)}
              </legend>

              <div>
                <span className="block text-sm font-medium mb-2">
                  {t(`${ns}.form.section_content.brand_label`)}
                </span>
                <RadioGroup
                  value={formData.brandAssets}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      brandAssets: value,
                      logoFile: value === "yes" || value === "logo_only" ? formData.logoFile : null,
                      colors: value === "yes" ? formData.colors : [],
                    })
                  }
                  className="gap-2"
                >
                  {brandOptions.map((opt) => (
                    <label key={opt.value} htmlFor={`brand-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                      <RadioGroupItem id={`brand-${opt.value}`} value={opt.value} />
                      <span className="text-foreground/80">{opt.label}</span>
                    </label>
                  ))}
                </RadioGroup>

                {(formData.brandAssets === "yes" || formData.brandAssets === "logo_only") && (
                  <div className="mt-4">
                    <label htmlFor="logoFile" className="block text-sm font-medium mb-2">
                      {t(`${ns}.form.section_content.logo_upload_label`)}
                    </label>
                    <Input
                      id="logoFile"
                      name="logoFile"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFormData({ ...formData, logoFile: e.target.files?.[0] ?? null })
                      }
                      className="h-12"
                    />
                    {formData.logoFile && (
                      <p className="text-sm text-foreground/60 mt-2">{formData.logoFile.name}</p>
                    )}
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
                      <Button type="button" variant="outline" onClick={addColor}>
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
                <span className="block text-sm font-medium mb-2">
                  {t(`${ns}.form.section_content.photos_label`)}
                </span>
                <RadioGroup
                  value={formData.photos}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      photos: value,
                      photoFiles: value === "yes" ? formData.photoFiles : [],
                    })
                  }
                  className="gap-2"
                >
                  {photosOptions.map((opt) => (
                    <label key={opt.value} htmlFor={`photos-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                      <RadioGroupItem id={`photos-${opt.value}`} value={opt.value} />
                      <span className="text-foreground/80">{opt.label}</span>
                    </label>
                  ))}
                </RadioGroup>

                {formData.photos === "yes" && (
                  <div className="mt-4">
                    <label htmlFor="photoFiles" className="block text-sm font-medium mb-2">
                      {t(`${ns}.form.section_content.photos_upload_label`)}
                    </label>
                    <Input
                      id="photoFiles"
                      name="photoFiles"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          photoFiles: Array.from(e.target.files ?? []),
                        })
                      }
                      className="h-12"
                    />
                    {formData.photoFiles.length > 0 && (
                      <ul className="mt-2 space-y-1 text-sm text-foreground/60">
                        {formData.photoFiles.map((file, i) => (
                          <li key={`${file.name}-${i}`}>{file.name}</li>
                        ))}
                      </ul>
                    )}
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
              </div>
            </fieldset>

            <fieldset className="space-y-6">
              <legend className="text-lg font-semibold mb-2">
                {t(`${ns}.form.section_practical.title`)}
              </legend>

              <div>
                <span className="block text-sm font-medium mb-2">
                  {t(`${ns}.form.section_practical.deadline_label`)}
                </span>
                <RadioGroup
                  value={formData.deadline}
                  onValueChange={(value) => setFormData({ ...formData, deadline: value })}
                  className="gap-2"
                >
                  {deadlineOptions.map((opt) => (
                    <label key={opt.value} htmlFor={`deadline-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                      <RadioGroupItem id={`deadline-${opt.value}`} value={opt.value} />
                      <span className="text-foreground/80">{opt.label}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <span className="block text-sm font-medium mb-2">
                  {t(`${ns}.form.section_practical.domain_label`)}
                </span>
                <RadioGroup
                  value={formData.hasDomain}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      hasDomain: value as "yes" | "no",
                      domainName: value === "yes" ? formData.domainName : "",
                    })
                  }
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
                      onChange={(e) => setFormData({ ...formData, domainName: e.target.value })}
                      className="h-12"
                    />
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
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                />
              </div>
            </fieldset>

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
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="h-12"
                  />
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
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="h-12"
                  />
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
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12"
                />
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
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                  onCheckedChange={(c) => setFormData({ ...formData, consent: c === true })}
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
            </fieldset>

            <Button
              type="submit"
              size="lg"
              disabled={submitting || !formData.consent}
              className="w-full bg-gradient-warm shadow-soft hover:shadow-hover transition-all duration-300"
            >
              {t(`${ns}.form.submit`)}
              <Send className="ml-2" size={18} />
            </Button>
          </form>
        </div>
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
    </div>
  );
};

export default ShowcaseSite;
