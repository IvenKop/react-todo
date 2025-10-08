import { useAuth } from "../auth/AuthContext";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { logout, isAuthed } = useAuth();
  const { t } = useTranslation();

  return (
    <footer className="mt-[70px] flex flex-col items-center justify-center leading-[0] text-[#5c5c5c]">
      <p className="footer-page_advice">{t("footer.doubleClick")}</p>
      <p className="footer-page__team-name">{t("footer.createdBy")}</p>
      <p className="footer-page__part">
        {t("footer.partOf", { brand: "Devico" })}
      </p>

      {isAuthed && (
        <button
          onClick={logout}
          className="mt-[20px] cursor-pointer rounded-xl border-none bg-[#fff] px-[10px] py-[5px] text-[15px] font-[400] shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-150 hover:bg-[rgb(184,63,69)] hover:text-[#fff] active:translate-y-[1px]"
        >
          Logout
        </button>
      )}
    </footer>
  );
}
