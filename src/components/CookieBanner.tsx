import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const STORAGE_KEY = "cookie-info-dismissed";

const CookieBanner = () => {
  const { t, i18n } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY) !== "1") {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, "1");
    }
    setVisible(false);
  };

  if (!visible) return null;

  const lang = i18n.language === "fr" ? "fr" : "en";

  return (
    <div
      role="region"
      aria-label="Cookies"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 bg-card border border-border rounded-xl shadow-soft p-4"
    >
      <div className="flex items-start gap-3">
        <p className="text-sm text-foreground/80 leading-relaxed flex-1">
          {t("cookies.banner.text")}{" "}
          <Link
            to={`/${lang}/confidentialite`}
            className="text-primary underline hover:no-underline"
          >
            {t("cookies.banner.learn_more")}
          </Link>
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label={t("cookies.banner.dismiss")}
          className="text-foreground/60 hover:text-foreground shrink-0"
        >
          <X size={18} />
        </button>
      </div>
      <div className="mt-3 flex justify-end">
        <Button size="sm" onClick={dismiss}>
          {t("cookies.banner.dismiss")}
        </Button>
      </div>
    </div>
  );
};

export default CookieBanner;
