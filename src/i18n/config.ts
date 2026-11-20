/** Languages the public site can be shown in. English is the default and the source of every string. */
export const LANGS = ["en", "ml", "hi"] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "en";

/** Cookie that remembers the visitor's choice (read on the server so pages render in the right language). */
export const LANG_COOKIE = "lang";

/** Names shown in the language switcher, each in its own script. */
export const LANG_NAMES: Record<Lang, { native: string; short: string }> = {
  en: { native: "English", short: "EN" },
  ml: { native: "മലയാളം", short: "മല" },
  hi: { native: "हिन्दी", short: "हिं" },
};

/** Locale used for dates (weekday and month names) in each language. */
export const DATE_LOCALES: Record<Lang, string> = { en: "en-AU", ml: "ml-IN", hi: "hi-IN" };

export function toLang(value: string | undefined | null): Lang {
  return LANGS.includes(value as Lang) ? (value as Lang) : DEFAULT_LANG;
}
