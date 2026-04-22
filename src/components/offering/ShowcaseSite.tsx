import { useState } from "react";
import { Send } from "lucide-react";
import { useTranslation } from "react-i18next";
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
  photos: string;
  sections: string[];
  hasDomain: "yes" | "no" | "";
  domainName: string;
  notes: string;
};

type Props = {
  onFormSubmit?: (data: ShowcaseFormData) => void;
};

const INITIAL_STATE: ShowcaseFormData = {
  activity: "",
  audience: "",
  goal: "",
  inspirations: "",
  adjectives: [],
  brandAssets: "",
  photos: "",
  sections: ["about", "services", "contact"],
  hasDomain: "",
  domainName: "",
  notes: "",
};

const ShowcaseSite = ({
  onFormSubmit = (data) => console.log("[ShowcaseSite] form submit", data),
}: Props) => {
  const { t } = useTranslation();
  const ns = "offering.offerings.showcase_site";

  const features = t(`${ns}.features`, { returnObjects: true }) as string[];
  const technical = t(`${ns}.technical`, { returnObjects: true }) as TechnicalItem[];

  const goalOptions = t(`${ns}.form.section_activity.goal_options`, { returnObjects: true }) as Option[];
  const adjectiveOptions = t(`${ns}.form.section_visual.adjective_options`, { returnObjects: true }) as Option[];
  const brandOptions = t(`${ns}.form.section_content.brand_options`, { returnObjects: true }) as Option[];
  const photosOptions = t(`${ns}.form.section_content.photos_options`, { returnObjects: true }) as Option[];
  const sectionsOptions = t(`${ns}.form.section_content.sections_options`, { returnObjects: true }) as Option[];

  const [formData, setFormData] = useState<ShowcaseFormData>(INITIAL_STATE);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.activity.trim() ||
      !formData.audience.trim() ||
      !formData.goal ||
      !formData.brandAssets ||
      !formData.photos ||
      !formData.hasDomain
    ) {
      toast.error(t(`${ns}.form.error_required`));
      return;
    }
    onFormSubmit(formData);
    toast.success(t(`${ns}.form.success`));
    setFormData(INITIAL_STATE);
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
                  onValueChange={(value) => setFormData({ ...formData, brandAssets: value })}
                  className="gap-2"
                >
                  {brandOptions.map((opt) => (
                    <label key={opt.value} htmlFor={`brand-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                      <RadioGroupItem id={`brand-${opt.value}`} value={opt.value} />
                      <span className="text-foreground/80">{opt.label}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <span className="block text-sm font-medium mb-2">
                  {t(`${ns}.form.section_content.photos_label`)}
                </span>
                <RadioGroup
                  value={formData.photos}
                  onValueChange={(value) => setFormData({ ...formData, photos: value })}
                  className="gap-2"
                >
                  {photosOptions.map((opt) => (
                    <label key={opt.value} htmlFor={`photos-${opt.value}`} className="flex items-center gap-3 cursor-pointer">
                      <RadioGroupItem id={`photos-${opt.value}`} value={opt.value} />
                      <span className="text-foreground/80">{opt.label}</span>
                    </label>
                  ))}
                </RadioGroup>
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

            <Button
              type="submit"
              size="lg"
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
