import { addDays } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';

import { SaveAndCancelButtons } from '@/settings/components/SaveAndCancelButtons/SaveAndCancelButtons';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SettingsSkeletonLoader } from '@/settings/components/SettingsSkeletonLoader';
import { SettingsDevelopersRoleSelector } from '@/settings/developers/components/SettingsDevelopersRoleSelector';
import { MAX_API_KEY_EXPIRATION_IN_DAYS } from '@/settings/developers/constants/MaxApiKeyExpirationInDays';
import { NEVER_EXPIRE_DELTA_IN_YEARS } from '@/settings/developers/constants/NeverExpireDeltaInYears';
import { apiKeyTokenFamilyState } from '@/settings/developers/states/apiKeyTokenFamilyState';
import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
import { SettingsPageLayout } from '@/settings/components/layout/SettingsPageLayout';
import { useMutation, useQuery } from '@apollo/client/react';
import { useLingui } from '@lingui/react/macro';
import { useStore } from 'jotai';
import { Key } from 'ts-key-enum';
import { SettingsPath } from 'twenty-shared/types';
import { getSettingsPath, isDefined } from 'twenty-shared/utils';
import {
  CreateApiKeyDocument,
  GenerateApiKeyTokenDocument,
  GetApiKeyRolesDocument,
  GetApiKeysDocument,
} from '~/generated-metadata/graphql';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';
import { SETTINGS_DEVELOPERS_TABS } from '@/settings/developers/constants/SettingsDevelopersTabs';
import { Section } from 'twenty-ui/components/layout';

export const SettingsDevelopersApiKeysNew = () => {
  const { t } = useLingui();
  const [generateOneApiKeyToken] = useMutation(GenerateApiKeyTokenDocument);
  const navigateSettings = useNavigateSettings();
  const { data: rolesData, loading: rolesLoading } = useQuery(
    GetApiKeyRolesDocument,
  );
  const roles = rolesData?.getApiKeyRoles ?? [];

  const [formValues, setFormValues] = useState<{
    name: string;
    expirationInDays: string;
    roleId: string;
  }>({
    expirationInDays: '0',
    name: '',
    roleId: '',
  });

  useEffect(() => {
    if (isDefined(rolesData?.getApiKeyRoles)) {
      const apiKeyAssignableRoles = rolesData.getApiKeyRoles.filter(
        (role) => role.canBeAssignedToApiKeys,
      );
      if (apiKeyAssignableRoles.length > 0) {
        setFormValues((prev) => {
          if (!prev.roleId) {
            return { ...prev, roleId: apiKeyAssignableRoles[0].id };
          }
          return prev;
        });
      }
    }
  }, [rolesData]);

  const [createApiKey] = useMutation(CreateApiKeyDocument, {
    refetchQueries: [GetApiKeysDocument],
    awaitRefetchQueries: true,
  });

  const jotaiStore = useStore();

  const setApiKeyTokenCallback = useCallback(
    (apiKeyId: string, token: string) => {
      jotaiStore.set(apiKeyTokenFamilyState.atomFamily(apiKeyId), token);
    },
    [jotaiStore],
  );

  const expirationInDays = Number(formValues.expirationInDays);
  const isExpirationValid =
    formValues.expirationInDays.trim() !== '' &&
    Number.isInteger(expirationInDays) &&
    expirationInDays >= 0 &&
    expirationInDays <= MAX_API_KEY_EXPIRATION_IN_DAYS;

  const handleSave = async () => {
    if (!formValues.name || !isExpirationValid) {
      return;
    }

    const expiresAt = addDays(
      new Date(),
      expirationInDays === 0
        ? NEVER_EXPIRE_DELTA_IN_YEARS * 365
        : expirationInDays,
    ).toISOString();

    const roleIdToUse = formValues.roleId;

    if (!roleIdToUse) {
      return;
    }

    const { data: newApiKeyData } = await createApiKey({
      variables: {
        input: {
          name: formValues.name.trim(),
          expiresAt,
          roleId: roleIdToUse,
        },
      },
    });

    const newApiKey = newApiKeyData?.createApiKey;

    if (!newApiKey) {
      return;
    }

    const tokenData = await generateOneApiKeyToken({
      variables: {
        apiKeyId: newApiKey.id,
        expiresAt: expiresAt,
      },
    });

    if (isDefined(tokenData.data?.generateApiKeyToken)) {
      setApiKeyTokenCallback(
        newApiKey.id,
        tokenData.data.generateApiKeyToken.token,
      );
      navigateSettings(SettingsPath.ApiKeyDetail, {
        apiKeyId: newApiKey.id,
      });
    }
  };

  const canSave =
    !!formValues.name && !!formValues.roleId && isExpirationValid;

  if (rolesLoading) {
    return <SettingsSkeletonLoader />;
  }

  return (
    <SettingsPageLayout
      title={t`New key`}
      links={[
        {
          children: t`Workspace`,
          href: getSettingsPath(SettingsPath.General),
        },
        {
          children: t`Developers`,
          href: getSettingsPath(
            SettingsPath.Developers,
            undefined,
            undefined,
            SETTINGS_DEVELOPERS_TABS.TABS_IDS.API,
          ),
        },
        { children: t`New Key` },
      ]}
      actionButton={
        <SaveAndCancelButtons
          isSaveDisabled={!canSave}
          onCancel={() => {
            navigateSettings(
              SettingsPath.Developers,
              undefined,
              undefined,
              undefined,
              SETTINGS_DEVELOPERS_TABS.TABS_IDS.API,
            );
          }}
          onSave={handleSave}
        />
      }
    >
      <SettingsPageContainer>
        <Section.Root>
          <Section.Header
            title={t`Name`}
            description={t`Name of your API key`}
          />
          <SettingsTextInput
            instanceId="api-key-new-name"
            placeholder={t`E.g. backoffice integration`}
            value={formValues.name}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing || e.keyCode === 229) {
                return;
              }
              if (e.key === Key.Enter) {
                handleSave();
              }
            }}
            onChange={(value) => {
              setFormValues((prevState) => ({
                ...prevState,
                name: value,
              }));
            }}
            fullWidth
          />
        </Section.Root>
        <Section.Root>
          <Section.Header
            title={t`Role`}
            description={t`What this API can do: Select a user role to define its permissions.`}
          />
          <SettingsDevelopersRoleSelector
            value={formValues.roleId}
            onChange={(roleId) => {
              setFormValues((prevState) => ({
                ...prevState,
                roleId,
              }));
            }}
            roles={roles}
          />
        </Section.Root>
        <Section.Root>
          <Section.Header
            title={t`Expiration Date`}
            description={t`Number of days until the API key expires.`}
          />
          <SettingsTextInput
            instanceId="api-key-new-expiration"
            type="number"
            min={0}
            max={MAX_API_KEY_EXPIRATION_IN_DAYS}
            step={1}
            rightAdornment={t`days`}
            hint={t`Set to 0 for a key that never expires.`}
            error={
              isExpirationValid
                ? undefined
                : t`Enter a whole number of days between 0 and ${MAX_API_KEY_EXPIRATION_IN_DAYS}.`
            }
            value={formValues.expirationInDays}
            onChange={(value) => {
              setFormValues((prevState) => ({
                ...prevState,
                expirationInDays: value,
              }));
            }}
            fullWidth
          />
        </Section.Root>
      </SettingsPageContainer>
    </SettingsPageLayout>
  );
};
