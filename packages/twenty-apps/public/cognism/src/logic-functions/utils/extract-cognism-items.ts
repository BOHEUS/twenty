import { isArray, isObject } from '@sniptt/guards';

const ITEM_COLLECTION_KEYS = [
  'results',
  'data',
  'contacts',
  'accounts',
  'records',
];

export const extractCognismItems = (json: unknown): unknown[] | undefined => {
  if (isArray(json)) {
    return json;
  }

  if (!isObject(json)) {
    return undefined;
  }

  const envelope = json as Record<string, unknown>;
  for (const key of ITEM_COLLECTION_KEYS) {
    const collection = envelope[key];
    if (isArray(collection)) {
      return collection;
    }
  }

  return undefined;
};
