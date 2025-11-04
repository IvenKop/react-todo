import i18next from "i18next";

export function errorText(e: unknown): string {
  return e instanceof Error ? e.message : i18next.t("error.unknown");
}