import { Font, Head } from 'react-email';
import { type Brand } from 'twenty-shared/types';

import { canvasTheme } from 'src/common-style';

type BaseHeadProps = {
  brand: Brand;
};

export const BaseHead = ({ brand }: BaseHeadProps) => {
  return (
    <Head>
      <title>{`${brand.name} email`}</title>
      <Font
        fontFamily={canvasTheme.font.family}
        fallbackFontFamily="sans-serif"
        fontStyle="normal"
        fontWeight={canvasTheme.font.weight.regular}
      />
    </Head>
  );
};
