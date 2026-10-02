import { type I18n } from '@lingui/core';
import { Column, Container, Row } from 'react-email';
import { type Brand } from 'twenty-shared/types';

import { Link } from 'src/components/Link';
import { ShadowText } from 'src/components/ShadowText';

const footerContainerStyle = {
  marginTop: '12px',
};

type FooterProps = {
  i18n: I18n;
  brand: Brand;
};

export const Footer = ({ i18n, brand }: FooterProps) => {
  if (brand.isWhiteLabeled) {
    const brandName = brand.name;

    return (
      <Container style={footerContainerStyle}>
        <Row>
          <Column>
            <ShadowText>
              <Link
                href={brand.websiteUrl}
                value={i18n._('Website')}
                aria-label={i18n._("Visit {brandName}'s website", {
                  brandName,
                })}
              />
            </ShadowText>
          </Column>
          <Column>
            <ShadowText>
              <Link
                href={brand.docsUrl}
                value={i18n._('Documentation')}
                aria-label={i18n._("Read {brandName}'s documentation", {
                  brandName,
                })}
              />
            </ShadowText>
          </Column>
        </Row>
      </Container>
    );
  }

  return (
    <Container style={footerContainerStyle}>
      <Row>
        <Column>
          <ShadowText>
            <Link
              href="https://twenty.com/"
              value={i18n._('Website')}
              aria-label={i18n._("Visit Twenty's website")}
            />
          </ShadowText>
        </Column>
        <Column>
          <ShadowText>
            <Link
              href="https://github.com/twentyhq/twenty"
              value={i18n._('Github')}
              aria-label={i18n._("Visit Twenty's GitHub repository")}
            />
          </ShadowText>
        </Column>
        <Column>
          <ShadowText>
            <Link
              href="https://docs.twenty.com/getting-started/introduction"
              value={i18n._('User guide')}
              aria-label={i18n._("Read Twenty's user guide")}
            />
          </ShadowText>
        </Column>
        <Column>
          <ShadowText>
            <Link
              href="https://docs.twenty.com/"
              value={i18n._('Developers')}
              aria-label={i18n._("Visit Twenty's developer documentation")}
            />
          </ShadowText>
        </Column>
      </Row>
      <ShadowText>
        <>
          {i18n._('Twenty.com, Public Benefit Corporation')}
          <br />
          {i18n._('San Francisco / Paris')}
        </>
      </ShadowText>
    </Container>
  );
};
