export type SnovEmailCheck = {
  email?: string | null;
  smtp_status?: string | null;
  is_valid_format?: boolean | null;
  is_disposable?: boolean | null;
  is_webmail?: boolean | null;
  is_gibberish?: boolean | null;
  unknown_status_reason?: string | null;
};
