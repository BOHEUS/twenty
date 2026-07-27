export const prepareUrl = (...variables: string[]) => {
  return '/connections?pageSize=1000' +
    '&requestSyncToken=true' +
    '&personFields=addresses,emailAddresses,names,organizations,phoneNumbers,photos,urls'.concat(...variables);
}