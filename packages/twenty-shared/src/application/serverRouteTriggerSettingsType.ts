import { type HTTPMethod } from '@/types';

export type ServerRouteSignatureAlgorithm = 'sha1' | 'sha256' | 'sha512';
export type ServerRouteSignatureEncoding = 'hex' | 'base64';

// Checked by the platform before any app code runs, so a forged or unsigned
// request never costs a logic function execution. The secret is a server
// variable of the application registration (one per provider app, shared
// by every tenant), never a workspace variable: the resolver has not run
// yet, so the tenant is not known.
export type ServerRouteRequestAuthentication =
  | {
      type: 'HMAC_SIGNATURE';
      headerName: string;
      secretServerVariableName: string;
      // Digest of the raw request body; providers signing URL plus body
      // verify in the resolver with the twenty-sdk helpers instead.
      algorithm?: ServerRouteSignatureAlgorithm;
      encoding?: ServerRouteSignatureEncoding;
      signaturePrefix?: string;
    }
  | {
      type: 'HEADER_TOKEN';
      headerName: string;
      secretServerVariableName: string;
      tokenPrefix?: string;
    }
  | {
      type: 'QUERY_TOKEN';
      parameterName: string;
      secretServerVariableName: string;
    };

export type ServerRouteTriggerSettings = {
  forwardedRequestHeaders?: string[];
  httpMethods?: (HTTPMethod | `${HTTPMethod}`)[];
  requestAuthentication?: ServerRouteRequestAuthentication;
};
