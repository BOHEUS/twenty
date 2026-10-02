import { Img } from 'react-email';
import { type Brand } from 'twenty-shared/types';

import { TWENTY_LOGO_URL } from 'src/constants/TwentyLogoUrl';

const logoStyle = {
  marginBottom: '40px',
};

type LogoProps = {
  brand: Brand;
};

export const Logo = ({ brand }: LogoProps) => {
  return (
    <Img
      src={brand.logoUrl ?? TWENTY_LOGO_URL}
      alt={`${brand.name} logo`}
      width="40"
      height="40"
      style={logoStyle}
    />
  );
};
