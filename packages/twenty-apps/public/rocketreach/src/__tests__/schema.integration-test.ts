import { MetadataApiClient } from 'twenty-client-sdk/metadata';
import { describe, expect, it } from 'vitest';

import {
  APPLICATION_UNIVERSAL_IDENTIFIER,
  ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

type FieldMetadata = { name: string; universalIdentifier: string };

const findFieldUniversalIdentifiers = async (
  objectNameSingular: string,
): Promise<Set<string>> => {
  const client = new MetadataApiClient();

  const result = (await client.query({
    objects: {
      __args: { paging: { first: 200 }, filter: {} },
      edges: {
        node: {
          nameSingular: true,
          fields: {
            __args: { paging: { first: 500 }, filter: {} },
            edges: { node: { name: true, universalIdentifier: true } },
          },
        },
      },
    },
  })) as {
    objects?: {
      edges?: {
        node: {
          nameSingular: string;
          fields?: { edges?: { node: FieldMetadata }[] };
        };
      }[];
    };
  };

  const objectNode = result.objects?.edges?.find(
    (edge) => edge.node.nameSingular === objectNameSingular,
  )?.node;

  return new Set(
    (objectNode?.fields?.edges ?? []).map(
      (edge) => edge.node.universalIdentifier,
    ),
  );
};

describe('App installation', () => {
  it('should find the installed app in the applications list', async () => {
    const client = new MetadataApiClient();

    const result = await client.query({
      findManyApplications: {
        id: true,
        name: true,
        universalIdentifier: true,
      },
    });

    const app = result.findManyApplications.find(
      (application: { universalIdentifier: string }) =>
        application.universalIdentifier === APPLICATION_UNIVERSAL_IDENTIFIER,
    );

    expect(app).toBeDefined();
  });
});

describe('RocketReach fields', () => {
  it('should create every declared field on Person', async () => {
    const universalIdentifiers = await findFieldUniversalIdentifiers('person');

    for (const fieldUniversalIdentifier of Object.values(
      ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.person,
    )) {
      expect(universalIdentifiers).toContain(fieldUniversalIdentifier);
    }
  });

  it('should create every declared field on Company', async () => {
    const universalIdentifiers = await findFieldUniversalIdentifiers('company');

    for (const fieldUniversalIdentifier of Object.values(
      ROCKETREACH_FIELD_UNIVERSAL_IDENTIFIERS.company,
    )) {
      expect(universalIdentifiers).toContain(fieldUniversalIdentifier);
    }
  });
});
