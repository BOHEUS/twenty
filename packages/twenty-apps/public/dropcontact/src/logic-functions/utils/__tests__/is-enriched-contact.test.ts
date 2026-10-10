import { describe, expect, it } from 'vitest';

import { isEnrichedContact } from 'src/logic-functions/utils/is-enriched-contact';

const INPUT = {
  first_name: 'Jane',
  last_name: 'Doe',
  company: 'Acme',
  custom_fields: { twenty_record_id: 'p1' },
};

describe('isEnrichedContact', () => {
  it('treats the input returned unchanged as not found', () => {
    expect(
      isEnrichedContact({
        contact: { first_name: 'Jane', last_name: 'Doe', company: 'Acme' },
        input: INPUT,
      }),
    ).toBe(false);
  });

  it('counts a qualified email as a match', () => {
    expect(
      isEnrichedContact({
        contact: {
          email: [{ email: 'jane@acme.com', qualification: 'nominative@pro' }],
        },
        input: INPUT,
      }),
    ).toBe(true);
  });

  it('counts a LinkedIn URL only when it was not sent', () => {
    const contact = { linkedin: 'https://linkedin.com/in/jane' };

    expect(isEnrichedContact({ contact, input: INPUT })).toBe(true);
    expect(
      isEnrichedContact({
        contact,
        input: { ...INPUT, linkedin: 'https://linkedin.com/in/jane' },
      }),
    ).toBe(false);
  });
});
