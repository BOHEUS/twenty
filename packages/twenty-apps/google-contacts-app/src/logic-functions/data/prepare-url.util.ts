export const prepareUrl = (...variables: string[]) => {
  return '/connections?pageSize=1000&requestSyncToken=true'.concat(...variables);
}