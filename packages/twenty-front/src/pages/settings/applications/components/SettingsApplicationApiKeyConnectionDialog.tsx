import { useMutation } from '@apollo/client/react';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { isNonEmptyString } from '@sniptt/guards';
import { useState } from 'react';
import { useToast } from 'twenty-ui/components/feedback';
import { Button } from 'twenty-ui/primitives/input';
import { Dialog } from 'twenty-ui/primitives/surfaces';

import { getToastOptionsFromError } from '@/error-handler/utils/getToastOptionsFromError';
import { GET_MY_CONNECTED_ACCOUNTS } from '@/settings/accounts/graphql/queries/getMyConnectedAccounts';
import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
import { DialogInstance } from '@/ui/layout/dialog/components/DialogInstance';
import { useDialog } from '@/ui/layout/dialog/hooks/useDialog';
import {
  ApplicationConnectedAccountsDocument,
  ConnectAppWithApiKeyDocument,
  type ConnectionProviderScope,
} from '~/generated-metadata/graphql';
import { type FrontendApplicationConnectionProvider } from '~/pages/settings/applications/types/FrontendApplicationConnectionProvider';

type SettingsApplicationApiKeyConnectionDialogProps = {
  dialogId: string;
  applicationId: string;
  provider: Pick<FrontendApplicationConnectionProvider, 'name' | 'displayName'>;
  scope: ConnectionProviderScope;
  reconnectingConnectedAccountId?: string;
};

const StyledActionSlot = styled.div`
  flex: 1;
`;

export const SettingsApplicationApiKeyConnectionDialog = ({
  dialogId,
  applicationId,
  provider,
  scope,
  reconnectingConnectedAccountId,
}: SettingsApplicationApiKeyConnectionDialogProps) => {
  const { t } = useLingui();
  const { closeDialog } = useDialog();
  const { enqueueToast } = useToast();
  const [apiKey, setApiKey] = useState('');

  const [connectAppWithApiKey, { loading }] = useMutation(
    ConnectAppWithApiKeyDocument,
    {
      refetchQueries: [
        {
          query: ApplicationConnectedAccountsDocument,
          variables: { applicationId },
        },
        { query: GET_MY_CONNECTED_ACCOUNTS },
      ],
      awaitRefetchQueries: true,
    },
  );

  const isValid = isNonEmptyString(apiKey.trim());

  const handleClose = () => {
    setApiKey('');
    closeDialog(dialogId);
  };

  const handleSubmit = async () => {
    if (!isValid || loading) {
      return;
    }

    try {
      await connectAppWithApiKey({
        variables: {
          input: {
            applicationId,
            providerName: provider.name,
            apiKey,
            scope,
            reconnectingConnectedAccountId,
          },
        },
      });

      enqueueToast({
        status: 'success',
        children: t`${provider.displayName} connected.`,
      });
      handleClose();
    } catch (error) {
      enqueueToast(getToastOptionsFromError({ error }));
    }
  };

  return (
    <DialogInstance
      dialogId={dialogId}
      dismissible
      onClose={() => setApiKey('')}
      onEnter={handleSubmit}
      renderInDocumentBody
    >
      {({ onKeyDown }) => (
        <Dialog.Popup
          onKeyDown={onKeyDown}
          size="compact"
          data-globally-prevent-click-outside
        >
          <Dialog.Header>
            <Dialog.Title>{t`Connect ${provider.displayName}`}</Dialog.Title>
            <Dialog.Description>
              {t`Paste an API key from ${provider.displayName}. It is checked with ${provider.displayName} before it is saved.`}
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>
            <SettingsTextInput
              instanceId={`${dialogId}-api-key`}
              label={t`API key`}
              type="password"
              value={apiKey}
              onChange={setApiKey}
              autoFocusOnMount
              fullWidth
            />
          </Dialog.Body>
          <Dialog.Footer>
            <StyledActionSlot>
              <Button
                onClick={handleClose}
                fullWidth
                variant="outline"
              >{t`Cancel`}</Button>
            </StyledActionSlot>
            <StyledActionSlot>
              <Button
                onClick={handleSubmit}
                fullWidth
                disabled={!isValid || loading}
                variant="solid"
                color="accent"
              >{t`Connect`}</Button>
            </StyledActionSlot>
          </Dialog.Footer>
        </Dialog.Popup>
      )}
    </DialogInstance>
  );
};
