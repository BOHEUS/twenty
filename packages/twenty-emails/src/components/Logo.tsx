import { Img } from 'react-email';
import { type Brand } from 'twenty-shared/types';

const TWENTY_LOGO_URL =
  'https://app.twenty.com/images/icons/windows11/Square150x150Logo.scale-100.png';

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
