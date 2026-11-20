"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { LANGS, LANG_NAMES } from "@/i18n/config";
import { useI18n } from "@/i18n/LanguageProvider";

/** Small globe + language code in the navbar; opens a list of languages written in their own scripts. */
export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t.langSwitcher.label}: ${LANG_NAMES[lang].native}`}
        className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-slate-500 hover:text-teal-600 hover:bg-slate-50 transition-colors"
      >
        <Globe size={14} />
        <span>{LANG_NAMES[lang].short}</span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={t.langSwitcher.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-40 rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl z-50"
          >
            {LANGS.map((code) => (
              <li key={code} role="option" aria-selected={code === lang}>
                <button
                  type="button"
                  lang={code}
                  onClick={() => {
                    setOpen(false);
                    if (code !== lang) setLang(code);
                  }}
                  className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${
                    code === lang ? "bg-teal-50 text-teal-700 font-bold" : "text-slate-600 hover:bg-slate-50 font-medium"
                  }`}
                >
                  {LANG_NAMES[code].native}
                  {code === lang && <Check size={14} />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
