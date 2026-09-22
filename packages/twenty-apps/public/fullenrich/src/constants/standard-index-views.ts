import {
  getSystemViewUniversalIdentifier,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  SYSTEM_VIEW_KEYS,
} from 'twenty-sdk/define';

// Standard objects belong to Twenty's own application, and their index view
// identifier is derived from it. twenty-shared is not a dependency of an app,
// so the identifier is repeated here rather than imported.
const TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER =
  '20202020-64aa-4b6f-b003-9c74b97cee20';

const getIndexViewUniversalIdentifier = (objectUniversalIdentifier: string) =>
  getSystemViewUniversalIdentifier({
    objectMetadataApplicationUniversalIdentifier:
      TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
    objectUniversalIdentifier,
    viewKey: SYSTEM_VIEW_KEYS.INDEX,
  });

export const PERSON_INDEX_VIEW_UNIVERSAL_IDENTIFIER =
  getIndexViewUniversalIdentifier(
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  );

export const COMPANY_INDEX_VIEW_UNIVERSAL_IDENTIFIER =
  getIndexViewUniversalIdentifier(
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  );

// The standard Person index view ships 8 fields and Company 7. App fields are
// positioned well past them so a new standard field cannot collide.
export const APP_VIEW_FIELD_START_POSITION = 100;
