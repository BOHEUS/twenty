export type RequiredApplicationManifest = {
  universalIdentifier: string;
  // Semver range the installed version must satisfy; any version when omitted
  versionRange?: string;
};
