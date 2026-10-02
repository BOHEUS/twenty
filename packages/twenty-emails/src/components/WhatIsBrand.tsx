import { type I18n } from '@lingui/core';
import { type Brand } from 'twenty-shared/types';

import { MainText } from 'src/components/MainText';
import { SubTitle } from 'src/components/SubTitle';

type WhatIsBrandProps = {
  i18n: I18n;
  brand: Brand;
};

export const WhatIsBrand = ({ i18n, brand }: WhatIsBrandProps) => {
  return (
    <>
      <SubTitle
        value={i18n._('What is {brandName}?', { brandName: brand.name })}
      />
      <MainText>
        {i18n._(
          "It's a CRM, a software to help businesses manage their customer data and relationships efficiently.",
        )}
      </MainText>
    </>
  );
};
