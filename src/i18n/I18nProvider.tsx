"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { DICT, type Lang, type TKey } from "./dictionary";

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TKey) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "prise.lang";
const CHANGE_EVENT = "prise:lang";

function readLangFromStorage(): Lang {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "fr" || stored === "en" ? stored : "fr";
  } catch {
    return "fr";
  }
}

function subscribeLang(cb: () => void): () => void {
  window.addEventListener("storage", cb);
  window.addEventListener(CHANGE_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(CHANGE_EVENT, cb);
  };
}

export function I18nProvider({
  children,
  initialLang = "fr",
}: {
  children: ReactNode;
  initialLang?: Lang;
}) {
  // useSyncExternalStore lets us subscribe to localStorage without
  // triggering React 19's "setState in effect" warning.
  const lang = useSyncExternalStore(
    subscribeLang,
    readLangFromStorage,
    () => initialLang
  );

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: next }));
  }, []);

  const t = useCallback(
    (key: TKey) => {
      const table = DICT[lang] as Record<string, string>;
      return table[key] ?? DICT.fr[key] ?? key;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}

export function useT() {
  return useI18n().t;
}
