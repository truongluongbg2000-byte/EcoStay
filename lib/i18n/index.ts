import { AppDictionary, Lang, SUPPORTED_LANGUAGES, LanguageMeta } from './types';
import { vi } from './locales/vi';
import { en } from './locales/en';
import { ko } from './locales/ko';
import { ja } from './locales/ja';
import { zh } from './locales/zh';
import { destinationTextEn, destinationBadgeEn } from '@/data/destinationTranslations';

export type { Lang, AppDictionary, LanguageMeta };
export { SUPPORTED_LANGUAGES };

// Venue copy is authored in Vietnamese; non-Vietnamese UIs show English text for venues
// (names and street addresses stay as-is) instead of falling back to Vietnamese.
const englishVenueText: AppDictionary['data']['destinations'] = Object.fromEntries(
  Object.entries(destinationTextEn).map(([id, v]) => [
    id,
    { name: '', title: v.title, desc: v.desc, badge: destinationBadgeEn[id] || '', categoryName: '' },
  ])
);

function withVenueText(dict: AppDictionary): AppDictionary {
  return {
    ...dict,
    data: { ...dict.data, destinations: { ...englishVenueText, ...dict.data.destinations } },
  };
}

const dictionaries: Record<Lang, AppDictionary> = {
  vi,
  en: withVenueText(en),
  ko: withVenueText(ko),
  ja: withVenueText(ja),
  zh: withVenueText(zh),
};

export { localizePrice } from '@/data/destinationTranslations';

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
