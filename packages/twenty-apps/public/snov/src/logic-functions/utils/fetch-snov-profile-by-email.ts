import { callSnov } from 'src/logic-functions/utils/call-snov';
import { type SnovEmailProfile } from 'src/types/snov-person-data';

type FetchSnovProfileByEmailResult =
  | { ok: true; profile: SnovEmailProfile | undefined }
  | { ok: false; httpStatus: number; message: string };

const PROFILE_KEYS = ['firstName', 'lastName', 'name', 'currentJobs', 'social'];

export const fetchSnovProfileByEmail = async (
  email: string,
): Promise<FetchSnovProfileByEmailResult> => {
  const response = await callSnov({
    method: 'POST',
    path: '/v1/get-profile-by-email',
    body: { form: new URLSearchParams({ email }) },
  });

  if (!response.ok) {
    return response;
  }

  const isFound =
    response.json.success !== false &&
    PROFILE_KEYS.some((key) => key in response.json);

  // The response body is untyped JSON; fields are read defensively by the mappers
  return {
    ok: true,
    profile: isFound ? (response.json as SnovEmailProfile) : undefined,
  };
};
