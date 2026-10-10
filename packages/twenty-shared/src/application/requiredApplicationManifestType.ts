export type RequiredApplicationManifest = {
  universalIdentifier: string;
  // Caret range (^1.2.0) the installed version must satisfy; any version when omitted
  versionRange?: string;
};
