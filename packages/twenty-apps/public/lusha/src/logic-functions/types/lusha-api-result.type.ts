import { type LushaRecord } from 'src/logic-functions/types/lusha-record.type';

export type LushaApiResult =
  | {
      success: true;
      data: LushaRecord[];
      // What Lusha billed for the request, which it leaves out when the plan
      // is not charged per call.
      creditsCharged?: number;
    }
  | {
      success: false;
      error: string;
      // The API key, the account or its credits are the problem, so every
      // other request of the run would fail the same way.
      isAccountFailure: boolean;
    };
