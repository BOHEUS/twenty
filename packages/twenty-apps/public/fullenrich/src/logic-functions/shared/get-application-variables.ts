import { isNonEmptyString } from '@sniptt/guards';

import {
  DEFAULT_ENRICH_FIELDS,
  FULLENRICH_API_KEY_VARIABLE,
  FULLENRICH_ADMIN_API_KEY_SERVER_VARIABLE,
  FULLENRICH_DATA_REQUIREMENTS_VARIABLE,
  FULLENRICH_ENRICH_FIELDS,
  FULLENRICH_REQUEST_CONSTRAINTS_VARIABLE,
  type FullEnrichEnrichField,
} from 'src/constants/application-variables';

// A workspace's own key wins; the instance-wide server variable covers the
// workspaces that have not set one. Server variables only exist on an
// installed registration, so none are present during local development.
export const getFullEnrichApiKey = ():
  | { success: true; apiKey: string }
  | { success: false; error: string } => {
  const workspaceApiKey = process.env[FULLENRICH_API_KEY_VARIABLE]?.trim();

  if (isNonEmptyString(workspaceApiKey)) {
    return { success: true, apiKey: workspaceApiKey };
  }

  const instanceApiKey =
    process.env[FULLENRICH_ADMIN_API_KEY_SERVER_VARIABLE]?.trim();

  if (isNonEmptyString(instanceApiKey)) {
    return { success: true, apiKey: instanceApiKey };
  }

  return {
    success: false,
    error: `Neither ${FULLENRICH_API_KEY_VARIABLE} nor ${FULLENRICH_ADMIN_API_KEY_SERVER_VARIABLE} is set. Add a key in the FullEnrich app settings.`,
  };
};

const parseMultiSelectVariable = (variableName: string): string[] => {
  const rawValue = process.env[variableName]?.trim();

  if (!isNonEmptyString(rawValue)) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(rawValue);

    if (Array.isArray(parsed)) {
      return parsed.filter(isNonEmptyString);
    }
  } catch {
    // not JSON, fall through to the comma-separated form
  }

  return rawValue
    .split(',')
    .map((value) => value.trim())
    .filter(isNonEmptyString);
};

export const getSelectedRequestConstraints = (): string[] =>
  parseMultiSelectVariable(FULLENRICH_REQUEST_CONSTRAINTS_VARIABLE);

export const getSelectedEnrichFields = (): FullEnrichEnrichField[] => {
  const selected = parseMultiSelectVariable(
    FULLENRICH_DATA_REQUIREMENTS_VARIABLE,
  ).filter((value): value is FullEnrichEnrichField =>
    FULLENRICH_ENRICH_FIELDS.includes(value as FullEnrichEnrichField),
  );

  return selected.length > 0 ? selected : DEFAULT_ENRICH_FIELDS;
};
