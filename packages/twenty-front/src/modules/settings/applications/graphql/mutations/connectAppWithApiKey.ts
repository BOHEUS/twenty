import { gql } from '@apollo/client';

export const CONNECT_APP_WITH_API_KEY = gql`
  mutation ConnectAppWithApiKey($input: ConnectAppWithApiKeyInput!) {
    connectAppWithApiKey(input: $input)
  }
`;
