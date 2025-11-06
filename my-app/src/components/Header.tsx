import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";
import AboutDialog from "./AboutDialog";

export default function Header() {
  const { isAuthed, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <header>
      <nav className="fixed right-[16px] top-[16px] z-[50]">
        <div className="flex h-[48px] items-center gap-[8px] rounded-[999px] border-[1px] border-[#e5e5e5] bg-[rgba(255,255,255,0.8)] px-[8px] shadow-[0_2px_10px_rgba(0,0,0,0.08)] backdrop-blur-[6px]">
          {isAuthed && (
            <button
              type="button"
              onClick={logout}
              className="inline-flex h-[36px] items-center gap-[8px] rounded-[18px] px-[12px] text-[14px] text-[#1f2937] transition-all duration-[150ms] hover:bg-[#f6f6f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b83f45]/30 active:scale-[1.01]"
              aria-label={t("logout", { defaultValue: "Logout" })}
              title={t("logout", { defaultValue: "Logout" })}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h3" />
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
              <span className="hidden sm:inline">
                {t("logout", { defaultValue: "Logout" })}
              </span>
            </button>
          )}
          <span className="mx-[4px] hidden h-[24px] w-[1px] bg-[#e1e1e1] sm:block" />
          <LanguageSwitcher />
          <AboutDialog />
        </div>
      </nav>
      <h1 className="mt-[96px] text-center text-[80px] font-[200] leading-[1] text-[rgb(184,63,69)]">
        todos
      </h1>
    </header>
  );
}
