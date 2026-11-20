"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LANG_COOKIE, type Lang } from "./config";
import { dictionaries, type Dictionary } from "./dictionaries";

type LanguageContext = { lang: Lang; t: Dictionary; setLang: (lang: Lang) => void };

const Ctx = createContext<LanguageContext | null>(null);

export function LanguageProvider({ initialLang, children }: { initialLang: Lang; children: React.ReactNode }) {
  const router = useRouter();
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback(
    (next: Lang) => {
      setLangState(next);
      document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
      // Server-rendered pages (e.g. My Account) pick up the new language.
      router.refresh();
    },
    [router],
  );

  return <Ctx.Provider value={{ lang, t: dictionaries[lang], setLang }}>{children}</Ctx.Provider>;
}

/** Current language, its strings, and a setter. Outside the provider it falls back to English. */
export function useI18n(): LanguageContext {
  return useContext(Ctx) ?? { lang: "en", t: dictionaries.en, setLang: () => {} };
}
