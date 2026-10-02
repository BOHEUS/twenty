import { DEFAULT_BRAND } from 'twenty-shared/constants';

import { rebrandStandardText } from 'src/engine/core-modules/enterprise/utils/rebrand-standard-text.util';

const WHITE_LABELED_BRAND = {
  ...DEFAULT_BRAND,
  isWhiteLabeled: true,
  name: 'Acme $& CRM',
};

describe('rebrandStandardText', () => {
  it('replaces the product name in standard rows when white-labeled', () => {
    expect(
      rebrandStandardText({
        text: 'Calling Twenty Tools from Python (twenty_mcp)',
        brand: WHITE_LABELED_BRAND,
        isCustom: false,
      }),
    ).toBe('Calling Acme $& CRM Tools from Python (twenty_mcp)');
  });

  it('leaves custom rows untouched', () => {
    expect(
      rebrandStandardText({
        text: 'Ask Twenty',
        brand: WHITE_LABELED_BRAND,
        isCustom: true,
      }),
    ).toBe('Ask Twenty');
  });

  it('leaves text untouched without white-labeling', () => {
    expect(
      rebrandStandardText({
        text: 'Ask Twenty',
        brand: DEFAULT_BRAND,
        isCustom: false,
      }),
    ).toBe('Ask Twenty');
  });
});
