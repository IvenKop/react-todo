import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { isAuthed, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <header>
      <nav className="fixed right-[30px] top-[20px] z-[50]">
        <div className="flex h-[48px] items-center rounded-[999px] border-[1px] border-[#e9e9e9] bg-[rgba(255,255,255,0.80)] px-[6px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] backdrop-blur-[4px]">
          {isAuthed && (
            <button
              type="button"
              onClick={logout}
              className="inline-flex h-[36px] items-center gap-[8px] rounded-[18px] px-[12px] text-[14px] leading-[0] text-[#1f2937] transition-[background-color,transform] duration-[150ms] hover:bg-[#f6f6f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b83f45]/30 active:scale-[1.02]"
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
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
              </svg>
              {t("logout", { defaultValue: "Logout" })}
            </button>
          )}

          <span className="mx-[10px] h-[24px] w-[1px] bg-[#e8e8e8]" />

          <LanguageSwitcher />
        </div>
      </nav>

      <h1 className="mt-[80px] text-center text-[80px] font-[200] text-[rgb(184,63,69)]">
        todos
      </h1>
    </header>
  );
}
