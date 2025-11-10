import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";
import AboutDialog from "./AboutDialog";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const { isAuthed, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();

  const isTasksActive = location.pathname === "/";
  const is3DActive = location.pathname === "/3d-report";

  const baseTab =
    "inline-flex items-center justify-center h-[32px] px-[14px] rounded-[16px] text-[13px] leading-[1] no-underline transition-all duration-[150ms]";

  const tasksClass = [
    baseTab,
    isTasksActive
      ? "bg-[#b83f45] text-[#fff] shadow-[0_2px_6px_rgba(184,63,69,0.35)]"
      : "text-[#374151] hover:bg-[#f6f6f6] hover:text-[#b83f45]",
  ].join(" ");

  const view3DClass = [
    baseTab,
    is3DActive
      ? "bg-[#b83f45] text-[#fff] shadow-[0_2px_6px_rgba(184,63,69,0.35)]"
      : "text-[#374151] hover:bg-[#f6f6f6] hover:text-[#b83f45]",
  ].join(" ");

  return (
    <header>
      <nav className="fixed right-[16px] top-[16px] z-[50]">
        <div className="flex h-[48px] items-center gap-[8px] rounded-[999px] border-[1px] border-[#e5e5e5] bg-[rgba(255,255,255,0.9)] px-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.08)] backdrop-blur-[6px]">
          {isAuthed && (
            <>
              <Link to="/" className={tasksClass}>
                Tasks
              </Link>
              <Link to="/3d-report" className={view3DClass}>
                3D View
              </Link>
            </>
          )}

          {isAuthed && (
            <button
              type="button"
              onClick={logout}
              className="inline-flex h-[32px] cursor-pointer items-center gap-[6px] rounded-[16px] px-[12px] text-[13px] text-[#374151] no-underline transition-all duration-[150ms] hover:bg-[#f6f6f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b83f45]/25 active:scale-[1.01]"
              aria-label={t("logout", { defaultValue: "Logout" })}
              title={t("logout", { defaultValue: "Logout" })}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
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

          <span className="mx-[4px] hidden h-[22px] w-[1px] bg-[#e1e1e1] sm:block" />
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
