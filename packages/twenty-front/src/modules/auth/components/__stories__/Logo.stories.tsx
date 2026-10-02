import { type Meta, type StoryObj } from '@storybook/react-vite';

import { Logo } from '@/auth/components/Logo';
import { brandState } from '@/client-config/states/brandState';
import { jotaiStore } from '@/ui/utilities/state/jotai/jotaiStore';
import { DEFAULT_BRAND } from 'twenty-shared/constants';
import { AVATAR_URL_MOCK, ComponentDecorator } from 'twenty-ui/testing';
import { MemoryRouterDecorator } from '~/testing/decorators/MemoryRouterDecorator';

const logoUrl = AVATAR_URL_MOCK;

const meta: Meta<typeof Logo> = {
  title: 'Modules/Auth/Logo',
  component: Logo,
  decorators: [
    ComponentDecorator,
    MemoryRouterDecorator,
    (Story) => {
      jotaiStore.set(brandState.atom, DEFAULT_BRAND);

      return <Story />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const WithSecondaryLogo: Story = {
  args: {
    primaryLogo: null,
    secondaryLogo: logoUrl,
    placeholder: 'A',
  },
};

export const WithPlaceholder: Story = {
  args: {
    primaryLogo: null,
    secondaryLogo: null,
    placeholder: 'B',
  },
};

export const WithPrimaryAndSecondaryLogo: Story = {
  args: {
    primaryLogo: logoUrl,
    secondaryLogo: logoUrl,
    placeholder: 'C',
  },
};

export const WithPrimaryLogoAndPlaceholder: Story = {
  args: {
    primaryLogo: logoUrl,
    secondaryLogo: null,
    placeholder: 'D',
  },
};

export const WithWhiteLabeledDefaultLogo: Story = {
  args: {
    primaryLogo: null,
    secondaryLogo: null,
    placeholder: 'E',
  },
  decorators: [
    (Story) => {
      jotaiStore.set(brandState.atom, {
        ...DEFAULT_BRAND,
        isWhiteLabeled: true,
        name: 'Acme CRM',
        logoUrl,
      });

      return <Story />;
    },
  ],
};
