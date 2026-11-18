import { AppDictionary, Lang, SUPPORTED_LANGUAGES, LanguageMeta } from './types';
import { vi } from './locales/vi';
import { en } from './locales/en';
import { ko } from './locales/ko';
import { ja } from './locales/ja';
import { zh } from './locales/zh';

export type { Lang, AppDictionary, LanguageMeta };
export { SUPPORTED_LANGUAGES };

const dictionaries: Record<Lang, AppDictionary> = {
  vi,
  en,
  ko,
  ja,
  zh,
};

export function isValidLang(value: string | null | undefined): value is Lang {
  return value === 'vi' || value === 'en' || value === 'ko' || value === 'ja' || value === 'zh';
}

export function getDictionary(lang: Lang = 'vi'): AppDictionary {
  return dictionaries[lang] || vi;
}

export function getLanguageMeta(lang: Lang = 'vi'): LanguageMeta {
  return SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];
}

export function formatText(
  template: string,
  vars: Record<string, string | number>
): string {
  return Object.entries(vars).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, String(value)),
    template
  );
}
