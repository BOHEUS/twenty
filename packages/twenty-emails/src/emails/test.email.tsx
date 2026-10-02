import { BaseEmail } from 'src/components/BaseEmail';
import { Title } from 'src/components/Title';
import { createI18nInstance } from 'src/utils/i18n.utils';
import { DEFAULT_BRAND } from 'twenty-shared/constants';
import { type APP_LOCALES } from 'twenty-shared/translations';
import { type Brand } from 'twenty-shared/types';

type TestEmailProps = {
  locale: keyof typeof APP_LOCALES;
  brand: Brand;
};

// This is a test email which isn't used in production
// It's useful to do tests and play in a local environment
export const TestEmail = ({ locale, brand }: TestEmailProps) => {
  const i18n = createI18nInstance(locale);

  return (
    <BaseEmail locale={locale} brand={brand}>
      <Title value={i18n._('Test email')} />
      <br />
      <br />
    </BaseEmail>
  );
};

TestEmail.PreviewProps = {
  locale: 'en',
  brand: DEFAULT_BRAND,
};

export default TestEmail;
