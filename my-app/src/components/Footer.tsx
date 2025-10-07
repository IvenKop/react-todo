import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-[70px] flex flex-col items-center justify-center leading-[0] text-[#5c5c5c]">
      <p className="footer-page_advice">{t("footer.doubleClick")}</p>
      <p className="footer-page__team-name">{t("footer.createdBy")}</p>
      <p className="footer-page__part">
        {t("footer.partOf", { brand: "Devico" })}
      </p>
    </footer>
  );
}
