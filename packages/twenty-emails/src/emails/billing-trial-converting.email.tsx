import { Trans } from '@lingui/react';
import { BaseEmail } from 'src/components/BaseEmail';
import { CallToAction } from 'src/components/CallToAction';
import { MainText } from 'src/components/MainText';
import { Title } from 'src/components/Title';
import { createI18nInstance } from 'src/utils/i18n.utils';
import { DEFAULT_BRAND } from 'twenty-shared/constants';
import { type APP_LOCALES } from 'twenty-shared/translations';
import { type Brand } from 'twenty-shared/types';

type BillingTrialConvertingEmailProps = {
  userName: string;
  workspaceDisplayName: string | undefined;
  trialEndsAt: Date;
  interval: 'month' | 'year';
  link: string;
  locale: keyof typeof APP_LOCALES;
  brand: Brand;
};

// Sent 7 days before a carded trial converts, so the first charge is never a surprise.
export const BillingTrialConvertingEmail = ({
  userName,
  workspaceDisplayName,
  trialEndsAt,
  interval,
  link,
  locale,
  brand,
}: BillingTrialConvertingEmailProps) => {
  const i18n = createI18nInstance(locale);
  const formattedDate = i18n.date(trialEndsAt, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <BaseEmail width={333} locale={locale} brand={brand}>
      <Title value={i18n._('A heads up before your trial ends')} />
      <MainText>
        {userName?.length > 1 ? (
          <Trans id="Hi {userName}," values={{ userName }} />
        ) : (
          <Trans id="Hello," />
        )}
        <br />
        <br />
        <Trans id="We don't like surprise charges, so here's a friendly heads up." />
        <br />
        <br />
        {interval === 'year' ? (
          <Trans
            id="Your free trial of <0>{workspaceDisplayName}</0> ends on {formattedDate}. Unless you cancel before then, the card on file will be charged for your annual plan."
            values={{ workspaceDisplayName, formattedDate }}
            components={{ 0: <b /> }}
          />
        ) : (
          <Trans
            id="Your free trial of <0>{workspaceDisplayName}</0> ends on {formattedDate}. Unless you cancel before then, the card on file will be charged for your monthly plan."
            values={{ workspaceDisplayName, formattedDate }}
            components={{ 0: <b /> }}
          />
        )}
        <br />
        <br />
        <Trans
          id="If {brandName} is working for you, you're all set — there's nothing to do. If it's not the right fit, you can cancel in one click before then and you won't be charged."
          values={{ brandName: brand.name }}
        />
      </MainText>
      <br />
      <CallToAction href={link} value={i18n._('Manage subscription')} />
      <br />
      <br />
    </BaseEmail>
  );
};

BillingTrialConvertingEmail.PreviewProps = {
  userName: 'John Doe',
  workspaceDisplayName: 'Acme Inc.',
  trialEndsAt: new Date('2026-07-02'),
  interval: 'month',
  link: 'https://acme.twenty.com/settings/billing',
  locale: 'en',
  brand: DEFAULT_BRAND,
} as BillingTrialConvertingEmailProps;

export default BillingTrialConvertingEmail;
