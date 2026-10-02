import { DEFAULT_BRAND } from 'twenty-shared/constants';

import { getBrandLegalUrl } from '@/auth/utils/getBrandLegalUrl';

const WHITE_LABELED_BRAND = {
  ...DEFAULT_BRAND,
  isWhiteLabeled: true,
  name: 'Acme CRM',
  websiteUrl: 'https://acme.test',
  termsUrl: 'https://acme.test/terms',
};

describe('getBrandLegalUrl', () => {
  it.each([
    ['ar-SA', 'ar'],
    ['cs-CZ', 'cs'],
    ['de-DE', 'de'],
    ['es-ES', 'es'],
    ['fr-FR', 'fr'],
    ['it-IT', 'it'],
    ['ja-JP', 'ja'],
    ['ko-KR', 'ko'],
    ['pt-BR', 'pt'],
    ['pt-PT', 'pt'],
    ['ro-RO', 'ro'],
    ['ru-RU', 'ru'],
    ['tr-TR', 'tr'],
    ['zh-CN', 'zh'],
    ['zh-TW', 'zh'],
  ])('uses the localized Twenty website path for %s', (locale, language) => {
    expect(
      getBrandLegalUrl({ brand: DEFAULT_BRAND, locale, page: 'privacy' }),
    ).toBe(`https://twenty.com/${language}/privacy-policy`);
  });

  it('uses the default Twenty website path for English', () => {
    expect(
      getBrandLegalUrl({ brand: DEFAULT_BRAND, locale: 'en', page: 'terms' }),
    ).toBe('https://twenty.com/terms');
  });

  it('uses English for the pseudo locale', () => {
    expect(
      getBrandLegalUrl({
        brand: DEFAULT_BRAND,
        locale: 'pseudo-en',
        page: 'terms',
      }),
    ).toBe('https://twenty.com/terms');
  });

  it('never localizes the Twenty DPA', () => {
    expect(
      getBrandLegalUrl({ brand: DEFAULT_BRAND, locale: 'fr-FR', page: 'dpa' }),
    ).toBe('https://twenty.com/legal/dpa');
  });

  it('uses the configured page on a white-labeled instance', () => {
    expect(
      getBrandLegalUrl({
        brand: WHITE_LABELED_BRAND,
        locale: 'fr-FR',
        page: 'terms',
      }),
    ).toBe('https://acme.test/terms');
  });

  it('returns null for an unset page on a white-labeled instance', () => {
    expect(
      getBrandLegalUrl({
        brand: WHITE_LABELED_BRAND,
        locale: 'en',
        page: 'privacy',
      }),
    ).toBeNull();
  });
});
